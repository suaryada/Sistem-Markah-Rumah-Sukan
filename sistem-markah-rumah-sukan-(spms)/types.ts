
export type HouseId = 'merah' | 'biru' | 'hijau' | 'kuning';
export type Category = 'A' | 'B' | 'C';
export type Gender = 'Lelaki' | 'Perempuan';

export interface House {
  id: HouseId;
  name: string;
  color: string;
  textColor: string;
  bgGradient: string;
}

export interface ScoreEntry {
  id: string;
  eventId: string;
  houseId: HouseId;
  studentId?: string; // ID of the student who won
  points: number;
  timestamp: number;
  description: string;
}

export interface Student {
  id: string;
  name: string;
  category: Category;
  gender: Gender;
  houseId: HouseId;
}

export interface Participation {
  studentId: string;
  eventId: string;
}

export interface Event {
  id: string;
  name: string;
  category: string; // e.g., A - Lelaki, B - Perempuan
}

export interface HouseStanding {
  houseId: HouseId;
  totalPoints: number;
  rank: number;
}
