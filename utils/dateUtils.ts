
import { AgeDetails, PlanetAge } from '../types';

export const calculateAge = (birthDate: Date, today: Date = new Date()): AgeDetails => {
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const diffTime = Math.abs(today.getTime() - birthDate.getTime());
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = (years * 12) + months;
  const totalHours = totalDays * 24;

  // Next Birthday
  let nextBday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBday < today) {
    nextBday.setFullYear(today.getFullYear() + 1);
  }

  let nextBdayMonths = nextBday.getMonth() - today.getMonth();
  let nextBdayDays = nextBday.getDate() - today.getDate();

  if (nextBdayDays < 0) {
    nextBdayMonths--;
    const lastMonth = new Date(nextBday.getFullYear(), nextBday.getMonth(), 0);
    nextBdayDays += lastMonth.getDate();
  }
  if (nextBdayMonths < 0) {
    nextBdayMonths += 12;
  }

  const weekday = nextBday.toLocaleDateString('en-US', { weekday: 'long' });

  // Western Zodiac Sign (Tropical)
  const westernZodiac = getWesternZodiacSign(birthDate.getMonth() + 1, birthDate.getDate());
  
  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalMonths,
    totalHours,
    nextBirthday: {
      months: nextBdayMonths,
      days: nextBdayDays,
      weekday
    },
    zodiac: westernZodiac,
    zodiacIcon: getZodiacIcon(westernZodiac),
    teluguRashi: "" // Now handled exclusively by Vedic AI calculation
  };
};

export const getGeneration = (year: number): string => {
  if (year >= 2013) return "Generation Alpha";
  if (year >= 1997) return "Generation Z";
  if (year >= 1981) return "Millennial (Gen Y)";
  if (year >= 1965) return "Generation X";
  if (year >= 1946) return "Baby Boomer";
  if (year >= 1928) return "Silent Generation";
  return "Greatest Generation";
};

/**
 * Calculates Western Zodiac (Tropical)
 */
const getWesternZodiacSign = (month: number, day: number): string => {
  const signs = ["Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius"];
  const lastDays = [19, 18, 20, 19, 20, 20, 22, 22, 22, 22, 21, 21];
  return (day > lastDays[month - 1]) ? signs[month % 12] : signs[month - 1];
};

const getZodiacIcon = (sign: string): string => {
  const icons: Record<string, string> = {
    Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋",
    Leo: "♌", Virgo: "♍", Libra: "♎", Scorpio: "♏",
    Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓"
  };
  return icons[sign] || "✨";
};

export const calculatePlanetAges = (birthDate: Date): PlanetAge[] => {
  const diffTime = Math.abs(new Date().getTime() - birthDate.getTime());
  const earthYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);

  const planets = [
    { name: 'Mercury', ratio: 0.24, icon: '🌡️', color: 'bg-orange-100 text-orange-700' },
    { name: 'Venus', ratio: 0.62, icon: '☁️', color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Mars', ratio: 1.88, icon: '🔴', color: 'bg-red-100 text-red-700' },
    { name: 'Jupiter', ratio: 11.86, icon: '🌀', color: 'bg-amber-100 text-amber-700' },
    { name: 'Saturn', ratio: 29.46, icon: '🪐', color: 'bg-blue-100 text-blue-700' },
    { name: 'Uranus', ratio: 84.01, icon: '💎', color: 'bg-cyan-100 text-cyan-700' },
  ];

  return planets.map(p => ({
    name: p.name,
    age: Number((earthYears / p.ratio).toFixed(2)),
    nextBirthday: "Upcoming",
    icon: p.icon,
    color: p.color
  }));
};
