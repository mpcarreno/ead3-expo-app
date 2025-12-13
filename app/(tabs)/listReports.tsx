import DropdownSearch from '@/components/dropdownSearch';
import SelectableCard from "@/components/selectableCard";
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from "react-native";

export type ResultsItem = {
  pd: number;
  pt: number;
  level: 'Satisfactorio' | 'Riesgo de Problema' | 'Sospecha de Problema';
  answers: { questionId: number; question: string; answer: boolean }[];
};

export type EvaluationResults = {
  userinfo: any;
  age: any;
  date: string;
  MG: ResultsItem;
  MF: ResultsItem;
  AL: ResultsItem;
  PS: ResultsItem;
};

export default function ListReports() {

  const colorScheme = useColorScheme();
  const iconColor = Colors[colorScheme ?? 'light'].icon
  const [resultsFullList, setResultsFullList] = useState<EvaluationResults[]>([]);
  const [filteredList, setFilteredList] = useState<EvaluationResults[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  const deleteButton = (item: EvaluationResults) => {
    Alert.alert(
      "¿Desea eliminar el reporte?",
      "Esta acción no se puede deshacer",
      [
        { text: 'Volver', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteReport(item) },
      ]
    );
  };

  const deleteReport = async (item: EvaluationResults) => {
    try {
      const userId = item.userinfo?.uid;
      const date = item.date;

      const report = `results_${userId}_${date}`;
      const evaluation = `evaluations_${userId}_${date}`;

      await AsyncStorage.removeItem(report);
      await AsyncStorage.removeItem(evaluation);

      // Actualizar listas en pantalla sin necesidad de recargar todo
      setResultsFullList(prev => prev.filter(r => r.date !== date || r.userinfo?.uid !== userId));
      setFilteredList(prev => prev.filter(r => r.date !== date || r.userinfo?.uid !== userId));

      console.log("Reporte eliminado:", report);
      console.log("Evaluacion Eliminada", evaluation)
    } catch (error) {
      console.error(error);
    }
  };


  const handleOpenReport = (report: EvaluationResults) => {
    router.push({
      pathname: "/evaluationReport",
      params: { data: JSON.stringify(report) }
    })
  };


  useFocusEffect(
    React.useCallback(() => {
      loadAllEvaluations();
    }, [])
  );

  const loadAllEvaluations = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const resultKeys = keys.filter(k => k.startsWith("results_"));

      const allResults = await Promise.all(
        resultKeys.map(async key => {
          const saved = await AsyncStorage.getItem(key);
          if (saved) {
            return JSON.parse(saved) as EvaluationResults;
          }
          return null;
        })
      );

      const clean = allResults
        .filter(r => r !== null && r.userinfo && r.userinfo.name)
        .map(r => ({
          ...r,
          MG: r?.MG ?? { pd:0, pt:0, level:"Satisfactorio", answers: [] },
          MF: r?.MF ?? { pd:0, pt:0, level:"Satisfactorio", answers: [] },
          AL: r?.AL ?? { pd:0, pt:0, level:"Satisfactorio", answers: [] },
          PS: r?.PS ?? { pd:0, pt:0, level:"Satisfactorio", answers: [] },
        })) as EvaluationResults[];
      setResultsFullList(clean);
      setFilteredList(clean); // 🔹 Mostrar todas inicialmente

    } catch (err) {
      console.error("Error cargando todas las evaluaciones", err);
    }
  };

  // 🔹 Lista para el dropdown (nombre + fecha)
  const dropdownList = resultsFullList.map(
    (e) => `${e.userinfo?.name ?? "Desconocido"} | ${e.date}`
  );

  // 🔹 Cuando selecciona del dropdown
  const handleSelect = (item: string) => {
    setSearchValue(item);

    const [name, date] = item.split(" | ");

    const filtered = resultsFullList.filter(e =>
      (e.userinfo?.name ?? "").includes(name) &&
      e.date.includes(date)
    );

    setFilteredList(filtered);
  };

  // 🔹 Cuando borra texto → mostrar todo
  const handleTyping = (text: string) => {
    setSearchValue(text);

    if (text.trim() === "") {
      setFilteredList(resultsFullList);
      return;
    }

    const filtered = resultsFullList.filter(e =>
      (e.userinfo?.name ?? "").toLowerCase().includes(text.toLowerCase()) ||
      e.date.includes(text)
    );

    setFilteredList(filtered);
  };

  return (
    <ThemedView style={{ flex: 1 }} safe>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ThemedView style={styles.container}>

          <DropdownSearch
            data={dropdownList}               // 🔹 Toda la lista siempre
            value={searchValue}
            placeholder="Buscar por nombre, ID o fecha"
            onChangeValue={handleTyping}      // 🔹 Filtra al escribir
            onSelect={handleSelect}
            showList={false}             // 🔹 Filtra al seleccionar
          />

          <FlatList
            data={filteredList}
            keyExtractor={(item) => `${item.userinfo?.uid}_${item.date}`}
            renderItem={({ item }) => (
              <SelectableCard
                colors="simple"
                containerStyle={{ marginBottom: 15 }}
              >
                <ThemedText style={{ fontWeight: "bold" }}>
                  {item.userinfo?.name} {item.userinfo?.lastName}
                </ThemedText>
                <View style={styles.detailsContainer}>
                  <ThemedText>Fecha: {item.date}</ThemedText>
                  <ThemedText>MG: {item.MG.level} </ThemedText>
                  <ThemedText>MF: {item.MF.level} </ThemedText>
                  <ThemedText>AL: {item.AL.level} </ThemedText>
                  <ThemedText>PS: {item.PS.level} </ThemedText>
                </View>

                <View style={[styles.buttonsContainer, {borderTopColor: iconColor}]}>
                  <View style={[styles.buttonLeft, {borderRightColor: iconColor}]}>
                    <TouchableOpacity 
                      onPress={() => deleteButton(item)} 
                      style={styles.touch}>
                        <ThemedText style={[styles.text, {color: iconColor}]}>Eliminar</ThemedText>
                    </TouchableOpacity> 
                  </View>
                  <View style={styles.buttonRight}>
                    <TouchableOpacity 
                      onPress={() => handleOpenReport(item)}
                      style={styles.touch}>
                        <ThemedText style={[styles.text, {color: iconColor}]}>Ver Detalles</ThemedText>
                    </TouchableOpacity> 
                  </View>
                </View>
              </SelectableCard>
            )}
          />

        </ThemedView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    marginHorizontal: 20, 
    marginBottom: 50, 
    marginTop: 30 
  },
  buttonsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    
  },
  detailsContainer: {
    marginBottom: 15,
  },
  buttonLeft: {
    flex: 1,
    alignContent: 'flex-end',
    marginTop: 10,
    borderRightWidth: 1,
  },
  buttonRight: {
    flex: 1,
    alignContent: 'center',
    marginTop: 10,
  },
  text: {
    textAlign: 'justify',
  },
  touch: {
    alignSelf: 'center'
  },
});
