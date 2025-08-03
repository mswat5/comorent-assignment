import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  minLength?: number;
}

export function FormInput({ label, error, minLength, ...props }: FormInputProps) {
  const currentLength = props.value?.length || 0;
  
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {minLength && (
          <Text style={[
            styles.counter,
            currentLength < minLength ? styles.counterError : styles.counterSuccess
          ]}>
            {currentLength}/{minLength}
          </Text>
        )}
      </View>
      
      <TextInput
        style={[
          styles.input,
          props.multiline && styles.multilineInput,
          error && styles.inputError
        ]}
        placeholderTextColor="#999"
        {...props}
      />
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  counter: {
    fontSize: 12,
    fontWeight: '500',
  },
  counterError: {
    color: '#ff4444',
  },
  counterSuccess: {
    color: '#00aa00',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
});