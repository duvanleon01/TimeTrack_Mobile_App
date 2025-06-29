import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, ToastAndroid } from 'react-native';
import { RoundedButton } from '../../components/RoundedButton';
import { CustomTextInput } from '../../components/CustomTextInput';
import { StatusBar } from 'expo-status-bar';

import useViewModel from './ViewModel';
import { MyColors } from '../../theme/AppTheme';

const imageBackground = require('../../../../assets/Background.jpg');
const logoImage = require('../../../../assets/logo_timetrack.png');
const userIcon = require('../../../../assets/user.png');
const emailIcon = require('../../../../assets/email.png');
const phoneIcon = require('../../../../assets/phone.png');
const passwordIcon = require('../../../../assets/password.png');
const confirmPasswordIcon = require('../../../../assets/confirm_password.png');

export const RegisterScreen = () => {
    // Usar la lógica del ViewModel para estado y funciones
    const { name, lastname, phone, email, password, confirmPassword, onChange, register } = useViewModel();

    return (
    <View style={styles.container}>
        <Image
            source={imageBackground}
            style={styles.imageBackground}
        />
        <View style={styles.logoContainer}>
            <Image
                source={logoImage}
                style={styles.logoImage}
            />
            <Text style={styles.logoText}>REGISTRARSE</Text>
        </View>
        <View style={styles.form}>
            <ScrollView> 
                <Text style={styles.formText}>INGRESAR DATOS</Text>

                <CustomTextInput
                    image={userIcon}
                    placeholder='Nombres'
                    keyboardType='default'
                    property='name'
                    onChangeText={onChange}
                    value={name}
                />

                <CustomTextInput
                    image={userIcon}
                    placeholder='Apellidos'
                    keyboardType='default'
                    property='lastname'
                    onChangeText={onChange}
                    value={lastname}
                />
                
                <CustomTextInput
                    image={emailIcon}
                    placeholder='Correo Electrónico'
                    keyboardType='email-address'
                    property='email'
                    onChangeText={onChange}
                    value={email}
                />

                <CustomTextInput
                    image={phoneIcon}
                    placeholder='Teléfono'
                    keyboardType='numeric'
                    property='phone'
                    onChangeText={onChange}
                    value={phone}
                />

                <CustomTextInput
                    image={passwordIcon}
                    placeholder='Contraseña'
                    keyboardType='default'
                    secureTextEntry={true}
                    property='password'
                    onChangeText={onChange}
                    value={password}
                />

                <CustomTextInput
                    image={confirmPasswordIcon}
                    placeholder='Confirmar Contraseña'
                    keyboardType='default'
                    secureTextEntry={true}
                    property='confirmPassword'
                    onChangeText={onChange}
                    value={confirmPassword}
                />

                <View style={{ marginTop: 20 }}>
                    <RoundedButton text='CONFIRMAR' onPress={register} />
                </View>
            </ScrollView>
        </View>
        <StatusBar style="auto" />
    </View>
);
};

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        backgroundColor: MyColors.background 
    },
    
    imageBackground: {
        width: '100%',
        height: '100%',
        opacity: 0.9,
        resizeMode: 'cover'
    },
    
    logoContainer: {
        position: 'absolute',
        alignSelf: 'center',
        top: '5%',
        alignItems: 'center' 
    },
    
    logoImage: {
        width: 150,
        height: 150,
        resizeMode: 'contain'
    },
    
    logoText: {
        color: MyColors.white,
        textAlign: 'center',
        fontSize: 24,
        marginTop: 10,
        fontWeight: 'bold'
    },
    
    form: {
        width: '100%',
        height: '70%',
        backgroundColor: MyColors.white,
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 30
    },
    
    formText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: MyColors.black
    },
    
    formIcon: {
        width: 25,
        height: 25,
        marginTop: 5
    },
    
    formInput: {
        flexDirection: 'row',
        marginTop: 25
    },
    
    formTextInput: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#AAAAAA',
        marginLeft: 15,
        color: MyColors.black 
    },
});
