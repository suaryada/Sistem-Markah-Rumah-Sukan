
import React, { useState, useMemo } from 'react';
import { HOUSES, INITIAL_EVENTS, getPointsByRank, isTeamEvent } from '../constants';
import { HouseId, ScoreEntry, Student, Participation } from '../types';
import { Trash2, ShieldCheck, Info, Save, Trophy, Users, Sparkles } from 'lucide-react';

interface AdminPanelProps {
  scores: ScoreEntry[];
  students: Student[];
  participations: Participation[];
  onAddScore: (score: ScoreEntry) => void;
  onDeleteScore: (id: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ scores, students, participations, onAddScore, onDeleteScore }) => {
  const scoringEvents = useMemo(() => {
    const list: { id: string; name: string; category: string; isSukaneka: boolean; subEvents?: string[] }[] = [];
    const processedSukaneka = new Set();

    INITIAL_EVENTS.forEach(ev => {
      if (ev.name.includes('Sukaneka')) {
        const cat = ev.category.split(' - ')[0];
        const key = `${cat}-sukaneka`.toLowerCase().replace(/\s+/g, '-');
        if (!processedSukaneka.has(key)) {
          const subEvents = INITIAL_EVENTS
            .filter(e => e.category.startsWith(cat) && e.name.includes('Sukaneka'))
            .map(e => e.id);
          
          list.push({ id: key, name: 'Sukaneka', category: cat, isSukaneka: true, subEvents });
          processedSukaneka.add(key);
        }
      } else {
        list.push({ ...ev, isSukaneka: false });
      }
    });
    return list;
  }, []);

  const [selectedEventKey, setSelectedEventKey] = useState(scoringEvents[0]?.id || '');
  
  const [rankData, setRankData] = useState<Record<number, { houseId: HouseId | '', studentId: string }>>({
    1: { houseId: '', studentId: '' },
    2: { houseId: '', studentId: '' },
    3: { houseId: '', studentId: '' },
    4: { houseId: '', studentId: '' },
  });

  const currentScoringEvent = useMemo(() => 
    scoringEvents.find(ev => ev.id === selectedEventKey) || scoringEvents[0]
  , [selectedEventKey, scoringEvents]);

  const eventIsTeam = useMemo(() => currentScoringEvent ? isTeamEvent(currentScoringEvent.name) : false, [currentScoringEvent]);

  const handleRankChange = (rank: number, field: 'houseId' | 'studentId', value: string) => {
    setRankData(prev => ({
      ...prev,
      [rank]: {
        ...prev[rank],
        [field]: value,
        ...(field === 'houseId' ? { studentId: '' } : {})
      }
    }));
  };

  const handleSaveAll = () => {
    const rankLabels: Record<number, string> = { 1: 'Johan', 2: 'Naib Johan', 3: 'Ketiga', 4: 'Keempat' };
    let addedCount = 0;

    ([1, 2, 3, 4] as const).forEach((rank) => {
      const data = rankData[rank];
      if (data.houseId !== '') {
        const points = getPointsByRank(rank, eventIsTeam);
        let winnerPart = '';

        if (eventIsTeam) {
          const eventIds = currentScoringEvent.isSukaneka ? currentScoringEvent.subEvents || [] : [selectedEventKey];
          const members = participations
            .filter(p => eventIds.includes(p.eventId))
            .map(p => students.find(s => s.id === p.studentId))
            .filter(s => s && s.houseId === data.houseId) as Student[];
          
          const names = members.map(s => s.name).join(', ');
          winnerPart = `[Ahli: ${names || 'Kumpulan'}]`;
        } else {
          const student = students.find(s => s.id === data.studentId);
          winnerPart = student ? `(${student.name})` : '(Individu)';
        }

        // DELIMITER: | for clean parsing
        const finalDescription = `${rankLabels[rank]} | ${currentScoringEvent.category} | ${currentScoringEvent.name} | ${winnerPart}`;

        onAddScore({
          id: Math.random().toString(36).substr(2, 9),
          eventId: selectedEventKey,
          houseId: data.houseId as HouseId,
          studentId: data.studentId || undefined,
          points,
          timestamp: Date.now(),
          description: finalDescription,
        });
        addedCount++;
      }
    });

    if (addedCount > 0) {
      setRankData({ 1: { houseId: '', studentId: '' }, 2: { houseId: '', studentId: '' }, 3: { houseId: '', studentId: '' }, 4: { houseId: '', studentId: '' } });
      alert(`Berjaya menyimpan ${addedCount} keputusan.`);
    } else {
      alert("Sila masukkan sekurang-kurangnya satu pemenang.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Pemenang</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kemaskini keputusan</p>
            </div>
          </div>
          <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${eventIsTeam ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
            <Sparkles size={14} />
            {eventIsTeam ? 'Acara Berpasukan' : 'Acara Individu'}
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Pilih Acara Sukan</label>
            <select
              value={selectedEventKey}
              onChange={(e) => setSelectedEventKey(e.target.value)}
              className="p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-black text-slate-800"
            >
              {scoringEvents.map(event => (
                <option key={event.id} value={event.id}>{event.category} | {event.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((rank) => (
              <div key={rank} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col gap-5 group hover:border-indigo-200 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy size={20} className={rank === 1 ? 'text-yellow-500' : rank === 2 ? 'text-slate-400' : 'text-amber-700'} />
                    <span className="font-black text-xs uppercase tracking-widest text-slate-700">
                      {rank === 1 ? 'Johan' : rank === 2 ? 'Naib Johan' : rank === 3 ? 'Ketiga' : 'Keempat'}
                    </span>
                  </div>
                  <div className="text-[10px] font-black bg-white px-3 py-1 rounded-full shadow-sm text-indigo-600 border border-slate-100">
                    +{getPointsByRank(rank, eventIsTeam)} MATA
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Rumah Sukan</label>
                    <select
                      value={rankData[rank].houseId}
                      onChange={(e) => handleRankChange(rank, 'houseId', e.target.value)}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">-- Pilih Rumah --</option>
                      {Object.values(HOUSES).map(h => (
                        <option key={h.id} value={h.id}>{h.name}</option>
                      ))}
                    </select>
                  </div>

                  {!eventIsTeam && rankData[rank].houseId && (
                    <div className="space-y-1.5 animate-in slide-in-from-left-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Pilih Atlet</label>
                      <select
                        value={rankData[rank].studentId}
                        onChange={(e) => handleRankChange(rank, 'studentId', e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">-- Pilih Nama --</option>
                        {participations
                          .filter(p => p.eventId === selectedEventKey)
                          .map(p => students.find(s => s.id === p.studentId))
                          .filter(s => s && s.houseId === rankData[rank].houseId)
                          .map(s => (
                            <option key={s!.id} value={s!.id}>{s!.name}</option>
                          ))
                        }
                      </select>
                    </div>
                  )}

                  {eventIsTeam && rankData[rank].houseId && (
                    <div className="flex flex-col justify-center">
                      <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center gap-2">
                        <Users size={14} className="text-indigo-400" />
                        <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-tight leading-tight">Ahli kumpulan ditarik secara automatik.</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-3 text-[11px] text-slate-400 max-w-xl">
              <div className="shrink-0 mt-0.5 p-1 bg-slate-100 rounded-lg"><Info size={16} /></div>
              <p>Simpan keputusan mengikut <strong>Kedudukan</strong>. Pastikan pendaftaran murid telah dibuat untuk membolehkan pemilihan atlet.</p>
            </div>
            <button
              onClick={handleSaveAll}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 px-12 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl shadow-indigo-100"
            >
              <Save size={24} /> Simpan Keputusan
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-slate-800 uppercase tracking-tight">Sejarah Rekod</h3>
          </div>
          <span className="text-[10px] font-black bg-slate-200 text-slate-600 px-4 py-1.5 rounded-full uppercase tracking-widest">{scores.length} REKOD</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">Keterangan Rasmi</th>
                <th className="px-8 py-5">Rumah Sukan</th>
                <th className="px-8 py-5 text-right">Mata</th>
                <th className="px-8 py-5 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scores.slice().reverse().map((score) => (
                <tr key={score.id} className="hover:bg-slate-50/20 transition-colors group text-sm">
                  <td className="px-8 py-6">
                    <div className="text-[10px] font-bold text-indigo-600 uppercase leading-relaxed max-w-md">
                      {score.description}
                    </div>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                      {new Date(score.timestamp).toLocaleTimeString('ms-MY')}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${HOUSES[score.houseId].bgGradient} shadow-sm`}></div>
                       <span className={`text-xs font-black uppercase tracking-tight ${HOUSES[score.houseId].textColor}`}>
                         {HOUSES[score.houseId].name}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right font-black text-slate-800 text-base">+{score.points}</td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => onDeleteScore(score.id)}
                      className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
