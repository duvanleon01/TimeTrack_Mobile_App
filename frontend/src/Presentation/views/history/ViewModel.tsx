import React, { useState, useEffect } from 'react';
import { GetUserLocalUseCase } from '../../../Domain/useCases/userLocal/GetUserLocal';
import { FindRecordsByUserIdUseCase } from '../../../Domain/useCases/attendance/FindRecordsByUserId'; 
import { User } from '../../../Domain/entities/User';

const HistoryViewModel = () => {
    const [user, setUser] = useState<User | null>(null);
    const [records, setRecords] = useState<any[]>([]); 
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchUserSession = async () => {
            const userSession = await GetUserLocalUseCase();
            setUser(userSession);
        };
        fetchUserSession();
    }, []);

    useEffect(() => {
        const fetchUserRecords = async () => {
            if (user?.id) {
                setLoading(true);
                const userRecords = await FindRecordsByUserIdUseCase(user.id);
                setRecords(userRecords);
                setLoading(false);
            }
        };
        fetchUserRecords();
    }, [user]); 

    return {
        records,
        loading,
        user,
    };
};

export default HistoryViewModel;