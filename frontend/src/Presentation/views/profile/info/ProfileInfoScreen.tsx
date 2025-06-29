import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { RootStackParamList } from '../../../../../App';
import useViewModel from './ViewModel';
import { useNavigation } from '@react-navigation/native';
import { RoundedButton } from '../../../components/RoundedButton';
import { MyColors } from '../../../theme/AppTheme';

const clockIcon = require('../../../../../assets/clock_icon.png');
const historyIcon = require('../../../../../assets/history_icon.png'); 
const generalhistoryIcon = require('../../../../../assets/general_history_icon.png'); 
const usersIcon = require('../../../../../assets/users_icon.png'); 

interface Props extends StackScreenProps<RootStackParamList, 'ProfileInfoScreen'> {};

export const ProfileInfoScreen = () => {
    const navigation = useNavigation<any>();
    const { user, removeSession } = useViewModel();

    const logout = async () => {
        await removeSession();
        navigation.replace('Home');
    };

    const isAdmin = user?.rol === 'administrador';

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenido, {user?.name} {user?.lastname}</Text>
            <Text style={styles.text}>Rol: {user?.rol}</Text>

            <View style={styles.buttonsContainer}>
                {/* *** BOTONES PARA USUARIO NORMAL *** */}
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DashboardScreen')}>
                    <Image source={clockIcon} style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Clock In/Out</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HistoryScreen')}>
                    <Image source={historyIcon} style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Historial Propio</Text>
                </TouchableOpacity>

                {isAdmin && (
                    <>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AdminHistoryScreen')}>
                            <Image source={generalhistoryIcon} style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>Historial General</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AdminUsersScreen')}>
                            <Image source={usersIcon} style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>Gestión de Usuarios</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            <View style={styles.logoutButtonContainer}>
                <Button
                    onPress={logout}
                    title="Cerrar Sesion"
                    color="#FF0000"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: MyColors.white,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: MyColors.black,
    },
    text: {
        fontSize: 18,
        color: MyColors.secondary,
        marginBottom: 30,
    },
    buttonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 20,
    },
    button: {
        width: 150,
        height: 120,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: MyColors.primary,
        borderRadius: 15,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonIcon: {
        width: 60,
        height: 60,
        tintColor: MyColors.white,
        marginBottom: 5,
    },
    buttonText: {
        color: MyColors.white,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    logoutButtonContainer: {
        marginTop: 40,
        width: '60%',
    },
});

export default ProfileInfoScreen;