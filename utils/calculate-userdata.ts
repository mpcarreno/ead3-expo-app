// Age and Range Calculator

type DOB ={
  day: number;
  month: number;
  year: number;
  isPremature: string;
  gestationalAge: number | null; // in Weeks
}

type AgeResult ={
  ageMonths: number;
  ageDays: number;
  validUser: boolean;
  range: number | null;
}

export function calculateAgeRange(dob: DOB): AgeResult {
  const today = new Date();
  
  let totalMonths = (today.getFullYear() * 12 + today.getMonth()) - (dob.year * 12 + (dob.month - 1));
  let totalDays = today.getDate() - dob.day;
  console.log (today.getDate())
  

  if (totalDays < 0) {
    totalMonths -= 1;
    totalDays += 30;
  }

  const ageCorrection = (totalMonths < 24 || (totalMonths == 24 && totalDays == 0))

  if ((dob.isPremature === 'Si') && dob.gestationalAge !== null && ageCorrection) {
    console.log(totalDays)
    let remainingDays = totalDays - ((40 - (dob.gestationalAge)) * 7);
    if (remainingDays < 0) {
    totalMonths -= 1;
    remainingDays += 30;
    totalDays = remainingDays
    }
    console.log("siprematuro",totalDays)
  }

  const ageInMonths = totalMonths;
  const ageInDays = totalDays;

  const totalAgeInDays = ageInMonths * 30 + ageInDays;

  let range: number | null = null;

  const limits = [
    { min: 0, max: 30 },      // 0d → 1m
    { min: 31, max: 90 },     // 1m1d → 3m
    { min: 91, max: 180 },    // 3m1d → 6m
    { min: 181, max: 270 },   // 6m1d → 9m
    { min: 271, max: 360 },   // 9m1d → 12m
    { min: 361, max: 540 },   // 12m1d → 18m
    { min: 541, max: 720 },   // 18m1d → 24m
    { min: 721, max: 1080 },  // 24m1d → 36m
    { min: 1081, max: 1440 }, // 36m1d → 48m
    { min: 1441, max: 1800 }, // 48m1d → 60m
    { min: 1801, max: 2160 }, // 60m1d → 72m
    { min: 2161, max: 2520 }, // 72m1d → 84m
  ];

  
  for (let i = 0; i < limits.length; i++) {
    if (totalAgeInDays >= limits[i].min && totalAgeInDays <= limits[i].max) {
      range = i + 1;
      break;
    }
  }

  const validUser = range !== null && range <= 12;
  console.log()
  return {
    ageMonths: ageInMonths,
    ageDays: ageInDays,
    validUser: validUser,
    range: range
  };
}
