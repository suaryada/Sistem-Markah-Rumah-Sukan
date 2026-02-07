
import { House, Event } from './types';

export const HOUSES: Record<string, House> = {
  merah: {
    id: 'merah',
    name: 'Mat Kilau (Merah)',
    color: '#ef4444',
    textColor: 'text-red-600',
    bgGradient: 'from-red-500 to-red-700',
  },
  biru: {
    id: 'biru',
    name: 'Tok Gajah (Biru)',
    color: '#3b82f6',
    textColor: 'text-blue-600',
    bgGradient: 'from-blue-500 to-blue-700',
  },
  hijau: {
    id: 'hijau',
    name: 'Mat Lela (Hijau)',
    color: '#22c55e',
    textColor: 'text-green-600',
    bgGradient: 'from-green-500 to-green-700',
  },
  kuning: {
    id: 'kuning',
    name: 'Dato Bahaman (Kuning)',
    color: '#eab308',
    textColor: 'text-yellow-600',
    bgGradient: 'from-yellow-400 to-yellow-600',
  },
};

const TEAM_EVENT_KEYWORDS = ['4x', 'Sukaneka'];

export const isTeamEvent = (eventName: string): boolean => {
  return TEAM_EVENT_KEYWORDS.some(keyword => eventName.includes(keyword));
};

export const getPointsByRank = (rank: number, isTeam: boolean): number => {
  if (isTeam) {
    const teamPoints: Record<number, number> = { 1: 10, 2: 6, 3: 3, 4: 1 };
    return teamPoints[rank] || 0;
  } else {
    const individualPoints: Record<number, number> = { 1: 5, 2: 3, 3: 1, 4: 0 };
    return individualPoints[rank] || 0;
  }
};

const generateEvents = (): Event[] => {
  const events: Event[] = [];
  const genders = ['Lelaki', 'Perempuan'];
  
  // Category A, B, C
  ['A (Tahun 5 & 6)', 'B (Tahun 3 & 4)', 'C (Tahun 1 & 2)'].forEach(cat => {
    genders.forEach(gender => {
      const eventNames = cat.includes('C') 
        ? ['80m', 'Lontar Peluru', 'Lompat Jauh', '4x100m', '4x50m', '4x25m', 'Sukaneka']
        : ['Lompat Jauh', 'Lontar Peluru', '100m', '200m', '4x100m', '4x200m', '4x50m', 'Sukaneka'];

      eventNames.forEach(name => {
        events.push({
          id: `${cat}-${gender}-${name}`.replace(/\s+/g, '-').toLowerCase(),
          name,
          category: `${cat} - ${gender}`
        });
      });
    });
  });

  return events;
};

export const INITIAL_EVENTS: Event[] = generateEvents();
