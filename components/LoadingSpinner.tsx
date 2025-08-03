import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <View style={styles.container}>
      <View style={styles.spinner} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#E5E7EB",
    borderTopColor: "#3B82F6",
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
});
