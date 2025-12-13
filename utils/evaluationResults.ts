// utils/evaluationResults.ts
import PDtoPT from "@/assets/data/PDtoPT.json";
import levelGraph from "@/assets/data/levelGraph.json";
import { getShortDate } from "@/utils/date";
import AsyncStorage from "@react-native-async-storage/async-storage";


export type ResultsItem = {
  pd: number; 
  pt: number;
  level: 'Satisfactorio' | 'Riesgo de Problema' | 'Sospecha de Problema' ;
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

// initializing the type for Results
export const createEmptyResults = (): EvaluationResults => ({
  userinfo: { name: "", lastName: "", uid: "", uidType: "", dob: { day: 0, month: 0, year: 0 }},
  age: { ageMonths: 0, ageDays: 0, validUser: true, range: 1 }, 
  date: "",
  MG: { pd: 0, pt: 0, level: 'Sospecha de Problema', answers: [] },
  MF: { pd: 0, pt: 0, level: 'Sospecha de Problema', answers: [] },
  AL: { pd: 0, pt: 0, level: 'Sospecha de Problema', answers: [] },
  PS: { pd: 0, pt: 0, level: 'Sospecha de Problema', answers: [] },
});


// initializing the type for Evaluations
export const createEmptyEvaluations = (): EvaluationAreas => ({
  MG: { completed: false, date: null, answers: [] },
  MF: { completed: false, date: null, answers: [] },
  AL: { completed: false, date: null, answers: [] },
  PS: { completed: false, date: null, answers: [] },
});


// load questions from banks
export const load = (QuestionBanks: any, area: string) => {
  return QuestionBanks[area] || [];
};


//  save the results object in async storage
export const saveResults = async (
  uid: string,
  evalResults: EvaluationResults,
) => {
  const evalDate = getShortDate();
  const key = `results_${uid}_${evalDate}`;

  await AsyncStorage.setItem(key, JSON.stringify(evalResults));
};

// load the results object from async
export const loadResults = async (
  uid: string,
  date: string
): Promise<EvaluationResults> => {
  
  const key = `results_${uid}_${date}`;

  try {
    const saved = await AsyncStorage.getItem(key);

    if (!saved) {
      return createEmptyResults();
    }

    const parsed = JSON.parse(saved);

    // Ensurar estructura completa
    return {
      ...createEmptyResults(),
      ...parsed
    };

  } catch (err) {
    console.error("Error leyendo resultados", err);
    return createEmptyResults();
  }
};



// load evaluations
export const loadEvaluations = async (
  uid: string,
  date: string
): Promise<EvaluationAreas> => {
  const key = `evaluations_${uid}_${date}`;
  const saved = await AsyncStorage.getItem(key);

  try {
    if (!saved) {
      return createEmptyEvaluations();
    }

    const parsed = JSON.parse(saved);
    return { ...createEmptyEvaluations(), ...parsed };

  } catch (err) {
    console.error("Error leyendo evaluaciones", err);
    return createEmptyEvaluations();
  }
};



// Calculate results (PD, PT and level) based on the answers
export const getResults = (
  evaluation: EvaluationAreas,
  userinfo: any,
  age: any,
): EvaluationResults => {

  const rangeIndex = age.range - 1;

  const getPD = (item: EvaluationItem) => {
    const initial = Math.max(item.answers[0].questionId - 1, 0);
    const score = item.answers.filter(a => a.answer).length;
    return initial + score;
  };
  const evalDate = getShortDate();

  const PDMG = getPD(evaluation.MG);
  const PDMF = getPD(evaluation.MF);
  const PDAL = getPD(evaluation.AL);
  const PDPS = getPD(evaluation.PS);

  const PTMG = PDtoPT.MG[rangeIndex][PDMG];
  const PTMF = PDtoPT.MF[rangeIndex][PDMF];
  const PTAL = PDtoPT.AL[rangeIndex][PDAL];
  const PTPS = PDtoPT.PS[rangeIndex][PDPS];

  const getLevel = (pt: number, min: number, max: number) => {
    if (pt >= max) return "Satisfactorio";
    if (pt <= min) return "Sospecha de Problema";
    return "Riesgo de Problema";
  };

  return {
    userinfo: userinfo,
    age: age,
    date: evalDate,
    MG: {
      pd: PDMG,
      pt: PTMG,
      level: getLevel(
        PTMG,
        levelGraph.MG[rangeIndex].min,
        levelGraph.MG[rangeIndex].max
      ),
      answers: evaluation.MG.answers
    },
    MF: {
      pd: PDMF,
      pt: PTMF,
      level: getLevel(
        PTMF,
        levelGraph.MF[rangeIndex].min,
        levelGraph.MF[rangeIndex].max
      ),
      answers: evaluation.MF.answers
    },
    AL: {
      pd: PDAL,
      pt: PTAL,
      level: getLevel(
        PTAL,
        levelGraph.AL[rangeIndex].min,
        levelGraph.AL[rangeIndex].max
      ),
      answers: evaluation.AL.answers
    },
    PS: {
      pd: PDPS,
      pt: PTPS,
      level: getLevel(
        PTPS,
        levelGraph.PS[rangeIndex].min,
        levelGraph.PS[rangeIndex].max
      ),
      answers: evaluation.PS.answers
    }
  };
};
