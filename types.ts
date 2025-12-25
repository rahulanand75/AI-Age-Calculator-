
export interface AgeDetails {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalHours: number;
  nextBirthday: {
    months: number;
    days: number;
    weekday: string;
  };
  zodiac: string;
  zodiacIcon: string;
  teluguRashi: string;
}

export interface PlanetAge {
  name: string;
  age: number;
  nextBirthday: string;
  icon: string;
  color: string;
}

export interface AIInsight {
  birthYearFact: string;
  generation: string;
  historicalContext: string;
  lifePathAdvice: string;
  personalityNature: string;
  futurePredictions: string;
}
