import React, { useState, useEffect } from 'react';
import { FindAllUsersUseCase } from '../../../Domain/useCases/user/FindAllUsers';
import { DeleteUserUseCase } from '../../../Domain/useCases/user/DeleteUser';
import { UpdateUserUseCase } from '../../../Domain/useCases/user/UpdateUser';
import { User } from '../../../Domain/entities/User';

const AdminUsersViewModel = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAllUsers = async () => {
        setLoading(true);
        const allUsers = await FindAllUsersUseCase();
        setUsers(allUsers);
        setLoading(false);
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const deleteUser = async (userId: string) => {
        try {
            const response = await DeleteUserUseCase(userId);
            if (response.success) {
                console.log('Usuario eliminado:', response.data);
                setUsers(users.filter(user => user.id !== userId));
            } else {
                console.error('Error al eliminar usuario:', response.message);
            }
        } catch (error) {
            console.error('Error en la llamada a la API de eliminación de usuario:', error);
        }
    };

    const updateUser = async (updatedUser: User) => {
        console.log('ViewModel: updateUser llamado con datos:', updatedUser);
        try {
            const response = await UpdateUserUseCase(updatedUser);

            if (response.success) {
                console.log('Usuario actualizado:', response.data);
                setUsers(prevUsers => prevUsers.map(user => 
                    user.id === updatedUser.id ? updatedUser : user
                ));
            } else {
                console.error('Error al actualizar usuario:', response.message);
            }
        } catch (error) {
            console.error('Error en la llamada a la API de actualización de usuario:', error);
        }
    };

    return {
        users,
        loading,
        deleteUser,
        updateUser,
    };
};

export default AdminUsersViewModel;