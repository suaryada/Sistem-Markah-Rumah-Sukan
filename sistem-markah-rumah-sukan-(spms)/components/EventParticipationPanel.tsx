
import React, { useState, useMemo } from 'react';
import { HOUSES, INITIAL_EVENTS, isTeamEvent } from '../constants';
import { HouseId, Student, Participation, Category, Gender } from '../types';
import { ClipboardCheck, ArrowLeft, Users, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

interface EventParticipationPanelProps {
  students: Student[];
  participations: Participation[];
  onToggleParticipation: (studentId: string, eventId: string) => void;
}

const EventParticipationPanel: React.FC<EventParticipationPanelProps> = ({ 
  students, 
  participations, 
  onToggleParticipation 
}) => {
  const [selectedHouseId, setSelectedHouseId] = useState<HouseId | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<Category>('A');
  const [genderFilter, setGenderFilter] = useState<Gender>('Lelaki');

  const categories: Category[] = ['A', 'B', 'C'];
  const genders: Gender[] = ['Lelaki', 'Perempuan'];

  const filteredEvents = useMemo(() => {
    const catLabel = categoryFilter === 'A' ? 'A (Tahun 5 & 6)' : categoryFilter === 'B' ? 'B (Tahun 3 & 4)' : 'C (Tahun 1 & 2)';
    return INITIAL_EVENTS.filter(e => e.category === `${catLabel} - ${genderFilter}`);
  }, [categoryFilter, genderFilter]);

  const filteredStudents = useMemo(() => {
    if (!selectedHouseId) return [];
    return students.filter(s => 
      s.houseId === selectedHouseId && 
      s.category === categoryFilter && 
      s.gender === genderFilter
    );
  }, [selectedHouseId, categoryFilter, genderFilter, students]);

  const stats = useMemo(() => {
    const studentStats: Record<string, { individual: number; team: number }> = {};
    const houseEventStats: Record<string, number> = {};

    participations.forEach(p => {
      const student = students.find(s => s.id === p.studentId);
      if (student?.houseId === selectedHouseId) {
        houseEventStats[p.eventId] = (houseEventStats[p.eventId] || 0) + 1;
      }

      if (!studentStats[p.studentId]) studentStats[p.studentId] = { individual: 0, team: 0 };
      const event = INITIAL_EVENTS.find(e => e.id === p.eventId);
      if (event) {
        if (isTeamEvent(event.name)) studentStats[p.studentId].team += 1;
        else studentStats[p.studentId].individual += 1;
      }
    });

    return { studentStats, houseEventStats };
  }, [participations, selectedHouseId, students]);

  const isEnrolled = (sId: string, eId: string) => 
    participations.some(p => p.studentId === sId && p.eventId === eId);

  const getValidation = (sId: string, eId: string) => {
    const enrolled = isEnrolled(sId, eId);
    if (enrolled) return { allowed: true, message: '' };

    const event = INITIAL_EVENTS.find(e => e.id === eId);
    const isTeam = event ? isTeamEvent(event.name) : false;
    
    const sStat = stats.studentStats[sId] || { individual: 0, team: 0 };
    if (isTeam && sStat.team >= 2) return { allowed: false, message: 'Had murid (Kump 2/2)' };
    if (!isTeam && sStat.individual >= 2) return { allowed: false, message: 'Had murid (Ind 2/2)' };

    const hCount = stats.houseEventStats[eId] || 0;
    // Sukaneka adalah 4 orang lelaki + 4 orang perempuan = 8 orang campuran.
    // Memandangkan UI difilter mengikut jantina, limit bagi jantina semasa adalah 4.
    const limit = event?.name.includes('Sukaneka') ? 4 : (isTeam ? 4 : 2);
    if (hCount >= limit) return { allowed: false, message: `Had rumah (${limit}/${limit})` };

    return { allowed: true, message: '' };
  };

  if (!selectedHouseId) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {(Object.keys(HOUSES) as HouseId[]).map((hId) => (
            <button
              key={hId}
              onClick={() => setSelectedHouseId(hId)}
              className="group bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200 hover:shadow-2xl hover:border-indigo-200 transition-all text-left relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${HOUSES[hId].bgGradient} opacity-[0.03] group-hover:opacity-10 transition-opacity`}></div>
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${HOUSES[hId].bgGradient} mb-8 flex items-center justify-center text-white shadow-xl`}>
                <Users size={32} />
              </div>
              <h3 className="text-sm font-black text-slate-800 mb-2 uppercase leading-tight tracking-tight">{HOUSES[hId].name}</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                Matriks Pendaftaran <ChevronRight size={14} />
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-right-6 duration-700">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col xl:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => setSelectedHouseId(null)}
            className="p-4 bg-slate-50 hover:bg-indigo-50 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h3 className={`text-2xl font-black ${HOUSES[selectedHouseId].textColor} uppercase tracking-tight`}>
              {HOUSES[selectedHouseId].name}
            </h3>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Matriks Penyertaan Atlet</p>
          </div>
        </div>

        <div className="flex items-center bg-slate-100 p-2 rounded-2xl gap-3 w-full xl:w-auto overflow-x-auto no-scrollbar">
          <div className="flex gap-1.5 bg-white p-1.5 rounded-xl shadow-sm border border-slate-200/50 shrink-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-5 py-2.5 rounded-lg text-[11px] font-black transition-all ${categoryFilter === cat ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 bg-white p-1.5 rounded-xl shadow-sm border border-slate-200/50 shrink-0">
            {genders.map(g => (
              <button
                key={g}
                onClick={() => setGenderFilter(g)}
                className={`px-5 py-2.5 rounded-lg text-[11px] font-black transition-all ${genderFilter === g ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="sticky left-0 z-20 bg-slate-50 px-10 py-8 min-w-[240px] border-r border-slate-100">
                  <div className="flex items-center gap-3 text-slate-800 font-black text-[11px] uppercase tracking-[0.2em]">
                    <Users size={18} /> Nama Peserta
                  </div>
                </th>
                {filteredEvents.map(event => {
                   const isSukaneka = event.name.includes('Sukaneka');
                   const limit = isSukaneka ? 4 : (isTeamEvent(event.name) ? 4 : 2);
                   return (
                    <th key={event.id} className="px-5 py-8 text-center min-w-[140px] border-r border-slate-100 last:border-0">
                      <div className="flex flex-col items-center">
                         <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-full ${isTeamEvent(event.name) ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                           {isSukaneka ? 'Mixed' : (isTeamEvent(event.name) ? 'Team' : 'Ind')}
                         </span>
                         <span className="text-xs font-black text-slate-700 uppercase tracking-tight leading-tight">
                           {event.name}
                         </span>
                         <div className="mt-3 text-[11px] font-black text-slate-400">
                           {stats.houseEventStats[event.id] || 0}/{limit}
                         </div>
                      </div>
                    </th>
                   );
                })}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => {
                const sStat = stats.studentStats[student.id] || { individual: 0, team: 0 };
                return (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50/50 px-10 py-6 border-r border-slate-100 shadow-[4px_0_10px_rgba(0,0,0,0.02)]">
                      <div className="font-black text-slate-800 text-xs truncate uppercase tracking-tight">{student.name}</div>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg ${sStat.individual >= 2 ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500'}`}>
                          {sStat.individual}/2 IND
                        </span>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg ${sStat.team >= 2 ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500'}`}>
                          {sStat.team}/2 KUMP
                        </span>
                      </div>
                    </td>
                    {filteredEvents.map(event => {
                      const enrolled = isEnrolled(student.id, event.id);
                      const validation = getValidation(student.id, event.id);
                      const isDisabled = !enrolled && !validation.allowed;

                      return (
                        <td key={event.id} className="px-3 py-6 border-r border-slate-100 last:border-0 text-center">
                           <button
                             disabled={isDisabled}
                             onClick={() => onToggleParticipation(student.id, event.id)}
                             title={validation.message}
                             className={`mx-auto w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                               enrolled 
                                 ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-110' 
                                 : isDisabled 
                                   ? 'bg-slate-50 text-slate-200 cursor-not-allowed' 
                                   : 'bg-white border-2 border-slate-100 text-slate-300 hover:border-indigo-400 hover:text-indigo-400 hover:scale-105'
                             }`}
                           >
                             {enrolled ? <CheckCircle2 size={22} /> : isDisabled ? <XCircle size={20} /> : <div className="w-2 h-2 rounded-full bg-current opacity-30"></div>}
                           </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={filteredEvents.length + 1} className="px-10 py-24 text-center text-slate-400 font-bold uppercase tracking-widest text-sm">
                    Sila daftar murid dalam tab "Murid" terlebih dahulu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventParticipationPanel;
