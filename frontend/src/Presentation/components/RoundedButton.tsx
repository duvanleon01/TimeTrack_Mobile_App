import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { MyColors } from '../theme/AppTheme';

interface Props {
    text: string;
    onPress: () => void;
    disabled?: boolean;
}

export const RoundedButton = ({ text, onPress, disabled = false }: Props) => {
    return (
        <TouchableOpacity
            style={[styles.RoundedButton, disabled && styles.disabledButton]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={styles.textButton}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    RoundedButton: {
        width: '100%',
        height: 40,
        backgroundColor: MyColors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    disabledButton: {
        opacity: 0.5,
    },
    textButton: {
        color: MyColors.white,
        fontWeight: 'bold',
    }
});