import React, { useState, useEffect } from 'react'; 
import { RemoveUserLocalUseCase } from '../../../../Domain/useCases/userLocal/RemoveUserLocal';
import { GetUserLocalUseCase } from '../../../../Domain/useCases/userLocal/GetUserLocal';
import { User } from '../../../../Domain/entities/User';

export const ProfileInfoViewModel = () => {
    const [user, setUser] = useState<User | null>(null);
    const removeSession = async () => {
        await RemoveUserLocalUseCase(); 
    };

useEffect(() => {
        const fetchUser = async () => {
            const userSession = await GetUserLocalUseCase();
            setUser(userSession);
        };
        fetchUser();
    }, []);
    
    return {
        user,
        removeSession 
    };
};

export default ProfileInfoViewModel;