import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { RoundedButton } from '../../components/RoundedButton';
import { MyColors } from '../../theme/AppTheme';

import useViewModel from './ViewModel';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './../../../../App';
import { formatTimestamp } from '../../utils/formatters';

const logoutIcon = require('../../../../assets/logout_icon.png');

export const DashboardScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { user, status, lastRecordTimestamp, lastClockOutTimestamp, clockIn, clockOut, logout } = useViewModel();

  const renderStatusText = () => {
    if (status === 'CLOCK_IN_ACTIVE') {
      return `Jornada activa desde: ${formatTimestamp(lastRecordTimestamp)}`;
    }
    if (lastClockOutTimestamp) {
      return `Tu última jornada finalizó: ${formatTimestamp(lastClockOutTimestamp)}`;
    }
    return 'No has registrado tu entrada.';
  };

  const isClockInEnabled = status === 'INACTIVE';
  const isClockOutEnabled = status === 'CLOCK_IN_ACTIVE';
  const isAdmin = user?.rol === 'administrador';

  const onLogoutPress = async () => {
    await logout();
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={onLogoutPress}>
        <Image source={logoutIcon} style={styles.logoutIcon} />
      </TouchableOpacity>
      
      <Text style={styles.title}>Estado Actual</Text>

      <Text style={styles.statusText}>{renderStatusText()}</Text>

      <View style={styles.buttonContainer}>
        <RoundedButton 
          text="CLOCK IN" 
          onPress={clockIn}
          disabled={!isClockInEnabled}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <RoundedButton 
          text="CLOCK OUT" 
          onPress={clockOut}
          disabled={!isClockOutEnabled}
        />
      </View>
      
      <TouchableOpacity onPress={() => navigation.navigate('HistoryScreen')}>
        <Text style={styles.historyText}>Ver Historial Propio</Text>
      </TouchableOpacity>

      {isAdmin && (
          <TouchableOpacity onPress={() => navigation.navigate('AdminHistoryScreen')}>
              <Text style={styles.historyText}>Ver Historial General (Admin)</Text>
          </TouchableOpacity>
      )}

      {isAdmin && (
        <TouchableOpacity onPress={() => navigation.navigate('AdminUsersScreen')}>
            <Text style={styles.historyText}>Ver Usuarios (Admin)</Text>
        </TouchableOpacity>
    )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: MyColors.white,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: MyColors.black,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 18,
    color: MyColors.secondary,
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '80%',
    marginBottom: 15,
  },
  historyText: {
    marginTop: 30,
    color: MyColors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  logoutButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
    zIndex: 1,
  },
  logoutIcon: {
    width: 40,
    height: 40,
    tintColor: MyColors.black,
  },
});

export default DashboardScreen;