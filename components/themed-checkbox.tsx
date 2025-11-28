import { ThemedText } from '@/components/themed-text';
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  label: string;          // Texto a mostrar
  value: string;          // Valor de la opción
  selected: boolean;      // Si está seleccionado
  onSelect: (value: string) => void; // Callback
};

const ThemedCheckBox: React.FC<Props> = ({ label, value, selected, onSelect }) => {
  return (
    <TouchableOpacity
      style={styles.optionContainer}
      onPress={() => onSelect(value)}
    >
      <View style={[styles.checkbox, selected && styles.checked]} />
      <ThemedText style={styles.label}>{label}</ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  checkbox: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderColor: '#f4f4f4ff',
    borderRadius: 8, // cambia a 10 para hacerlo redondo
  },
  checked: {
    backgroundColor: "#4592f7ff",
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
  },
});

export default ThemedCheckBox;
