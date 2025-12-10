// app/(session)/evaluationReport
import ResultItem from "@/components/evaluationResultsItem";
import SelectableCard from "@/components/selectableCard";
import { useSelectedUser } from "@/components/selectedUserContext";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getShortDate } from "@/utils/date";
import { createEmptyEvaluations, createEmptyResults, EvaluationAreas, EvaluationResults, loadEvaluations, loadResults } from "@/utils/evaluationResults";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";


const evaluationAreas = [
  { key: "MG", title: "Motricidad Gruesa" },
  { key: "MF", title: "Motricidad Finoadaptativa" },
  { key: "AL", title: "Audición y Lenguaje" },
  { key: "PS", title: "Personal Social" },
] as const;

export default function EvaluationDashboard() {
  const emptyResults = useMemo(() => createEmptyResults(), []);
  const emptyEvals = useMemo(() => createEmptyEvaluations(), []);

  const [results, setResults] = useState<EvaluationResults>(emptyResults);
  const [evals, setEvals] = useState<EvaluationAreas>(emptyEvals);
    const { currentUser } = useSelectedUser();
    const evalDate = getShortDate();
    

    useEffect(() => {
      if (!currentUser) return;
  
      const fetchData = async () => {
        const evaluationResults = await loadResults(currentUser.uid, evalDate)
        const evaluations = await loadEvaluations(currentUser.uid, evalDate)
        setResults(evaluationResults);
        setEvals(evaluations);
        console.log(evaluations)

      };
  
      fetchData();
    }, [currentUser, evalDate]);

    return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
        
                    {/* Información del paciente */}
                    <SelectableCard 
                      noAction={true}
                      colors="simple">
                    <ThemedText style={styles.label}>Datos del Paciente</ThemedText>
        
                    <View style={styles.cardInformation}>

                      <View style={styles.row}>
                        <ThemedText style={styles.textItem}>Nombre </ThemedText>
                        <ThemedText style={styles.value}>{currentUser.name} {currentUser.lastName}</ThemedText>
                      </View>

                      <View style={styles.row}>
                        <ThemedText style={styles.textItem}>ID  </ThemedText>
                        <ThemedText style={styles.value}>{currentUser.uidType}: {currentUser.uid}</ThemedText>
                      </View>

                      <View style={styles.row}>
                        <ThemedText style={styles.textItem}>FN </ThemedText>
                        <ThemedText style={styles.value}>{currentUser.dob.day}-{currentUser.dob.month}-{currentUser.dob.year}</ThemedText>
                      </View>

                      <View style={styles.row}>
                        <ThemedText style={styles.textItem}>FE </ThemedText>
                        <ThemedText style={styles.value}>{results.date}</ThemedText>
                      </View>

                      <View style={styles.row}>
                        <ThemedText style={styles.textItem}>Edad{" "}</ThemedText>
                        <ThemedText style={styles.value}>{results.age.ageMonths} Meses {results.age.ageDays} Días</ThemedText>
                      </View>

                      <View style={{flexDirection: "row"}}>
                        <ThemedText style={styles.textItem}>Rango </ThemedText>
                        <ThemedText style={styles.value}>{results.age.range}</ThemedText>
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
                        answers={evals[key].answers}
                      />
                    ))}
                    </SelectableCard>

                    
        </ThemedView>
      </ScrollView>
    </ThemedView>
    );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    shadowColor: "#515151ff",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 12,  
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
