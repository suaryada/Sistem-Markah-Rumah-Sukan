
import React, { useMemo, useEffect, useState } from 'react';
import { HOUSES } from '../constants';
import { ScoreEntry, HouseStanding, Student } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Trophy, TrendingUp, History, Sparkles, User, Users, Zap } from 'lucide-react';
import { getSportsCommentary } from '../services/geminiService';

interface DashboardProps {
  scores: ScoreEntry[];
  students: Student[];
}

const Dashboard: React.FC<DashboardProps> = ({ scores, students }) => {
  const [commentary, setCommentary] = useState<string>("Sedang menganalisis prestasi terkini...");

  const standings: HouseStanding[] = useMemo(() => {
    const totals: Record<string, number> = {
      merah: 0,
      biru: 0,
      hijau: 0,
      kuning: 0,
    };

    scores.forEach(score => {
      if (totals.hasOwnProperty(score.houseId)) {
        totals[score.houseId] += score.points;
      }
    });

    return Object.entries(totals)
      .map(([houseId, totalPoints]) => ({
        houseId: houseId as any,
        totalPoints,
        rank: 0,
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((item, index) => ({ ...item, rank: index + 1 }));
  }, [scores]);

  const chartData = useMemo(() => {
    return standings.map(s => ({
      name: HOUSES[s.houseId]?.name.split(' ')[0] || s.houseId, 
      mata: s.totalPoints,
      color: HOUSES[s.houseId]?.color || '#ccc',
    }));
  }, [standings]);

  useEffect(() => {
    const fetchAI = async () => {
      if (scores.length > 0) {
        const text = await getSportsCommentary(standings, HOUSES, scores.slice(-3));
        setCommentary(text);
      } else {
        setCommentary("Kejohanan belum bermula. Masukkan keputusan untuk ulasan AI!");
      }
    };
    fetchAI();
  }, [standings, scores]);

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '🏃';
  };

  const cleanCategory = (text: string) => {
    return text.replace(/\(Tahun[^)]+\)/g, '').replace(/\s+/g, ' ').trim().toUpperCase();
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* AI Commentary Section */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 p-1 rounded-[2.5rem] shadow-xl shadow-indigo-100 overflow-hidden group">
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[calc(2.5rem-4px)] text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Sparkles size={80} />
          </div>
          <div className="flex items-center gap-3 mb-4 text-indigo-200">
            <Sparkles size={20} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Ulasan Sukan AI</span>
          </div>
          <p className="text-xl md:text-2xl font-bold leading-tight italic pr-12">
            "{commentary}"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Container */}
        <div className="lg:col-span-2 bg-white p-6 md:p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col min-h-[500px]">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
              <TrendingUp size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Prestasi Keseluruhan</h2>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mata Terkumpul Rumah Sukan</p>
            </div>
          </div>
          
          <div className="w-full flex-1">
            <ResponsiveContainer width="100%" aspect={window.innerWidth < 768 ? 1.5 : 2} minHeight={350}>
              <BarChart data={chartData} margin={{ top: 30, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 13, fontWeight: 800 }} 
                  dy={20} 
                />
                <YAxis hide domain={[0, 'auto']} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }} 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -10px rgb(0 0 0 / 0.1)', padding: '16px' }} 
                />
                <Bar dataKey="mata" radius={[20, 20, 0, 0]} barSize={60}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList 
                    dataKey="mata" 
                    position="top" 
                    style={{ fill: '#1e293b', fontWeight: 900, fontSize: 20 }} 
                    offset={15} 
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Standing Rankings Card */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-4 bg-yellow-50 rounded-2xl text-yellow-600">
              <Trophy size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Kedudukan</h2>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ranking Kejohanan</p>
            </div>
          </div>
          <div className="space-y-4 flex-1">
            {standings.map((s) => (
              <div key={s.houseId} className={`p-6 rounded-[2rem] border-2 flex items-center justify-between transition-all ${s.rank === 1 ? 'bg-yellow-50 border-yellow-100' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{getRankEmoji(s.rank)}</span>
                  <div>
                    <h3 className="font-black text-slate-800 text-[11px] leading-tight uppercase tracking-tight">{HOUSES[s.houseId]?.name}</h3>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Rumah Sukan</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-2xl font-black ${HOUSES[s.houseId]?.textColor}`}>{s.totalPoints}</span>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Mata</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-slate-900 rounded-2xl text-white">
              <History size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Aktiviti Terkini</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Papan Keputusan Terkini</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {scores.slice(-10).reverse().map((score) => {
            const parts = score.description.split(' | ');
            const rankLabel = parts[0] || "Johan";
            const rawCat = parts[1] || "";
            const event = parts[2] || "";
            const athlete = parts[3]?.replace(/[()]/g, '').replace(' [Ahli: ', '').replace(']', '') || "Atlet";

            const catLabel = cleanCategory(rawCat);
            const isTeam = score.description.includes('[Ahli:');

            return (
              <div key={score.id} className="flex flex-col md:flex-row md:items-center gap-4 p-5 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all group">
                <div className="flex items-center justify-between md:justify-start gap-4 md:w-32 shrink-0">
                  <span className="text-[9px] font-black text-slate-400 font-mono tracking-tighter">
                    {new Date(score.timestamp).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black text-white shadow-sm flex items-center gap-1.5`} style={{ backgroundColor: HOUSES[score.houseId]?.color }}>
                    +{score.points}
                  </div>
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 uppercase shrink-0">
                      {catLabel}
                    </span>
                    <span className="text-slate-300 hidden md:inline">•</span>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                      {event}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-sm font-black text-slate-800 uppercase leading-none truncate flex-1 min-w-[150px]">
                      <span className="text-indigo-400 font-bold">{rankLabel}:</span> {athlete}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: HOUSES[score.houseId]?.color }}></div>
                    <span className={`text-[11px] font-black uppercase tracking-tight ${HOUSES[score.houseId]?.textColor}`}>
                      {HOUSES[score.houseId]?.name.split(' ')[0]}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-100 text-slate-300">
                    {isTeam ? <Users size={14} /> : <User size={14} />}
                  </div>
                </div>
              </div>
            );
          })}

          {scores.length === 0 && (
            <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/50">
              <Zap className="mx-auto text-slate-300 mb-4 animate-pulse" size={40} />
              <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Tiada keputusan lagi.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
