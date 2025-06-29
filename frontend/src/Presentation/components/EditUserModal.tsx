import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import { MyColors } from '../theme/AppTheme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onUpdate: (user: any) => void;
  initialUser: any;
}

export const EditUserModal = ({ visible, onClose, onUpdate, initialUser }: Props) => {
  const [values, setValues] = useState(initialUser || {});
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Si el modal se hace visible, reinicia los valores a los del usuario inicial
    if (visible) {
      setValues(initialUser || {});
      setErrorMessage('');
    }
  }, [initialUser, visible]);

  // Función para manejar el cambio en los inputs y actualizar el estado
  const onChange = (property: string, value: string) => {
    setValues({ ...values, [property]: value });
  };

  // Función de validación del formulario
  const isValidForm = (): boolean => {
    setErrorMessage('');
    // Verifica que todos los campos de datos personales no estén vacíos
    if (values.name === '' || values.lastname === '' || values.email === '' || values.phone === '') {
      setErrorMessage('Todos los campos de datos personales son requeridos');
      return false;
    }
    return true;
  };

  // Función que se ejecuta al presionar 'Actualizar'
  const handleUpdate = () => {
    if (isValidForm()) {
      console.log('Modal: onUpdate llamado con valores:', values);
        onUpdate(values);
    } else {
        ToastAndroid.show(errorMessage, ToastAndroid.LONG);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Editar Usuario</Text>

          {errorMessage !== '' && <Text style={styles.errorMessage}>{errorMessage}</Text>}

          <Text style={styles.label}>Nombres</Text>
          <TextInput
            style={[styles.input, values.name === '' && styles.inputError]}
            onChangeText={text => onChange('name', text)}
            value={values.name}
            placeholder="Ingresar nombres"
            placeholderTextColor={MyColors.secondary}
          />
          
          <Text style={styles.label}>Apellidos</Text>
          <TextInput
            style={[styles.input, values.lastname === '' && styles.inputError]}
            onChangeText={text => onChange('lastname', text)}
            value={values.lastname}
            placeholder="Ingresar apellidos"
            placeholderTextColor={MyColors.secondary}
          />
          
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={[styles.input, values.phone === '' && styles.inputError]}
            onChangeText={text => onChange('phone', text)}
            value={values.phone}
            placeholder="Ingresar teléfono"
            keyboardType="numeric"
            placeholderTextColor={MyColors.secondary}
          />
          
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput
            style={[styles.input, values.email === '' && styles.inputError]}
            onChangeText={text => onChange('email', text)}
            value={values.email}
            placeholder="Ingresar correo electrónico"
            keyboardType="email-address"
            placeholderTextColor={MyColors.secondary}
          />
          
          <Text style={styles.label}>Rol de Usuario</Text>
          <TextInput
            style={styles.input}
            value={values.rol} // Muestra el rol actual, pero no es editable
            editable={false}
            placeholder="Rol (solo lectura)"
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Nueva Contraseña</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => onChange('password', text)}
            value={values.password}
            placeholder="Dejar vacío para no cambiar"
            secureTextEntry={true}
            placeholderTextColor={MyColors.secondary}
          />

          <View style={styles.buttonContainer}>
            <Button title="Cancelar" onPress={onClose} color="gray" />
            <Button title="Actualizar" onPress={handleUpdate} color={MyColors.primary} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
  },
  errorMessage: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontWeight: 'bold',
    color: 'black',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '100%',
    color: 'black',
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 2,
  },
  pickerContainer: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 15,
      width: '100%',
      justifyContent: 'center',
      backgroundColor: '#f9f9f9',
  },
  picker: {
      height: 40,
      width: '100%',
      color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
});