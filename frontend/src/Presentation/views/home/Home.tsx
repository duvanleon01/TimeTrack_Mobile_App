import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import { RoundedButton } from '../../components/RoundedButton';
import { CustomTextInput } from '../../components/CustomTextInput';
import { StatusBar } from 'expo-status-bar';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../App';

import { MyColors } from '../../theme/AppTheme';
import useViewModel from './ViewModel';

const imageBackground = require('../../../../assets/Background.jpg');
const logoImage = require('../../../../assets/logo_timetrack.png');
const emailIcon = require('../../../../assets/email.png');
const passwordIcon = require('../../../../assets/password.png');


export const HomeScreen = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const { email, password, onChange, login } = useViewModel();

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
                <Text style={styles.logoText}>TIME TRACK MOBILE</Text>
            </View>
            <View style={styles.form}>
                <Text style={styles.formText}>INGRESAR</Text>
                
                <CustomTextInput
                    image={emailIcon}
                    placeholder='Correo Electrónico'
                    keyboardType='email-address'
                    property='email'
                    onChangeText={onChange}
                    value={email}
                />
                
                <CustomTextInput
                    image={passwordIcon}
                    placeholder='Contraseña'
                    keyboardType='default'
                    property='password'
                    onChangeText={onChange}
                    value={password}
                    secureTextEntry={true}
                />
                
                <View style={{ marginTop: 30 }}>
                    <RoundedButton text='ENVIAR' onPress={login} />
                </View>
                
                <View style={styles.formRegister}>
                    <Text>¿No tienes cuenta?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
                        <Text style={styles.formRegisterText}>Regístrate</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <StatusBar style="auto" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MyColors.background,
    },
    imageBackground: {
        width: '100%',
        height: '100%',
        opacity: 0.9,
        resizeMode: 'cover',
    },
    logoContainer: {
        position: 'absolute',
        alignSelf: 'center',
        top: '15%',
        alignItems: 'center',
    },
    logoImage: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    logoText: {
        color: MyColors.background,
        textAlign: 'center',
        fontSize: 24,
        marginTop: 10,
        fontWeight: 'bold',
    },
    form: {
        width: '100%',
        height: '40%',
        backgroundColor: MyColors.white,
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 30,
    },
    formText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: MyColors.black,
    },
    formIcon: {
        width: 25,
        height: 25,
        marginTop: 5,
    },
    formInput: {
        flexDirection: 'row',
        marginTop: 30,
    },
    formTextInput: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#AAAAAA',
        marginLeft: 15,
        color: MyColors.black,
    },
    formRegister: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    formRegisterText: {
        fontStyle: 'italic',
        color: MyColors.primary,
        borderBottomWidth: 1,
        borderBottomColor: MyColors.primary,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});