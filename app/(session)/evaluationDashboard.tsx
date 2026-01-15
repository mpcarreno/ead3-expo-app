// app/(session)/evaluationDashboard
import EvaluationButton from "@/components/evaluationButton";
import SelectableCard from "@/components/selectableCard";
import { useSelectedUser } from "@/components/selectedUserContext";
import Button from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { calculateAgeRange } from "@/utils/calculate-userdata";
import { getShortDate } from "@/utils/date";
import { EvaluationAreas, createEmptyEvaluations, getResults, loadEvaluations, saveResults } from "@/utils/evaluationResults";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { ScrollView, StyleSheet, Text, View } from "react-native";


// Button configuration to avoid repeating code
const evaluationButtons = [
  { key: "MG", title: "Motricidad Gruesa" },
  { key: "MF", title: "Motricidad Finoadaptativa" },
  { key: "AL", title: "Audición y Lenguaje" },
  { key: "PS", title: "Personal Social" },
] as const;

export default function EvaluationDashboard() {
  const router = useRouter();
  const { currentUser } = useSelectedUser();
  const evalDate = getShortDate();
  const CurrentAge = calculateAgeRange(currentUser.dob)

  // Memo to avoid recreating this object on each render
  const emptyEvals = useMemo(() => createEmptyEvaluations(), []);

  const [evals, setEvals] = useState<EvaluationAreas>(emptyEvals);

  // Load evaluations from AsyncStorage
  useEffect(() => {
  if (!currentUser) return;

  const fetchData = async () => {
    const result = await loadEvaluations(currentUser.uid, evalDate);

    if (result) {
      // There is something saved
      setEvals(result);
    } else {
      // No eval exists - load empty
      setEvals(createEmptyEvaluations());
    }
  };

  fetchData();
}, [currentUser, evalDate]);


  if (!currentUser || !CurrentAge.validUser) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText style={{ fontSize: 18 }}>No se selecciono un usuario válido</ThemedText>
      </ThemedView>
    );
  }

  // verify if all evaluations are completed
  const allDone = Object.values(evals).every((e) => e.completed);

  const goToEvaluation = useCallback(
    (area: string) => {
      router.replace({
        pathname: "/(session)/evaluationApply",
        params: {
          evaluationArea: area,
          uid: currentUser.uid,
          range: CurrentAge.range,
        },
      });
    },
    [currentUser]
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>

          {/* Patient information */}
          <SelectableCard noAction={true}>
            <ThemedText style={styles.label}>Datos del Paciente</ThemedText>

            <ThemedText style={styles.textItem}>
              Nombre: <Text style={styles.value}>{currentUser.name} {currentUser.lastName}</Text>
            </ThemedText>

            <View style={styles.cardInformation}>
              <ThemedText style={styles.textItem}>
                {currentUser.uidType}: <Text style={styles.value}>{currentUser.uid}</Text>
              </ThemedText>

              <ThemedText style={styles.textItem}>
                FN: <Text style={styles.value}>{currentUser.dob.day}-{currentUser.dob.month}-{currentUser.dob.year}</Text>
              </ThemedText>
            </View>

            <View style={styles.cardInformation}>
              <ThemedText style={styles.textItem}>
                Edad:{" "}
                <Text style={styles.value}>
                  {CurrentAge.ageMonths} Meses {CurrentAge.ageDays} Días
                </Text>
              </ThemedText>

              <ThemedText style={styles.textItem}>
                Rango: <Text style={styles.value}>{CurrentAge.range}</Text>
              </ThemedText>
            </View>
          </SelectableCard>

          <ThemedText style={styles.text}>
            Complete las siguientes evaluaciones, una vez finalizadas presione "Generar reporte".
          </ThemedText>

          {/* Dynamically generated buttons */}
          {evaluationButtons.map(({ key, title }) => (
            <EvaluationButton
              key={key}
              title={title}
              status={evals[key].completed ? "Completado" : "No Iniciado"}
              onPress={() => goToEvaluation(key)}
            />
          ))}

          {/* Report button */}
          {allDone && (
            <Button
              label="Generar Reporte"
              style={styles.reportButton}
              onPress={async () => {
                try {
                  const results = getResults(evals, currentUser, CurrentAge);
                  console.log("EVALUACION:", JSON.stringify(evals, null, 2));

                  await saveResults(currentUser.uid, results);

                  console.log("RESULTADOS:", results);

                  router.replace("/evaluationReport")

                } catch (err) {
                  console.error("Error generando el reporte:", err);
                }
              }}
            >
            </Button>
          )}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

// Style definitions
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  label: { fontWeight: "bold", marginBottom: 15, fontSize: 20, textAlign: "center" },
  cardInformation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },

  textItem: {
    fontWeight: "600",
  },

  value: {
    fontWeight: "400",
  },

  text: {
    textAlign: 'center',
    marginVertical: 15,
    fontSize: 15,
  },

  reportButton: {

    marginTop: 30,
  },

  reportText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});
