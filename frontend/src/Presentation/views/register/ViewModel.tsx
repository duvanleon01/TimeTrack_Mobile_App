import React, { useState } from 'react';
import { RegisterAuthUseCase } from '../../../Domain/useCases/auth/RegisterAuth';
import { useNavigation } from '@react-navigation/native';

const RegisterViewModel = () => {
    const [values, setValues] = useState({
        name: '',
        lastname: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    // OBTENER LA INSTANCIA DE NAVEGACIÓN
    const navigation = useNavigation<any>();

    const onChange = (property: string, value: any) => {
        setValues({ ...values, [property]: value });
    };

    const register = async () => {
        if (values.password !== values.confirmPassword) {
            console.log('Las contraseñas no coinciden');
            return;
        }

        try {
            const response = await RegisterAuthUseCase(values);

            console.log('Respuesta de la API:', JSON.stringify(response));

            if (response.success) {
                console.log('¡Registro exitoso!');
                navigation.navigate('Home'); 
            } else {
                console.log('Error en el registro:', response.message);
            }
        } catch (error) {
            console.error('Ocurrió un error inesperado al registrar el usuario:', error);
        }
    };

    return {
        ...values,
        onChange,
        register,
    };
};

export default RegisterViewModel;