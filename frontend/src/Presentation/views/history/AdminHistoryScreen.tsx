import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import useViewModel from './AdminViewModel';
import { MyColors } from '../../theme/AppTheme';
import { EditRecordModal } from '../../components/EditRecordModal';
import { formatTimestamp } from '../../utils/formatters';

export const AdminHistoryScreen = () => {
    const { records, loading, deleteRecord, updateTimestamp } = useViewModel();

    const [modalVisible, setModalVisible] = useState(false);
    const [recordToEdit, setRecordToEdit] = useState<any>(null);

    const openEditModal = (item: any) => {
        setRecordToEdit(item);
        setModalVisible(true);
    };

    const onUpdatePress = (newTimestamp: string) => {
        if (recordToEdit) {
            updateTimestamp(recordToEdit.id, newTimestamp, recordToEdit.user_id);
            setModalVisible(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={MyColors.primary} />
                <Text>Cargando historial de todos los empleados...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Historial General de Registros</Text>
            {records.length > 0 ? (
                <FlatList
                    data={records}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.recordItem}>
                            <View>
                                <Text style={styles.recordUserText}>{item.user_name} {item.user_lastname}</Text>
                                <Text style={styles.recordTypeText}>{item.event_type}</Text>
                                <Text style={styles.recordTimestamp}>{formatTimestamp(item.timestamp)}</Text>
                                {item.duration_minutes !== null && (
                                    <Text style={styles.recordDuration}>Duración: {item.duration_formatted}</Text>
                                )}
                            </View>
                            <View style={styles.recordActions}>
                                <TouchableOpacity onPress={() => openEditModal(item)} style={styles.editButton}>
                                    <Text style={styles.editButtonText}>Editar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => deleteRecord(item.id, item.user_id)} style={styles.deleteButton}>
                                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.text}>No se encontraron registros en el historial general.</Text>
            )}
            {recordToEdit && (
                <EditRecordModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onUpdate={onUpdatePress}
                    initialTimestamp={new Date(recordToEdit.timestamp).toISOString()}
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
    recordItem: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    recordUserText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: MyColors.secondary,
        marginBottom: 5
    },
    recordTypeText: {
        fontSize: 16,
        color: MyColors.primary
    },
    recordTimestamp: {
        fontSize: 14,
        color: '#666'
    },
    recordDuration: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: '#888'
    },
    recordActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    editButton: {
        backgroundColor: MyColors.primary,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginLeft: 10,
        minWidth: 90,
        alignItems: 'center',
    },
    editButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    deleteButton: {
        backgroundColor: 'red',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginLeft: 10,
        minWidth: 90,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold'
    }
});

export default AdminHistoryScreen;