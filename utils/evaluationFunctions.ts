// utils/evaluationFunctions.ts
import { getShortDate } from "@/utils/date";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Types for evaluation
export type EvaluationItem = {
  completed: boolean;
  date: string | null;
  answers: { questionId: number; question: string; answer: boolean }[];
};

export type EvaluationAreas = {
  MG: EvaluationItem;
  MF: EvaluationItem;
  AL: EvaluationItem;
  PS: EvaluationItem;
};



// Create empty evaluations
export const createEmptyEvaluations = (): EvaluationAreas => ({
  MG: { completed: false, date: null, answers: [] },
  MF: { completed: false, date: null, answers: [] },
  AL: { completed: false, date: null, answers: [] },
  PS: { completed: false, date: null, answers: [] },
});

// Evaluation state
export type EvaluationState = {
  decreasing: boolean; // whether the evaluation index is in decreasing mode
  increasing: boolean; // whether the evaluation index is in increasing mode
  PI: boolean; // whether the "Punto de Inicio" has been found
  PC: boolean; // whether the "Punto de Cierre" has been found
  findPI: boolean; // whether we are searching for the "Punto de Inicio"
  findPC: boolean; // whether we are searching for the "Punto de Cierre"
  hadToDecrease: boolean; // to indicate we had to decrease at some point
  indexAtDecrease: number; // index at which the decrease happened
};

// Sort answers before saving
export const sortAnswers = (
  answers: { questionId: number; question: string; answer: boolean }[]
) => {
  return [...answers].sort((a, b) => a.questionId - b.questionId);
};


// Create initial state
export const createInitialEvaluationState = (): EvaluationState => ({
  decreasing: false,
  increasing: false,
  PI: false,
  PC: false,
  findPI: false,
  findPC: false,
  hadToDecrease: false,
  indexAtDecrease: 0,
});

// Reset state (optional)
export const resetEvaluationState = (): EvaluationState => createInitialEvaluationState();

// Load questions from QuestionBanks
export const loadQuestions = (QuestionBanks: any, area: string) => {
  return QuestionBanks[area] || [];
};

// Add answer
export const addAnswer = (
  prevAnswers: { questionId: number; question: string; answer: boolean }[],
  questionId: number,
  question: string,
  answer: boolean
) => [...prevAnswers, { questionId, question, answer }];


// Save evaluation in AsyncStorage
export const saveEvaluation = async (
  uid: string,
  area: keyof EvaluationAreas,
  answers: { questionId: number; question: string; answer: boolean }[]
) => {
  const evalDate = getShortDate();
  const key = `evaluations_${uid}_${evalDate}`;

  const saved = await AsyncStorage.getItem(key);
  const evaluations: EvaluationAreas = saved
    ? JSON.parse(saved)
    : createEmptyEvaluations();

  evaluations[area] = {
    completed: true,
    date: evalDate,
    answers: sortAnswers(answers), // SORTED BEFORE SAVING
  };

  await AsyncStorage.setItem(key, JSON.stringify(evaluations));
};


// Get next index with state
export const getNextQuestionIndex = (
  currentIndex: number,
  answers: { questionId: number; question: string; answer: boolean }[],
  questions: any[],
  range: number,
  initialIndex: number,
  state: EvaluationState
): { nextIndex: number; state: EvaluationState } => {

  const answerCount = answers.length;
  const currentAnswer = answers[answers.length - 1];

  if (state.PI && state.PC) return { nextIndex: 100, state };

  if (range > 1) {
    // First question logic
    if (answerCount === 1) {
      if (currentAnswer.answer) {
        state.increasing = true;
        return { nextIndex: currentIndex + 1, state };
      }
      state.decreasing = true;
      state.indexAtDecrease = initialIndex;
      return { nextIndex: currentIndex - 1, state };
    }

    // Second question logic
    if (answerCount === 2) {
      if (state.increasing) {
        if (currentAnswer.answer) {
          state.increasing = true;
          state.PI = true;
          state.findPC = true;
          return { nextIndex: currentIndex + 1, state };
        }
        state.increasing = false;
        state.decreasing = true;
        state.findPI = true;
        state.indexAtDecrease = currentIndex;
        currentIndex = initialIndex;
        return { nextIndex: currentIndex - 1, state };
      }

      if (currentAnswer.answer) {
        state.findPI = true;
        return { nextIndex: currentIndex - 1, state };
      }
      state.PC = true;
      state.findPI = true;
      return { nextIndex: currentIndex - 1, state };
    }

    // If findPI is active
    if (state.findPI) {
      const PreviousAnswer = answers[answers.length - 2];

      if (answerCount > 3) {
        if (currentAnswer.answer && PreviousAnswer.answer) {
          state.decreasing = false;
          state.increasing = true;
          state.PI = true;
          state.findPC = true;
          state.findPI = false;
          state.hadToDecrease = true;
          currentIndex = initialIndex;
          if (state.PI && state.PC) return { nextIndex: 100, state };
          return { nextIndex: currentIndex + 1, state };
        }
        if (!currentAnswer.answer && !PreviousAnswer.answer) {
          state.PC = true;
          return { nextIndex: currentIndex - 1, state };
        }
        return { nextIndex: currentIndex - 1, state };
      }

      if (initialIndex === state.indexAtDecrease) {
        if (currentAnswer.answer && PreviousAnswer.answer) {
          state.decreasing = false;
          state.increasing = true;
          state.hadToDecrease = true;
          state.PI = true;
          state.findPC = true;
          state.findPI = false;
          currentIndex = initialIndex;
          return { nextIndex: currentIndex + 1, state };
        }
        return { nextIndex: currentIndex - 1, state };
      }

      const firstAnswer = answers[0];
      if (currentAnswer.answer && firstAnswer.answer) {
        state.decreasing = false;
        state.increasing = true;
        state.PI = true;
        state.findPC = true;
        state.findPI = false;
        state.hadToDecrease = true;
        currentIndex = state.indexAtDecrease;
        return { nextIndex: currentIndex + 1, state };
      }
      return { nextIndex: currentIndex - 1, state };
    }

    // if findPC is active
    if (state.findPC && !state.PC) {
      const PreviousAnswer = answers[answers.length - 2];

      if (state.hadToDecrease) {
        const compareAnswer = state.indexAtDecrease === initialIndex ? answers[0] : answers[1];

        if (!currentAnswer.answer && !compareAnswer.answer) {
          state.PC = true;
          return { nextIndex: 100, state };
        }

        state.hadToDecrease = false;
        return { nextIndex: currentIndex + 1, state };
      }

      if (!currentAnswer.answer && !PreviousAnswer.answer) {
        state.PC = true;
        return { nextIndex: 100, state };
      }

      return { nextIndex: currentIndex + 1, state };
    }
  }

  if (currentIndex === 0) return { nextIndex: currentIndex + 1, state };
  const PreviousAnswer = answers[answers.length - 2];
  if (!currentAnswer.answer && !PreviousAnswer.answer) {
    state.PC = true;
    return { nextIndex: 100, state };
  }

  return { nextIndex: currentIndex + 1, state };
};
