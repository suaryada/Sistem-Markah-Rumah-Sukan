
import React, { useState, useMemo } from 'react';
import { INITIAL_EVENTS, HOUSES } from '../constants';
import { Student, Participation, Category, Gender } from '../types';
import { Printer, FileText, ChevronRight, UserCheck, AlertCircle, Loader2 } from 'lucide-react';

interface ReportsPanelProps {
  students: Student[];
  participations: Participation[];
}

const ReportsPanel: React.FC<ReportsPanelProps> = ({ students, participations }) => {
  const [categoryFilter, setCategoryFilter] = useState<Category>('A');
  const [genderFilter, setGenderFilter] = useState<Gender>('Lelaki');
  const [isPreparing, setIsPreparing] = useState(false);

  const categories: Category[] = ['A', 'B', 'C'];
  const genders: Gender[] = ['Lelaki', 'Perempuan'];

  const filteredEvents = useMemo(() => {
    const catLabel = categoryFilter === 'A' ? 'A (Tahun 5 & 6)' : categoryFilter === 'B' ? 'B (Tahun 3 & 4)' : 'C (Tahun 1 & 2)';
    return INITIAL_EVENTS.filter(e => e.category === `${catLabel} - ${genderFilter}`);
  }, [categoryFilter, genderFilter]);

  const handlePrint = () => {
    setIsPreparing(true);
    
    // Gunakan requestAnimationFrame untuk memastikan UI telah dikemaskini sebelum cetakan
    requestAnimationFrame(() => {
      // Tunggu sebentar untuk memberi kesan visual butang ditekan
      setTimeout(() => {
        try {
          window.focus();
          window.print();
        } catch (e) {
          console.error("Gagal membuka dialog cetakan:", e);
          alert("Gagal memanggil fungsi cetakan. Sila cuba gunakan Ctrl+P atau Cmd+P.");
        } finally {
          setIsPreparing(false);
        }
      }, 500);
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* FILTER SECTION */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col xl:flex-row items-center justify-between gap-8 print:hidden relative z-[60]">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
            <Printer size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Pilih Senarai</h3>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Sediakan Dokumen Cetakan</p>
          </div>
        </div>

        <div className="flex items-center bg-slate-100 p-2 rounded-2xl gap-3 w-full xl:w-auto overflow-x-auto no-scrollbar">
          <div className="flex gap-1.5 bg-white p-1.5 rounded-xl shadow-sm border border-slate-200/50 shrink-0">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-5 py-2.5 rounded-lg text-[11px] font-black transition-all ${categoryFilter === cat ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 bg-white p-1.5 rounded-xl shadow-sm border border-slate-200/50 shrink-0">
            {genders.map(g => (
              <button
                key={g}
                type="button"
                onClick={() => setGenderFilter(g)}
                className={`px-5 py-2.5 rounded-lg text-[11px] font-black transition-all ${genderFilter === g ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                {g}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={isPreparing}
            onClick={handlePrint}
            className={`ml-4 px-8 py-4 bg-slate-900 hover:bg-emerald-700 text-white rounded-xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl flex items-center gap-3 active:scale-95 cursor-pointer disabled:opacity-70 disabled:cursor-wait`}
          >
            {isPreparing ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Printer size={18} />
            )}
            {isPreparing ? 'Menyediakan...' : 'Cetak / Simpan PDF'}
          </button>
        </div>
      </div>

      {/* PRINT CONTENT */}
      <div className="space-y-12">
        {filteredEvents.map(event => {
          const participants = participations
            .filter(p => p.eventId === event.id)
            .map(p => students.find(s => s.id === p.studentId))
            .filter(s => !!s) as Student[];

          return (
            <div key={event.id} className="bg-white rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:border-slate-300 print:rounded-none break-inside-avoid mb-10">
              <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center print:bg-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 print:hidden">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-none mb-1">
                      {event.name}
                    </h4>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
                      {event.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jumlah Peserta</span>
                  <div className="text-xl font-black text-slate-800">{participants.length}</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100 print:bg-white print:text-black">
                    <tr>
                      <th className="px-10 py-5 w-16 border-r border-slate-100 print:border-slate-300">No</th>
                      <th className="px-10 py-5 border-r border-slate-100 print:border-slate-300">Nama Penuh Murid</th>
                      <th className="px-10 py-5">Rumah Sukan</th>
                      <th className="px-10 py-5 text-right print:hidden">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 print:divide-slate-300">
                    {participants.map((student, idx) => (
                      <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-10 py-6 text-xs font-black text-slate-300 group-hover:text-emerald-500 transition-colors border-r border-slate-100 print:border-slate-300">
                          {String(idx + 1).padStart(2, '0')}
                        </td>
                        <td className="px-10 py-6 border-r border-slate-100 print:border-slate-300">
                          <div className="font-black text-slate-800 text-sm uppercase tracking-tight">
                            {student.name}
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-2">
                             <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${HOUSES[student.houseId].bgGradient} print:border print:border-slate-300`}></div>
                             <span className={`text-[10px] font-black uppercase tracking-tight ${HOUSES[student.houseId].textColor} print:text-black`}>
                               {HOUSES[student.houseId].name.split(' ')[0]}
                             </span>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-right print:hidden">
                          <span className="text-emerald-500">
                            <UserCheck size={18} />
                          </span>
                        </td>
                      </tr>
                    ))}
                    {participants.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-10 py-16 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                          Tiada peserta didaftarkan untuk acara ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* PRINT-ONLY HEADER (Hidden in UI) */}
      <div className="hidden print:block print:fixed print:top-0 print:left-0 print:right-0 print:text-center print:border-b-2 print:border-black print:pb-4 print:mb-8 bg-white">
        <h1 className="text-2xl font-black uppercase">SK BUKIT BOTA</h1>
        <h2 className="text-xl font-bold uppercase">KEJOHANAN OLAHRAGA TAHUNAN 2026</h2>
        <p className="text-sm font-bold uppercase mt-1">SENARAI PESERTA: KATEGORI {categoryFilter} - {genderFilter}</p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { size: A4; margin: 1.5cm; }
          body { background: white !important; padding: 0 !important; }
          .shadow-sm, .shadow-lg, .shadow-2xl { box-shadow: none !important; }
          table { border: 1px solid #000; border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #000; padding: 12px; }
          thead { display: table-header-group; }
          tr { break-inside: avoid; }
          .print\\:hidden { display: none !important; }
        }
      `}} />
    </div>
  );
};

export default ReportsPanel;
