import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface FilterButtonProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
}

export function FilterButton({ title, isActive, onPress }: FilterButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, isActive && styles.activeButton]}
      onPress={onPress}
    >
      <Text style={[styles.text, isActive && styles.activeText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  text: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeText: {
    color: 'white',
  },
});