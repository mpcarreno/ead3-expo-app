// newEvaluation.tsx
import DropdownSearch from "@/components/dropdownSearch";
import SelectableCard from "@/components/selectableCard";
import { useSelectedUser } from "@/components/selectedUserContext";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router"; // si usas expo-router
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function newEvaluation() {
  const [searchId, setSearchId] = useState("");
  const [listResults, setListResults] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<any>(null);
  const [storedUids, setStoredUids] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cardSelected, setCardSelected] = useState(false);

  // dentro del componente:
  const { setCurrentUser } = useSelectedUser();
  const router = useRouter();

  useEffect(() => { loadUsers(); }, []);

  // 🔹 Cargar IDs desde AsyncStorage
  const loadUsers = async () => {
    const stored = await AsyncStorage.getItem("user_ids");
    setStoredUids(stored ? JSON.parse(stored) : []);
  };

  // 🔹 Buscar y filtrar IDs
  const handleSearch = (text: string) => {
    setSearchId(text);

    if (text.trim().length === 0) {
      setListResults([]);
      setShowDropdown(false);
      return;
    }

    const filtered = storedUids.filter((u) => u.startsWith(text));
    setListResults(filtered);
    setShowDropdown(true);
  };

  // 🔹 Seleccionar usuario
  const selectUser = async (uid: string) => {
    setSearchId(uid);
    setListResults([]);
    setShowDropdown(false);
    setCardSelected(false);

    const data = await AsyncStorage.getItem(`user_${uid}`);
    setSelectedId(data ? JSON.parse(data) : null);
    
  };

  // 🔹 Limpiar card si el input cambia y no coincide con el seleccionado
  useEffect(() => {
    if (selectedId && selectedId.uid !== searchId) {
      setSelectedId(null);
      setCardSelected(false);
    }
  }, [searchId]);
  
  return (
    <ThemedView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ThemedView style={styles.container}>
          
          <ThemedText>Ingrese el número de identificación del paciente</ThemedText>

          <DropdownSearch
            value={searchId}
            data={storedUids}
            placeholder="Ingrese la identificación del paciente"
            keyboardType="numeric"
            onChangeValue={handleSearch}
            onSelect={selectUser}
            onCreateNew={() => console.log("Crear nuevo usuario")}
          />


          {selectedId && (
              <SelectableCard
                selected={cardSelected}
                onPress={() => setCardSelected(!cardSelected)}
              >
                  <ThemedText style={styles.label}>
                    {selectedId.name} {selectedId.lastName}
                  </ThemedText>
                
                <View style={styles.cardInformation}>
                  <ThemedText><ThemedText style={styles.textItem}>{selectedId.uidType}: </ThemedText>
                    {selectedId.uid}
                  </ThemedText>

                  <ThemedText><ThemedText style={styles.textItem}>FN: </ThemedText>
                    {selectedId.dob.day}-{selectedId.dob.month}-{selectedId.dob.year}
                  </ThemedText>
                </View>

                <View style={styles.cardInformation}>
                  <ThemedText><ThemedText style={styles.textItem}>Edad: </ThemedText>
                    {selectedId.ageAtCreation.ageMonths} Meses {selectedId.ageAtCreation.ageDays} Dias
                  </ThemedText>

                  <ThemedText><ThemedText style={styles.textItem}>Rango: </ThemedText>
                    {selectedId.ageAtCreation.range}
                  </ThemedText>
                </View>
                
              </SelectableCard>
            )}


          {cardSelected && (
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => {
                setCurrentUser(selectedId);   // 🔥 Guardar usuario global
                router.push("/(session)/evaluationDashboard");     // ir a pagina del usuario
              }}
            >
              <Text style={styles.continueText}>Continuar</Text>
            </TouchableOpacity>
          )}


        </ThemedView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

export const styles = StyleSheet.create({

  cardInformation: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },
  container: { 
    flex: 1, 
    marginHorizontal: 20, 
    marginBottom: 50, 
    marginTop: 30 
  },

  userInfo: { 
    marginTop: 20, 
    padding: 20, 
    borderRadius: 12 
  },

  label: { 
    fontWeight: "bold", 
    fontSize: 20,
    marginBottom:10,  
  },
  textItem: { 
    fontWeight: "600", 
    fontSize: 16,
    marginTop: 2 
  },

  continueButton: {
    backgroundColor: "#007aff",
    padding:20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },

  continueText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  dropdownContainer: {
    backgroundColor: "#fff",
    marginTop: 5,
    borderRadius: 12,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#ccc",
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
    borderBottomColor: "#eee",
  },

  dropdownText: {
    fontSize: 16,
  },

  noItemText: {
    fontWeight: "500",
    fontSize: 16,
    marginBottom: 8,
  },

  createButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },

  createButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
