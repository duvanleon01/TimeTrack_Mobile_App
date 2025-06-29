import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MyColors } from '../../theme/AppTheme';
import useViewModel from './AdminUsersViewModel';
import { EditUserModal } from '../../components/EditUserModal';

export const AdminUsersScreen = () => {
    const { users, loading, deleteUser, updateUser } = useViewModel();

    const [modalVisible, setModalVisible] = useState(false);
    const [userToEdit, setUserToEdit] = useState<any>(null);

    const openEditModal = (user: any) => {
        setUserToEdit(user);
        setModalVisible(true);
    };

    const onUpdatePress = (updatedUser: any) => {
        if (updatedUser) {
            updateUser(updatedUser);
            setModalVisible(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={MyColors.primary} />
                <Text>Cargando lista de usuarios...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gestión de Usuarios</Text>
            {users.length > 0 ? (
                <FlatList
                    data={users}
                    keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.userItem}>
                            <Text style={styles.userNameText}>{item.name} {item.lastname}</Text>
                            <Text style={styles.userRoleText}>Rol: {item.rol}</Text>
                            <View style={styles.userActions}>
                                <TouchableOpacity onPress={() => openEditModal(item)} style={styles.editButton}>
                                    <Text style={styles.editButtonText}>Editar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { if (item?.id) deleteUser(item.id); }} style={styles.deleteButton}>
                                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        
                    )}
                />
            ) : (
                <Text style={styles.text}>No se encontraron usuarios.</Text>
            )}
            {userToEdit && (
                <EditUserModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onUpdate={onUpdatePress}
                    initialUser={userToEdit}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: MyColors.white
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: MyColors.black
    },
    userItem: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc'
    },
    userNameText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: MyColors.secondary
    },
    userRoleText: {
        fontSize: 14,
        color: '#666'
    },
    userActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10
    },
    editButton: {
        backgroundColor: MyColors.primary,
        padding: 5,
        borderRadius: 5,
        marginLeft: 10
    },
    editButtonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 5,
        marginLeft: 10
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: '#888'
    }
});

export default AdminUsersScreen;