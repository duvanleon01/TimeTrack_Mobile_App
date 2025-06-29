import AsyncStorage from '@react-native-async-storage/async-storage';

export const LocalStorage = () => {
    const save = async (key: string, value: string) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.log('Error en Local Storage al guardar: ' + error);
        }
    };

    const getItem = async (key: string) => {
        try {
            const item = await AsyncStorage.getItem(key);
            return item;
        } catch (error) {
            console.log('Error en Local Storage al obtener: ' + error);
            return null; 
        }
    };

    const remove = async (key: string) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.log('Error en Local Storage al eliminar: ' + error);
        }
    };

    return {
        save,
        getItem,
        remove
    };
};