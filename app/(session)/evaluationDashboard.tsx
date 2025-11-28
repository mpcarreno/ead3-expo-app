// UserEvaluationScreen.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// 🔹 Import correcto del hook del contexto
import { useSelectedUser } from "@/scripts/selectedUserContext";

export default function UserEvaluationScreen() {
  const { currentUser, clearUser } = useSelectedUser(); // 🔹 aquí
  const router = useRouter();

  const [evaluationStarted, setEvaluationStarted] = useState(false);
  const [answers, setAnswers] = useState<any>({
    q1: null,
    q2: null,
  });

  if (!currentUser) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18 }}>No hay usuario seleccionado</Text>
      </View>
    );
  }

  const saveEvaluation = async () => {
    const uid = currentUser.uid;

    const existing = await AsyncStorage.getItem(`evaluations_${uid}`);
    const arr = existing ? JSON.parse(existing) : [];

    const newEval = {
      date: new Date().toISOString(),
      answers,
    };

    arr.push(newEval);

    await AsyncStorage.setItem(`evaluations_${uid}`, JSON.stringify(arr));

    clearUser();  // borrar usuario en sesión
    router.push("/"); // regresar al home
  };

  return (
    <View style={styles.container}>
      {/* Datos del paciente */}
      {!evaluationStarted && (
        <>
          <Text style={styles.title}>Paciente seleccionado</Text>

          <TouchableOpacity
            style={[
              styles.card,
              evaluationStarted && { backgroundColor: "#e0f0ff" }, // opcional efecto visual
            ]}
            onPress={() => setEvaluationStarted(false)}
          >
            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>
              {currentUser.name} {currentUser.lastName}
            </Text>

            <Text style={styles.label}>ID:</Text>
            <Text style={styles.value}>{currentUser.uid}</Text>

            <Text style={styles.label}>Edad:</Text>
            <Text style={styles.value}>
              {currentUser.ageAtCreation?.rangeName || currentUser.ageAtCreation?.range}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setEvaluationStarted(true)}
          >
            <Text style={styles.buttonText}>Iniciar evaluación</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Evaluación */}
      {evaluationStarted && (
        <View style={styles.evalContainer}>
          <Text style={styles.evalTitle}>Evaluación del paciente</Text>

          {/* Pregunta 1 */}
          <Text style={styles.question}>1. ¿El paciente tiene dolor?</Text>
          <View style={styles.options}>
            <TouchableOpacity
              style={[styles.option, answers.q1 === "yes" && styles.optionSelected]}
              onPress={() => setAnswers({ ...answers, q1: "yes" })}
            >
              <Text style={styles.optionText}>Sí</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.option, answers.q1 === "no" && styles.optionSelected]}
              onPress={() => setAnswers({ ...answers, q1: "no" })}
            >
              <Text style={styles.optionText}>No</Text>
            </TouchableOpacity>
          </View>

          {/* Pregunta 2 */}
          <Text style={styles.question}>2. ¿Tiene fiebre?</Text>
          <View style={styles.options}>
            <TouchableOpacity
              style={[styles.option, answers.q2 === "yes" && styles.optionSelected]}
              onPress={() => setAnswers({ ...answers, q2: "yes" })}
            >
              <Text style={styles.optionText}>Sí</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.option, answers.q2 === "no" && styles.optionSelected]}
              onPress={() => setAnswers({ ...answers, q2: "no" })}
            >
              <Text style={styles.optionText}>No</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, { marginTop: 30 }]}
            onPress={saveEvaluation}
          >
            <Text style={styles.buttonText}>Guardar evaluación</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  card: { backgroundColor: "#f3f3f3", padding: 20, borderRadius: 14, marginBottom: 20 },
  label: { fontWeight: "bold", marginTop: 10, fontSize: 16 },
  value: { fontSize: 16 },
  button: { backgroundColor: "#007aff", padding: 14, borderRadius: 10, marginTop: 10 },
  buttonText: { textAlign: "center", color: "white", fontSize: 18, fontWeight: "600" },
  evalContainer: { marginTop: 10 },
  evalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  question: { fontSize: 18, marginTop: 10 },
  options: { flexDirection: "row", gap: 10, marginTop: 10 },
  option: { padding: 12, borderRadius: 10, borderWidth: 1, borderColor: "#ccc", flex: 1, alignItems: "center" },
  optionSelected: { backgroundColor: "#007aff33", borderColor: "#007aff" },
  optionText: { fontSize: 16 },
});
