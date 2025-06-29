const AttendanceRecord = require('../models/attendanceRecord');
const moment = require('moment');

function formatDuration(totalMinutes) {
    if (totalMinutes === null || isNaN(totalMinutes)) {
        return "N/A";
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
}

module.exports = {

    async clockIn(req, res) {
        const userId = req.body.user_id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'El ID de usuario es requerido para el Clock In.'
            });
        }

        try {
            // 1. Obtener el último registro del usuario para validar secuencia
            const lastRecord = await AttendanceRecord.findLastClockInByUserId(userId);

            if (lastRecord && lastRecord.event_type === 'CLOCK_IN') {
                const clockInTime = moment(lastRecord.timestamp);
                const currentTime = moment();
                const durationSinceLastIn = currentTime.diff(clockInTime, 'minutes');

                if (durationSinceLastIn >= (24 * 60)) {
                    console.warn(`Clock In de user_id ${userId} ha excedido 24 horas. Realizando auto-Clock Out.`);
                    
                    // Realizar el auto-ClockOut para la jornada anterior
                    const autoClockOutRecord = {
                        user_id: userId,
                        event_type: 'CLOCK_OUT',
                    };
                    const autoClockOutData = await AttendanceRecord.create(autoClockOutRecord);

                    const autoDurationMinutes = currentTime.diff(clockInTime, 'minutes');
                    await AttendanceRecord.updateDuration(lastRecord.id, autoDurationMinutes);

                    // Después del auto-ClockOut exitoso, podemos proceder con el nuevo Clock In
                } else {
                    // Si hay un CLOCK_IN activo y NO ha excedido las 24h, NO SE PERMITE otro CLOCK_IN.
                    console.log(`Intento de Clock In para user_id ${userId} cuando ya hay uno activo.`);
                    return res.status(400).json({
                        success: false,
                        message: 'Ya existe un Clock In activo para este usuario. Por favor, realice un Clock Out primero.'
                    });
                }
            }

            // 2. Registrar el nuevo CLOCK_IN
            const record = {
                user_id: userId,
                event_type: 'CLOCK_IN',
            };
            const data = await AttendanceRecord.create(record);
            return res.status(201).json({
                success: true,
                message: 'Clock In registrado exitosamente.',
                data: data
            });

        } catch (err) {
            console.error('Error al registrar Clock In:', err);
            return res.status(501).json({
                success: false,
                message: 'Error al registrar la entrada (Clock In)',
                error: err.message || err
            });
        }
    },

    async clockOut(req, res) {
        const userId = req.body.user_id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'El ID de usuario es requerido para el Clock Out.'
            });
        }

        try {
            // 1. Obtener el último registro del usuario para validar secuencia
            const lastRecord = await AttendanceRecord.findLastClockInByUserId(userId);

            // Validación: Un CLOCK_OUT es válido SÓLO si el último registro fue un CLOCK_IN
            if (!lastRecord || lastRecord.event_type === 'CLOCK_OUT') {
                console.log(`Intento de Clock Out para user_id ${userId} sin Clock In activo.`);
                return res.status(400).json({
                    success: false,
                    message: 'No se puede registrar Clock Out. No hay un Clock In activo para este usuario.'
                });
            }

            const lastClockInRecord = lastRecord;

            const clockInTimeForCheck = moment(lastClockInRecord.timestamp);
            const currentTimeForCheck = moment();
            const durationSinceLastInCheck = currentTimeForCheck.diff(clockInTimeForCheck, 'minutes');

            if (durationSinceLastInCheck >= (24 * 60)) {
                 console.warn(`Clock In de user_id ${userId} ha excedido 24 horas al intentar Clock Out. Registrando un Clock Out con duración hasta 24h.`);
            }

            // 3. Registrar el nuevo CLOCK_OUT
            const clockOutRecord = {
                user_id: userId,
                event_type: 'CLOCK_OUT',
            };
            const newClockOutData = await AttendanceRecord.create(clockOutRecord);

            // 4. Calcular la duración y actualizar el registro de CLOCK_IN
            const clockInTime = moment(lastClockInRecord.timestamp);
            const clockOutTime = moment(newClockOutData.timestamp);
            const durationMinutes = clockOutTime.diff(clockInTime, 'minutes');

            const updatedRecordId = await AttendanceRecord.updateDuration(lastClockInRecord.id, durationMinutes);

            if (updatedRecordId === null) {
                console.warn('Advertencia: El Clock Out se registró, pero no se pudo actualizar la duración del Clock In (ID no encontrado).');
                return res.status(201).json({
                    success: true,
                    message: 'Clock Out registrado, pero hubo un error al calcular/actualizar la duración del Clock In. Contacte al administrador.',
                    data: {
                        clockOutRecord: newClockOutData,
                        durationMinutes: formatDuration(durationMinutes)
                    }
                });
            }

            return res.status(201).json({
                success: true,
                message: 'Clock Out registrado y duración calculada exitosamente',
                data: {
                    clockOutRecord: newClockOutData,
                    durationMinutes: formatDuration(durationMinutes),
                    relatedClockInId: updatedRecordId
                }
            });

        } catch (err) {
            console.error('Error general en Clock Out:', err);
            return res.status(500).json({
                success: false,
                message: 'Ocurrió un error inesperado al procesar Clock Out.',
                error: err.message || err
            });
        }
    },

    // Obtener historial de registros para un usuario (empleado)
    async getRecordsByUserId(req, res) {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'El ID de usuario es requerido para consultar el historial.'
            });
        }

        try {
            const records = await AttendanceRecord.findByUserId(userId);
            const formattedRecords = records.map(record => ({
                ...record,
                duration_formatted: formatDuration(record.duration_minutes)
            }));

            return res.status(200).json({
                success: true,
                message: 'Historial de asistencia del usuario obtenido exitosamente',
                data: formattedRecords
            });
        } catch (err) {
            console.error('Error al obtener historial por usuario:', err);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener el historial de asistencia',
                error: err.message || err
            });
        }
    },

    // Obtener historial de todos los registros (administrador)
    async getAllRecords(req, res) {
        try {
            const records = await AttendanceRecord.findAll();
            const formattedRecords = records.map(record => ({
                ...record,
                duration_formatted: formatDuration(record.duration_minutes)
            }));

            return res.status(200).json({
                success: true,
                message: 'Todos los registros de asistencia obtenidos exitosamente',
                data: formattedRecords
            });
        } catch (err) {
            console.error('Error al obtener todos los registros de asistencia:', err);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener todos los registros de asistencia',
                error: err.message || err
            });
        }
    },

    // Actualizar el timestamp de un registro de asistencia (para administrador)
    async updateRecordTimestamp(req, res) {
        const { recordId, newTimestamp, user_id } = req.body;

        if (!recordId || !newTimestamp || !user_id) {
            return res.status(400).json({
                success: false,
                message: 'ID del registro, ID de usuario y nuevo timestamp son requeridos.'
            });
        }

        try {
            const parsedNewTimestamp = moment(newTimestamp).toDate(); 
            if (!moment(parsedNewTimestamp).isValid()) { 
                 return res.status(400).json({
                    success: false,
                    message: 'Formato de fecha/hora para newTimestamp inválido.'
                });
            }

            // 1. Obtener el registro que se va a actualizar
            const currentRecordToUpdate = await AttendanceRecord.findById(recordId);
            if (!currentRecordToUpdate || currentRecordToUpdate.user_id != user_id) {
                return res.status(404).json({
                    success: false,
                    message: 'Registro de asistencia no encontrado o no pertenece a este usuario.'
                });
            }

            // 2. Actualizar el timestamp del registro especificado
            const updatedRecordId = await AttendanceRecord.updateTimestamp(recordId, parsedNewTimestamp);

            if (updatedRecordId === null) {
                return res.status(404).json({
                    success: false,
                    message: 'Registro de asistencia no encontrado para actualizar el timestamp.'
                });
            }

            // 3. Encontrar el par CLOCK_IN / CLOCK_OUT para la jornada afectada
            const { clockIn, clockOut } = await AttendanceRecord.findPairForUpdate(recordId, user_id);

            console.log('--- Depuración Recalculo ---'); 
            console.log('ClockIn record:', clockIn);     
            console.log('ClockOut record:', clockOut);   

            let recalculatedDurationMinutes = null;
            let clockInToUpdateId = null;

            // --- Lógica de VALIDACIÓN ESTRICTA Y RECALCULO ---
            if (clockIn && clockOut) {
                const recalculatedClockInTime = moment(clockIn.timestamp);
                const recalculatedClockOutTime = moment(clockOut.timestamp);

                console.log('Recalculated Clock In Time:', recalculatedClockInTime.format());
                console.log('Recalculated Clock Out Time:', recalculatedClockOutTime.format());
                console.log('isSameOrBefore result:', recalculatedClockOutTime.isSameOrBefore(recalculatedClockInTime)); 

                // VALIDACIÓN CRÍTICA: CLOCK_OUT debe ser ESTRICTAMENTE POSTERIOR a CLOCK_IN
                if (recalculatedClockOutTime.isSameOrBefore(recalculatedClockInTime)) {
                    console.error(`Error de lógica de tiempo: Clock Out (${recalculatedClockOutTime.format()}) no puede ser igual o anterior a Clock In (${recalculatedClockInTime.format()}) para user_id: ${user_id}. RECHAZANDO ACTUALIZACIÓN.`); // Mensaje de error más fuerte
                    
                    return res.status(400).json({
                        success: false,
                        message: 'Error de secuencia de tiempo: La hora de Clock Out debe ser posterior a la hora de Clock In y esta última debe ser previa a la hora del Clock Out. Actualización rechazada.'
                    });
                }

                recalculatedDurationMinutes = recalculatedClockOutTime.diff(recalculatedClockInTime, 'minutes');
                clockInToUpdateId = clockIn.id;

            } else if (clockIn && !clockOut) {
                console.log('Solo Clock In encontrado, sin Clock Out asociado. user_id:', user_id);
                recalculatedDurationMinutes = null;
                clockInToUpdateId = clockIn.id;

            } else if (clockOut && !clockIn) {
                console.log('Solo Clock Out encontrado, sin Clock In asociado. user_id:', user_id);
                // Si solo hay un CLOCK_OUT (y fue el que se actualizó) y no tiene CLOCK_IN vinculado.
                console.log(`ClockOut actualizado (ID: ${recordId}) no tiene un ClockIn vinculado. No se recalcula duración.`);
            } else {
                console.log('No se encontró un par ClockIn/ClockOut para el registro actualizado. user_id:', user_id); 
            }

            // 4. Actualizar la duración del CLOCK_IN correspondiente (si aplica)
            if (clockInToUpdateId !== null) {
                await AttendanceRecord.updateDuration(clockInToUpdateId, recalculatedDurationMinutes);
                console.log(`Duración de CLOCK_IN (ID: ${clockInToUpdateId}) recalculada a ${recalculatedDurationMinutes} minutos.`);
            }

            return res.status(200).json({
                success: true,
                message: 'Timestamp del registro de asistencia actualizado exitosamente y duración recalculada.',
                data: {
                    id: updatedRecordId,
                    newTimestamp: newTimestamp,
                    recalculatedDurationMinutes: formatDuration(recalculatedDurationMinutes),
                    affectedClockInId: clockInToUpdateId
                }
            });

        } catch (err) {
            console.error('Error al actualizar el timestamp de registro de asistencia y recalcular duración:', err);
            return res.status(500).json({
                success: false,
                message: 'Ocurrió un error al actualizar el timestamp del registro y recalcular la duración.',
                error: err.message || err
            });
        }
    },

    // Eliminar un registro de asistencia (para administrador). Eliminará el registro y su par (CLOCK_IN/OUT) simultáneamente.
    async deleteRecord(req, res) {
         console.log('DELETE RECORD: req.body recibido:', req.body);
         const { recordId, user_id } = req.body; 

        if (!recordId || !user_id) {
            return res.status(400).json({
                success: false,
                message: 'ID del registro y ID de usuario son requeridos para eliminar.'
            });
        }

        try {
            // 1. Encontrar el registro actual que se quiere eliminar
            const recordToDelete = await AttendanceRecord.findById(recordId);
            if (!recordToDelete || recordToDelete.user_id != user_id) {
                return res.status(404).json({
                    success: false,
                    message: 'Registro no encontrado o no pertenece a este usuario.'
                });
            }

            // 2. Encontrar el par CLOCK_IN / CLOCK_OUT de la jornada
            const { clockIn, clockOut } = await AttendanceRecord.findPairForUpdate(recordId, user_id);

            let idsToDelete = [];
            let message = '';

            if (clockIn && clockOut) {
                // Si encuentra un par completo, elimina ambos
                idsToDelete.push(clockIn.id);
                idsToDelete.push(clockOut.id);
                message = `Registros de Clock In (ID: ${clockIn.id}) y Clock Out (ID: ${clockOut.id}) eliminados exitosamente.`;
            } else if (recordToDelete.event_type === 'CLOCK_IN' && !clockOut) {
                // Es un CLOCK_IN sin un CLOCK_OUT, se elimina solo el CLOCK_IN
                idsToDelete.push(recordToDelete.id);
                message = `Registro de Clock In (ID: ${recordToDelete.id}) eliminado exitosamente (sin Clock Out asociado).`;
            } else if (recordToDelete.event_type === 'CLOCK_OUT' && !clockIn) {
                 // Es un CLOCK_OUT sin un CLOCK_IN previo, se elimina solo el CLOCK_OUT
                idsToDelete.push(recordToDelete.id);
                message = `Registro de Clock Out (ID: ${recordToDelete.id}) eliminado exitosamente (sin Clock In asociado).`;
            } else {
                idsToDelete.push(recordToDelete.id);
                message = `Registro (ID: ${recordId}) eliminado exitosamente.`;
            }
            
            if (idsToDelete.length === 0) {
                return res.status(500).json({
                    success: false,
                    message: 'No se pudo determinar el registro a eliminar.'
                });
            }

            // 3. Ejecutar la eliminación de los IDs determinados
            let successfullDeletions = [];
            for (const idToDelete of idsToDelete) {
                const deletedId = await AttendanceRecord.delete(idToDelete);
                if (deletedId !== null) {
                    successfullDeletions.push(deletedId);
                }
            }

            if (successfullDeletions.length === 0) {
                 return res.status(500).json({
                    success: false,
                    message: 'Ocurrió un error al intentar eliminar el registro o su par.'
                });
            }

            return res.status(200).json({
                success: true,
                message: message,
                data: { deletedRecordIds: successfullDeletions }
            });

        } catch (err) {
            console.error('Error al eliminar registro de asistencia y su par:', err);
            return res.status(500).json({
                success: false,
                message: 'Ocurrió un error inesperado al eliminar el registro.',
                error: err.message || err
            });
        }
    }
};