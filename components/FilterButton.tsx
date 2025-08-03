import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

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
      <Text style={[styles.text, isActive && styles.activeText]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 14,
    backgroundColor: "#f5f5f5",
    marginRight: 8,
    marginBottom: 6,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#007AFF",
  },
  text: {
    fontSize: 16,
    color: "#555",
    fontWeight: "600",
  },
  activeText: {
    color: "white",
  },
});
