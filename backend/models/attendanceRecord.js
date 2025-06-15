const db = require('../config/config');
const util = require('util');

db.query = util.promisify(db.query); 

const AttendanceRecord = {};

// Buscar un registro de asistencia por ID
AttendanceRecord.findById = async (id) => {
    const sql = `SELECT id, user_id, event_type, timestamp, duration_minutes FROM attendance_records WHERE id = ?`;
    try {
        const records = await db.query(sql, [id]);
        return records[0] || null;
    } catch (err) {
        console.log('Error al consultar registro de asistencia por ID: ', err);
        throw err;
    }
};

// Registrar un nuevo evento de asistencia (Clock In o Clock Out)
AttendanceRecord.create = async (record) => {
    const sql = `INSERT INTO attendance_records(
                    user_id,
                    event_type,
                    timestamp,
                    created_at,
                    updated_at
                ) VALUES (?, ?, ?, ?, ?)`;
    try {
        const res = await db.query(sql, [
            record.user_id,
            record.event_type,
            new Date(),
            new Date(),
            new Date()
        ]);
        console.log('Registro de asistencia creado en DB: ', { id: res.insertId, ...record });
        return { id: res.insertId, ...record };
    } catch (err) {
        console.log('Error al crear registro de asistencia en DB: ', err);
        throw err;
    }
};

// Actualizar SÓLO la duración de un registro
AttendanceRecord.updateDuration = async (recordId, durationMinutes) => {
    const sql = `UPDATE attendance_records
                 SET duration_minutes = ?,
                     updated_at = ?
                 WHERE id = ?`;
    try {
        const res = await db.query(sql, [
            durationMinutes,
            new Date(),
            recordId
        ]);
        if (res.changedRows > 0) {
            console.log('Registro de asistencia (duración) actualizado en DB: ', recordId);
            return recordId;
        } else {
            console.log('Registro de asistencia (duración) no encontrado o sin cambios en DB: ', recordId);
            return null;
        }
    } catch (err) {
        console.log('Error al actualizar duración de registro de asistencia en DB: ', err);
        throw err;
    }
};

// Actualizar el timestamp de un registro de asistencia
AttendanceRecord.updateTimestamp = async (recordId, newTimestamp) => {
    const sql = `UPDATE attendance_records
                 SET timestamp = ?,
                     updated_at = ?
                 WHERE id = ?`;
    try {
        const res = await db.query(sql, [
            newTimestamp,
            new Date(),
            recordId
        ]);
        if (res.changedRows > 0) {
            console.log('Timestamp de registro de asistencia actualizado en DB: ', recordId);
            return recordId;
        } else {
            console.log('Timestamp de registro de asistencia no encontrado o sin cambios en DB: ', recordId);
            return null;
        }
    } catch (err) {
        console.log('Error al actualizar timestamp de registro de asistencia en DB: ', err);
        throw err;
    }
};

// Encontrar el CLOCK_IN y CLOCK_OUT de una jornada, dado un registro ID
AttendanceRecord.findPairForUpdate = async (recordId, userId) => {
    console.log('findPairForUpdate: Buscando par por ID secuencial para recordId', recordId, 'userId', userId);

    // 1. Obtener el registro que se está actualizando
    const currentRecord = await AttendanceRecord.findById(recordId); // Reutilizamos el método findById
    if (!currentRecord || currentRecord.user_id != userId) { // Validar también el user_id
        console.log('findPairForUpdate: Registro actual no encontrado o no pertenece al usuario.');
        return null;
    }
    console.log('findPairForUpdate: Registro actual encontrado:', currentRecord);

    let clockInRecord = null;
    let clockOutRecord = null;

    if (currentRecord.event_type === 'CLOCK_IN') {
        clockInRecord = currentRecord;
        // Buscar el CLOCK_OUT con ID = CLOCK_IN.id + 1
        const potentialClockOutId = currentRecord.id + 1;
        const potentialClockOut = await AttendanceRecord.findById(potentialClockOutId);
        
        // Verificar que sea un CLOCK_OUT y del mismo usuario
        if (potentialClockOut && potentialClockOut.user_id === userId && potentialClockOut.event_type === 'CLOCK_OUT') {
            clockOutRecord = potentialClockOut;
            console.log('findPairForUpdate: CLOCK_OUT emparejado por ID encontrado:', clockOutRecord);
        } else {
            console.log('findPairForUpdate: No se encontró CLOCK_OUT emparejado por ID secuencial.');
        }
    } else { // currentRecord.event_type === 'CLOCK_OUT'
        clockOutRecord = currentRecord;
        // Buscar el CLOCK_IN con ID = CLOCK_OUT.id - 1
        const potentialClockInId = currentRecord.id - 1;
        // Nos aseguramos que el ID sea > 0 para evitar IDs negativos
        if (potentialClockInId > 0) { 
            const potentialClockIn = await AttendanceRecord.findById(potentialClockInId);
            
            // Verificar que sea un CLOCK_IN y del mismo usuario
            if (potentialClockIn && potentialClockIn.user_id === userId && potentialClockIn.event_type === 'CLOCK_IN') {
                clockInRecord = potentialClockIn;
                console.log('findPairForUpdate: CLOCK_IN emparejado por ID encontrado:', clockInRecord);
            } else {
                console.log('findPairForUpdate: No se encontró CLOCK_IN emparejado por ID secuencial.');
            }
        } else {
            console.log('findPairForUpdate: ID CLOCK_IN potencial sería 0 o negativo.');
        }
    }
    
    console.log('findPairForUpdate: Resultado final del par:', { clockIn: clockInRecord, clockOut: clockOutRecord });
    return { clockIn: clockInRecord, clockOut: clockOutRecord };
};

// Obtener el último registro de asistencia de un usuario (puede ser IN o OUT)
AttendanceRecord.findLastClockInByUserId = async (userId) => { 
    const sql = `SELECT id, user_id, event_type, timestamp
                 FROM attendance_records
                 WHERE user_id = ? 
                 ORDER BY timestamp DESC
                 LIMIT 1`; 
    try {
        const records = await db.query(sql, [userId]);
        console.log('Último registro consultado en DB para user_id', userId, ':', records[0]);
        return records[0] || null;
    } catch (err) {
        console.log('Error al buscar el último registro en DB: ', err);
        throw err;
    }
};

// Obtener el historial de registros de asistencia para un usuario específico
AttendanceRecord.findByUserId = async (userId) => {
    const sql = `SELECT
                    id,
                    user_id,
                    event_type,
                    timestamp,
                    duration_minutes,
                    created_at
                 FROM
                    attendance_records
                 WHERE
                    user_id = ?
                 ORDER BY
                    timestamp DESC`;
    try {
        const records = await db.query(sql, [userId]);
        console.log('Historial de asistencia consultado en DB para user_id: ', userId, ' - Registros: ', records.length);
        return records;
    } catch (err) {
        console.log('Error al consultar historial por usuario en DB: ', err);
        throw err;
    }
};

// Obtener todos los registros de asistencia (para el administrador)
AttendanceRecord.findAll = async () => {
    const sql = `SELECT
                    ar.id,
                    ar.user_id,
                    u.name AS user_name,
                    u.lastname AS user_lastname,
                    u.email AS user_email,
                    ar.event_type,
                    ar.timestamp,
                    ar.duration_minutes,
                    ar.created_at
                 FROM
                    attendance_records ar
                 JOIN
                    users u ON ar.user_id = u.id
                 ORDER BY
                    ar.timestamp DESC`;
    try {
        const records = await db.query(sql);
        console.log('Todos los registros de asistencia consultados en DB: ', records.length);
        return records;
    } catch (err) {
        console.log('Error al consultar todos los registros de asistencia en DB: ', err);
        throw err;
    }
};

// Eliminar un registro de asistencia
AttendanceRecord.delete = async (recordId) => {
    const sql = `DELETE FROM attendance_records WHERE id = ?`;
    try {
        const res = await db.query(sql, [recordId]);
        if (res.affectedRows > 0) {
            console.log('Registro de asistencia eliminado en DB: ', recordId);
            return recordId;
        } else {
            console.log('Registro de asistencia no encontrado en DB para eliminar: ', recordId);
            return null;
        }
    } catch (err) {
        console.log('Error al eliminar registro de asistencia en DB: ', err);
        throw err;
    }
};

module.exports = AttendanceRecord;