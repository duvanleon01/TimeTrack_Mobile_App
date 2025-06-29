import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './src/Presentation/views/home/Home'; 
import { RegisterScreen } from './src/Presentation/views/register/Register';
import { ProfileInfoScreen } from './src/Presentation/views/profile/info/ProfileInfoScreen';
import DashboardScreen from './src/Presentation/views/dashboard/DashboardScreen';
import HistoryScreen from './src/Presentation/views/history/HistoryScreen';
import AdminHistoryScreen from './src/Presentation/views/history/AdminHistoryScreen';
import AdminUsersScreen from './src/Presentation/views/users/AdminUsersScreen';

export type RootStackParamList = {
  Home: undefined;
  RegisterScreen: undefined;
  ProfileInfoScreen: undefined;
  DashboardScreen: undefined;
  HistoryScreen: undefined;
  AdminHistoryScreen: undefined;
  AdminUsersScreen: undefined;  
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: true, title: "Registro de Usuario" }} />

        <Stack.Screen name="ProfileInfoScreen" component={ProfileInfoScreen} options={{ headerShown: true, title: "Mi Perfil" }} />

        <Stack.Screen name="DashboardScreen" component={DashboardScreen} options={{ headerShown: false }} />

        <Stack.Screen name="HistoryScreen" component={HistoryScreen} options={{ headerShown: true, title: "Historial", }} />

        <Stack.Screen name="AdminHistoryScreen" component={AdminHistoryScreen} options={{ headerShown: true, title: "Historial General", }} />

        <Stack.Screen name="AdminUsersScreen" component={AdminUsersScreen} options={{ headerShown: true, title: "Gestión de Usuarios" }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;