import React, { useState, useEffect } from 'react';
import { GetUserLocalUseCase } from '../../../Domain/useCases/userLocal/GetUserLocal';
import { ClockInUseCase } from '../../../Domain/useCases/attendance/ClockIn';
import { ClockOutUseCase } from '../../../Domain/useCases/attendance/ClockOut';
import { FindLastClockInUseCase } from '../../../Domain/useCases/attendance/FindLastClockIn';
import { FindLastClockOutUseCase } from '../../../Domain/useCases/attendance/FindLastClockOut';
import { User } from '../../../Domain/entities/User';
import { RemoveUserLocalUseCase } from '../../../Domain/useCases/userLocal/RemoveUserLocal';
import { useNavigation } from '@react-navigation/native';

const DashboardViewModel = () => {
    const [user, setUser] = useState<User | null>(null);
    const [status, setStatus] = useState<'INACTIVE' | 'CLOCK_IN_ACTIVE'>('INACTIVE');
    const [lastRecordTimestamp, setLastRecordTimestamp] = useState<Date | null>(null);
    const [lastClockOutTimestamp, setLastClockOutTimestamp] = useState<Date | null>(null);
    const navigation = useNavigation<any>();

    useEffect(() => {
        const fetchUserSession = async () => {
            const userSession = await GetUserLocalUseCase();
            console.log('Sesión de usuario leída localmente:', userSession);
            setUser(userSession);
        };
        fetchUserSession();
    }, []);

    useEffect(() => {
        const checkUserStatus = async () => {
            if (user?.id) {
                const lastRecord = await FindLastClockInUseCase(user.id);
                if (lastRecord && lastRecord.event_type === 'CLOCK_IN') {
                    setStatus('CLOCK_IN_ACTIVE');
                    setLastRecordTimestamp(lastRecord.timestamp);
                } else {
                    setStatus('INACTIVE');
                    setLastRecordTimestamp(null);
                }
                const lastClockOut = await FindLastClockOutUseCase(user.id);
                if (lastClockOut) {
                    setLastClockOutTimestamp(lastClockOut.timestamp);
                }
            }
        };
        checkUserStatus();
    }, [user]);

    const clockIn = async () => {
        if (!user?.id) {
            console.log('Error: Usuario no autenticado.');
            return;
        }
        try {
            const response = await ClockInUseCase(user.id);
            if (response.success) {
                setStatus('CLOCK_IN_ACTIVE');
                setLastRecordTimestamp(new Date());
            } else {
                console.error('Error al registrar Clock In:', response.message);
            }
        } catch (error) {
            console.error('Error en la llamada a la API de Clock In:', error);
        }
    };

    const clockOut = async () => {
        if (!user?.id) {
            console.log('Error: Usuario no autenticado.');
            return;
        }
        try {
            const response = await ClockOutUseCase(user.id);
            if (response.success) {
                setStatus('INACTIVE');
                setLastRecordTimestamp(null);
                setLastClockOutTimestamp(new Date());
            } else {
                console.error('Error al registrar Clock Out:', response.message);
            }
        } catch (error) {
            console.error('Error en la llamada a la API de Clock Out:', error);
        }
    };

    const logout = async () => {
        await RemoveUserLocalUseCase();
        navigation.replace('Home');
    };

    return {
        user,
        status,
        lastRecordTimestamp,
        lastClockOutTimestamp,
        clockIn,
        clockOut,
        logout,
    };
};

export default DashboardViewModel;