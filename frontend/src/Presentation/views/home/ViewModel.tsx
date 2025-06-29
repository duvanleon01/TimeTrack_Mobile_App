import React, { useState, useEffect } from 'react';
import { LoginAuthUseCase } from '../../../Domain/useCases/auth/LoginAuth';
import { useNavigation } from '@react-navigation/native';
import { SaveUserUseCase } from '../../../Domain/useCases/userLocal/SaveUserLocal';
import { GetUserLocalUseCase } from '../../../Domain/useCases/userLocal/GetUserLocal';

const HomeViewModel = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation<any>();

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUserSession = async () => {
            const userSession = await GetUserLocalUseCase();
            console.log('Sesión de usuario leída localmente:', userSession);
            setUser(userSession);
        };
        fetchUserSession();
    }, []);

    useEffect(() => {
        if (user?.session_token) {
            console.log('Usuario con sesión activa. Redirigiendo a perfil.');
            navigation.navigate('ProfileInfoScreen');
        }
    }, [user, navigation]);

    useEffect(() => {
        if (errorMessage !== '') {
            console.log('Error en la UI:', errorMessage);
        }
    }, [errorMessage]);

    const onChange = (property: string, value: any) => {
        setValues({ ...values, [property]: value });
    };

    const login = async () => {
        console.log('----- FUNCIÓN LOGIN EJECUTADA -----');
        
        if (values.email === '' || values.password === '') {
            setErrorMessage('El email y/o la contraseña son requeridos.');
            return;
        }

        try {
            const response = await LoginAuthUseCase(values.email, values.password);
            
            console.log('Respuesta de la API:', response);

            if (response.success) {
                console.log('Login exitoso!');
                await SaveUserUseCase(response.data);
                setUser(response.data);
                navigation.navigate('DashboardScreen');
            } else {
                setErrorMessage(response.message);
                console.log('Login fallido:', response.message);
            }
        } catch (error) {
            setErrorMessage('Ocurrió un error inesperado al conectar con el servidor.');
            console.error('Error en la llamada a la API:', error);
        }
    };

    return {
        ...values,
        onChange,
        login,
        errorMessage
    };
};

export default HomeViewModel;