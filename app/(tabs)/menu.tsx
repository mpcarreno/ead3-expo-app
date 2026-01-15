import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";

export default function Settings() {

  const clearStorage = () => {
    Alert.alert(
      "Borrar todos los datos",
      "Esto eliminará todas las evaluaciones y configuraciones guardadas. Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Borrar", 
          style: "destructive", 
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert("Listo", "Todos los datos han sido eliminados");
            } catch (err) {
              console.error("Error borrando datos:", err);
            }
          } 
        },
      ]
    );
  };

  return (
      <ThemedView style={{flex:1}} safe>
        <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Menu</ThemedText>

        <TouchableOpacity style={styles.clearButton} onPress={clearStorage}>
          <ThemedText style={styles.clearText}>Borrar todos los datos</ThemedText>
        </TouchableOpacity>
        </ThemedView>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { margin: 20},
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 30 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 30 },
  label: { fontSize: 18, fontWeight: "500" },
  clearButton: { backgroundColor: "#ff3b30", padding: 16, borderRadius: 12, alignItems: "center" },
  clearText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
