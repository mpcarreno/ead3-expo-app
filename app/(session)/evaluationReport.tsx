// app/(session)/evaluationReport
import ResultItem from "@/components/evaluationResultsItem";
import SelectableCard from "@/components/selectableCard";
import { useSelectedUser } from "@/components/selectedUserContext";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getShortDate } from "@/utils/date";
import { createEmptyResults, EvaluationResults, loadResults } from "@/utils/evaluationResults";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";


const evaluationAreas = [
  { key: "MG", title: "Motricidad Gruesa" },
  { key: "MF", title: "Motricidad Finoadaptativa" },
  { key: "AL", title: "Audición y Lenguaje" },
  { key: "PS", title: "Personal Social" },
] as const;

export default function EvaluationReport() {
  const emptyResults = useMemo(() => createEmptyResults(), []);
  const [results, setResults] = useState<EvaluationResults>(emptyResults);
  
  const { currentUser } = useSelectedUser();
  const evalDate = getShortDate();

  const params = useLocalSearchParams();
  const paramResults = params.data ? JSON.parse(params.data as string) : null;

  useEffect(() => {
  // If data comes from params
  if (paramResults) {
    setResults(paramResults);
    return;
  }

  // If there is no currentUser 
  if (!currentUser) return;

  let mounted = true;

  const fetchData = async () => {
    try {
      const evaluationResults = await loadResults(currentUser.uid, evalDate);
      if (!mounted) return;
      setResults(evaluationResults);
    } catch (err) {
      console.error("Error cargando resultados:", err);
    }
  };

  fetchData();

  return () => {
    mounted = false;
  };
}, [currentUser, evalDate, paramResults]);

  if (!results || !results.userinfo) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Cargando...</ThemedText>
      </ThemedView>
    );
  }
  console.log("REPORTE RECIBIDO:", results);
  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
          <ThemedView style={styles.container}>
          
            {/* Patient information */}
            <SelectableCard 
              noAction={true}
              colors="simple">
            <ThemedText style={styles.label}>Datos del Paciente</ThemedText>

            <View style={styles.cardInformation}>

              <View style={styles.row}>
                <ThemedText style={styles.textItem}>Nombre </ThemedText>
                <ThemedText style={styles.value}>{results?.userinfo?.name  ?? ""} {results?.userinfo?.lastName  ?? ""}</ThemedText>
              </View>

              <View style={styles.row}>
                <ThemedText style={styles.textItem}>ID  </ThemedText>
                <ThemedText style={styles.value}>{results?.userinfo?.uidType  ?? ""}: {results?.userinfo?.uid  ?? ""}</ThemedText>
              </View>

              <View style={styles.row}>
                <ThemedText style={styles.textItem}>FN </ThemedText>
                <ThemedText style={styles.value}>{results?.userinfo?.dob.day  ?? ""}-{results?.userinfo?.dob.month  ?? ""}-{results?.userinfo?.dob.year  ?? ""}</ThemedText>
              </View>

              <View style={styles.row}>
                <ThemedText style={styles.textItem}>FE </ThemedText>
                <ThemedText style={styles.value}>{results?.date  ?? ""}</ThemedText>
              </View>

              <View style={styles.row}>
                <ThemedText style={styles.textItem}>Edad{" "}</ThemedText>
                <ThemedText style={styles.value}>{results?.age?.ageMonths  ?? ""} Meses {results?.age?.ageDays  ?? ""} Días</ThemedText>
              </View>

              <View style={{flexDirection: "row"}}>
                <ThemedText style={styles.textItem}>Rango </ThemedText>
                <ThemedText style={styles.value}>{results?.age?.range  ?? ""}</ThemedText>
              </View>
            </View>
            
            <ThemedText style={styles.label}>Resultados</ThemedText>

            {evaluationAreas.map(({ key, title }) => (
              <ResultItem 
                key={key} 
                title={title}
                result={results[key].level}
                pd={results[key].pd}
                pt={results[key].pt}
                answers={results[key].answers}
              />
            ))}
            </SelectableCard>     
          </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

// Style definitions
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
  },
  row: {
  flexDirection: "row",
  borderBottomWidth: 1,
  borderColor: "#ddd",
},
  score: {
    flexDirection: 'row',
    gap: 10,
  },
  questions: {
    flexDirection: 'column',
    gap: 10,
  },
  additionalText: {
    fontWeight: '300',
  },
  questionsText: {
    fontWeight: '300',
    fontSize: 14,
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  label: { 
    fontWeight: "bold", 
    marginBottom: 10, 
    fontSize: 20, 
    textAlign: "center" 
  },
  cardInformation: {
    flexDirection: "column",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },

  textItem: {
    flex: 1,
  padding: 5,
  textAlign: 'right',
  fontWeight: "600",
  borderRightWidth: 1,
  borderColor: "#ddd",
  },

  value: {
    flex: 4,
    fontWeight: "400",
    padding: 5,
  },
  additionalTitle: {
    fontSize: 16,
    fontWeight: "600"
  },

  text: {
    textAlign: "auto",
    marginVertical: 20,
    fontSize: 15,
  },

  reportButton: {
    backgroundColor: "#007aff",
    padding: 16,
    borderRadius: 12,
    marginTop: 30,
  },

  reportText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});
