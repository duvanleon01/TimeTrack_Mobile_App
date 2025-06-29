import React, { useState, useEffect } from 'react';
import { GetUserLocalUseCase } from '../../../Domain/useCases/userLocal/GetUserLocal';
import { FindAllRecordsUseCase } from '../../../Domain/useCases/attendance/FindAllRecords';
import { User } from '../../../Domain/entities/User';
import { UpdateTimestampUseCase } from '../../../Domain/useCases/attendance/UpdateTimestamp'; 
import { DeleteRecordUseCase } from '../../../Domain/useCases/attendance/DeleteRecord'; 
import { useNavigation } from '@react-navigation/native';

const AdminHistoryViewModel = () => {
    const [user, setUser] = useState<User | null>(null);
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<any>();

    useEffect(() => {
        const fetchUserSession = async () => {
            const userSession = await GetUserLocalUseCase();
            setUser(userSession);
        };
        fetchUserSession();
    }, []);

    const fetchAllRecords = async () => {
        setLoading(true);
        const allRecords = await FindAllRecordsUseCase();
        setRecords(allRecords);
        setLoading(false);
    };

    useEffect(() => {
        fetchAllRecords();
    }, []);

    const deleteRecord = async (recordId: number, userId: string) => {
        try {
            const response = await DeleteRecordUseCase(recordId, userId);
            if (response.success) {
                console.log('Registros eliminados:', response.data.deletedRecordIds);
                setRecords(records.filter(record => !response.data.deletedRecordIds.includes(record.id)));
            } else {
                console.error('Error al eliminar registro:', response.message);
            }
        } catch (error) {
            console.error('Error en la llamada a la API de eliminación:', error);
        }
    };

    const updateTimestamp = async (recordId: number, newTimestamp: string, userId: string) => {
        try {
            const response = await UpdateTimestampUseCase(recordId, newTimestamp, userId);
            if (response.success) {
                console.log('Timestamp actualizado:', response.data);
                await fetchAllRecords();
            } else {
                console.error('Error al actualizar timestamp:', response.message);
            }
        } catch (error) {
            console.error('Error en la llamada a la API de actualización:', error);
        }
    };

    return {
        records,
        loading,
        user,
        deleteRecord,
        updateTimestamp,
    };
};

export default AdminHistoryViewModel;