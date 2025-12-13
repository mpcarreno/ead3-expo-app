// app/(sessions)/evaluationApply.tsx
import { QuestionBanks } from '@/assets/data/questions';
import SelectableCard from '@/components/selectableCard';
import Button from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { Fonts } from '@/constants/theme';
import { addAnswer, createInitialEvaluationState, EvaluationAreas, EvaluationState, getNextQuestionIndex, loadQuestions, saveEvaluation } from "@/utils/evaluationFunctions";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ApplyEvaluation() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const getString = (v: string | string[] | undefined): string =>
    Array.isArray(v) ? v[0] : v || "";

  const area = getString(params.evaluationArea) as keyof EvaluationAreas;
  const uid = getString(params.uid);
  const range = Number(params.range);

  const [visible, setVisible] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finishButton, setFinishButton] = useState(false)
  const [answers, setAnswers] = useState<{ questionId: number; question: string; answer: boolean }[]>([]);
  const [evaluationState, setEvaluationState] = useState<EvaluationState>(createInitialEvaluationState());

  const evaluationName = {
    MG: "Motricidad Gruesa",
    MF: "Motricidad Finoadaptativa",
    AL: "Audicion Lenguaje",
    PS: "Personal Social",
  };

  const initialIndex = (range * 3) - 3;

  // 🔹 Cargar preguntas
  useEffect(() => {
    setQuestions(loadQuestions(QuestionBanks, area));
  }, [area]);

  // 🔹 Inicializar índice
  useEffect(() => {
    if (questions.length > 0) {
      setCurrentIndex(initialIndex);
      setEvaluationState(createInitialEvaluationState()); // Resetear estado al iniciar
    }
  }, [questions]);

  // 🔹 Manejar respuesta
  const handleAnswer = (answer: boolean) => {
    const questionId = questions[currentIndex].questionId;
    const questionText = questions[currentIndex].question; // ⬅️ Guardamos la pregunta

    const updatedAnswers = addAnswer(answers, questionId, questionText, answer);
    setAnswers(updatedAnswers);

    // 🔹 Calcular siguiente índice usando estado
    const { nextIndex, state } = getNextQuestionIndex(
      currentIndex,
      updatedAnswers,
      questions,
      range,
      initialIndex,
      evaluationState
    );

    setEvaluationState(state);

    if (nextIndex < questions.length && nextIndex >= 0) {
      setCurrentIndex(nextIndex);
    } else {
      setFinishButton(true);
    }
  };

  const finishEvaluation = async () => {
    await saveEvaluation(uid, area, answers);
    router.replace({
      pathname: "/(session)/evaluationDashboard",
      params: { updated: "true", uid },
    });
  };

  if (!questions.length)
    return <Text style={styles.loading}>Cargando preguntas...</Text>;

  const question = questions[currentIndex];

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>

          <View style={styles.fixedContainer}>
          <ThemedText style={styles.title}>
                {evaluationName[area]}
              </ThemedText>
              <ThemedText style={{textAlign: 'center'}}>Conteste las siguientes preguntas teniendo en cuenta si cumple o no el Criterio de respuesta.
              </ThemedText>
          </View>

          <View style={styles.questionContainer}>
            <ThemedView style={styles.cardContainer}>
              <SelectableCard noAction = {true} colors = "simple">
                
                <ThemedText style={styles.question}>
                  {currentIndex + 1}. {question.question}
                </ThemedText>

                <View style={styles.helpers}>
                  <Collapsible title="Condición de observación">
                    <ThemedText style={{fontSize: 15}}>
                      {question.condition}
                    </ThemedText>
                  </Collapsible>

                  <Collapsible title="Criterio de respuesta">
                    <ThemedText style={{fontSize: 15}}>
                      {question.criteria}
                    </ThemedText>
                  </Collapsible>
                </View>
            
              </SelectableCard>
            </ThemedView>  

          {!finishButton && ( <View style={styles.buttonsContainer}>
            <View style={styles.buttons}>
              <Button label="No Cumple" backgroundColor= '#cc2525ff' onPress={() => handleAnswer(false)} />
            </View>
            
            <View style={styles.buttons}>   
              <Button label="Cumple" backgroundColor= '#47ae28ff'  onPress={() => handleAnswer(true)} />
            </View>
          </View>)}
          
          {finishButton && (
            <Button label="Guardar Evaluacion" onPress={() => finishEvaluation()} />
          )}
          </View>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignContent: "center",
    verticalAlign: 'top',
    gap: 20,
  },
  fixedContainer: {
    alignContent: "center",
    gap: 8,
  },
  loading: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50
  },
  question: {
    fontSize: 19,
    fontFamily: Fonts.sans,
    fontWeight: '700',
    marginVertical: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    marginHorizontal: 20,
    gap: 70,
    verticalAlign: 'bottom',
  },
  buttons: {
    
    flex: 1,
  },
  cardContainer: {
    borderRadius: 12,
    justifyContent: 'center',
    shadowColor: "#515151ff",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 12,    
  },
  questionContainer: {
    flex: 1,
    gap: 20,
    alignContent: 'center'
  },

  helpers: {
    gap: 20,
    marginVertical: 15,
  },

  title: {
    fontFamily: Fonts.sans,
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 10,
    textAlign: "center",
    
  }
});
