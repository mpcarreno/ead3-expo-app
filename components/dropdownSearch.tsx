//components/dropdownSearch.tsx
import { ThemedText } from "@/components/themed-text";
import { ThemedTextInput } from "@/components/themed-textinput";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useState } from "react";

import { FlatList, StyleSheet, Text, TextInputProps, TouchableOpacity, View } from 'react-native';

export type DropdownSearchProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  data: string[];                     // Lista que se filtra
  value: string;                       // Valor del input
  onChangeValue: (text: string) => void;
  onSelect: (item: string) => void;    // Selección
  noResultsText?: string;              // Texto "No existe"
  onCreateNew?: () => void;            // Botón crear nuevo
  showList?: boolean;
};

export default function DropdownSearch({
  lightColor,
  darkColor,
  data,
  value,
  placeholder,
  onChangeValue,
  keyboardType,
  onSelect,
  noResultsText = "*Sin Resultados*",
  onCreateNew,
  showList = true,
  ...rest
}: DropdownSearchProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'boxText')
  const boxBackColor = useThemeColor({ light: lightColor, dark: darkColor }, 'boxBackground')
  const boxBorderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'boxBorder')

  const filtered = value.trim()
    ? data.filter((item) => item.startsWith(value))
    : [];

  return (
    <ThemedView>
      {/* 🔹 INPUT */}
      <ThemedTextInput
        value={value}
        placeholder={placeholder}
        keyboardType={keyboardType}
        onChangeText={(text) => {
          onChangeValue(text);
          setShowDropdown(text.trim().length > 0);
        }}
        {...rest}
      />

      {/* DROPDOWN */}
      {showDropdown && showList && (
        <ThemedView style={[{borderColor: boxBorderColor }, styles.dropdownContainer]}>
          <FlatList
            data={filtered.length > 0 ? filtered : ["__NO_RESULTS__"]}
            keyExtractor={(item) => item}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              if (item === "__NO_RESULTS__") {
                return (
                  <View style={styles.noResultContainer}>
                    <ThemedText style={styles.noItemText}>{noResultsText}</ThemedText>

                    {onCreateNew && (
                      <TouchableOpacity
                        style={styles.createButton}
                        onPress={onCreateNew}
                      >
                        <Text style={styles.createButtonText}>
                          Crear nuevo usuario
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              }

              return (
                <TouchableOpacity
                  style={[{borderBottomColor: boxBackColor}, styles.dropdownItem]}
                  onPress={() => {
                    onSelect(item);
                    setShowDropdown(false);
                  }}
                >
                  <ThemedText>{item}</ThemedText>
                </TouchableOpacity>
              );
            }}
          />
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    borderRadius: 12,
    maxHeight: 200,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    
  },
  noResultContainer: {
    padding: 10,
  },
  noItemText: {
    fontWeight: "200",
    marginVertical: 8,
    alignSelf: 'center',
  },
  createButton: {
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#0ca6d9ff",
    marginTop: 5,
  },
  createButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  },)
