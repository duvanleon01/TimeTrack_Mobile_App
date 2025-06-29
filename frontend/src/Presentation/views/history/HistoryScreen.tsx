import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import useViewModel from './ViewModel'; 
import { MyColors } from '../../theme/AppTheme';

export const HistoryScreen = () => {
  const { records, loading } = useViewModel();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={MyColors.primary} />
        <Text>Cargando historial...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Registros</Text>
      {records.length > 0 ? (
        <FlatList
          data={records}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.recordItem}>
              <Text style={styles.recordTypeText}>{item.event_type}</Text>
              <Text style={styles.recordTimestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
              {item.duration_minutes !== null && (
                <Text style={styles.recordDuration}>Duración: {item.duration_formatted}</Text>
              )}
            </View>
          )}
        />
      ) : (
        <Text style={styles.text}>No se encontraron registros en tu historial.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: MyColors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: MyColors.black,
  },
  recordItem: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  recordTypeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: MyColors.primary,
  },
  recordTimestamp: {
    fontSize: 14,
    color: '#666',
  },
  recordDuration: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});

export default HistoryScreen;