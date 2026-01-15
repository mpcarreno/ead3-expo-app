// userSelection.tsx
import DropdownSearch from "@/components/dropdownSearch";
import SelectableCard from "@/components/selectableCard";
import { useSelectedUser } from "@/components/selectedUserContext";
import Button from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getShortDate } from "@/utils/date";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";


export default function newEvaluation() {
  const [searchId, setSearchId] = useState("");
  const [listResults, setListResults] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<any>(null);
  const [storedUids, setStoredUids] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [cardSelected, setCardSelected] = useState(false);
  
  const [existingReport, setExistingReport] = useState(false);

  
  const { setCurrentUser } = useSelectedUser();
  const router = useRouter();
  

  useEffect(() => { loadUsers(); }, []);

  
  const loadUsers = async () => {
    const stored = await AsyncStorage.getItem("user_ids");
    setStoredUids(stored ? JSON.parse(stored) : []);
  };

  const verifyExistingReport = async (uid: string) => {
  const evalDate = getShortDate();
  const report = await AsyncStorage.getItem(`results_${uid}_${evalDate}`);

  setExistingReport(!!report); 
};
  
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

  const deleteReport = async (uid: string) => {
    try {
      const evalDate = getShortDate();
      const report = `results_${uid}_${evalDate}`;
      const evaluation = `evaluations_${uid}_${evalDate}`;

      await AsyncStorage.removeItem(report);
      await AsyncStorage.removeItem(evaluation);

      console.log("Reporte eliminado:", report);
      console.log("Evaluacion Eliminada", evaluation)
    } catch (error) {
      console.error(error);
    }
  };


  const selectUser = async (uid: string) => {
    setSearchId(uid);
    setListResults([]);
    setShowDropdown(false);
    setCardSelected(false);
    setExistingReport(false);

    const data = await AsyncStorage.getItem(`user_${uid}`);
    setSelectedId(data ? JSON.parse(data) : null);
    
  };

  // Clear card if input changes and does not match selected
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
                onPress={() => {
                  setCardSelected(!cardSelected);
                  verifyExistingReport(selectedId.uid);
                }}>
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

          {cardSelected && !existingReport && (
              <Button 
              fontSize={20}
              style={styles.continueButton}
              label= "Continuar"
              onPress={async () => {
                await deleteReport(selectedId.uid)
                setCurrentUser(selectedId);
                
                router.replace("/(session)/evaluationDashboard");    
              }}>
            </Button>
            
          )}

          {cardSelected && existingReport && (
            <View>
              <ThemedText style={styles.warningText}>El usuario seleccionado ya tiene un reporte generado el mismo dia, si presiona continuar el reporte sera eliminado</ThemedText>

              <Button
              style={styles.continueButton}
              label= "Continuar"
              onPress={async () => {
                await deleteReport(selectedId.uid)
                setCurrentUser(selectedId);
                
                router.replace("/(session)/evaluationDashboard");    
              }}>
            </Button>
            </View>
            
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

    marginTop: 20,
  },

  warningText: {
    color: 'red',
    fontSize: 16,
    fontWeight: "bold",
    textAlign: 'center'
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
