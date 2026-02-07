
import React, { useState, useMemo } from 'react';
import { HOUSES } from '../constants';
import { HouseId, Student, Category, Gender } from '../types';
import { UserPlus, Trash2, Users, Search, ClipboardList, Info, X, AlertTriangle, CheckCircle, Trash } from 'lucide-react';

interface RegistrationPanelProps {
  students: Student[];
  onAddStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
}

const RegistrationPanel: React.FC<RegistrationPanelProps> = ({ students, onAddStudent, onDeleteStudent }) => {
  // Filter States
  const [category, setCategory] = useState<Category>('A');
  const [gender, setGender] = useState<Gender>('Lelaki');
  const [houseId, setHouseId] = useState<HouseId>('merah');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  
  // Bulk Input State
  const [bulkNames, setBulkNames] = useState('');

  // Filtering Logic
  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      s.category === category &&
      s.gender === gender &&
      s.houseId === houseId &&
      (searchTerm === '' || s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [students, category, gender, houseId, searchTerm]);

  const handleBulkAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const names = bulkNames.split('\n').map(n => n.trim()).filter(n => n !== '');
    
    if (names.length === 0) return;

    names.forEach(name => {
      onAddStudent({
        id: Math.random().toString(36).substr(2, 9),
        name: name.toUpperCase(),
        category,
        gender,
        houseId,
      });
    });

    setBulkNames('');
    setShowAddModal(false);
  };

  const confirmIndividualDelete = () => {
    if (studentToDelete) {
      onDeleteStudent(studentToDelete.id);
      setStudentToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const confirmBulkDeleteAction = () => {
    filteredStudents.forEach(s => onDeleteStudent(s.id));
    setShowBulkDeleteModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      
      {/* POPUP: TAMBAH MURID */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
            <button onClick={() => setShowAddModal(false)} className="absolute top-8 right-8 p-2 text-slate-300 hover:text-slate-600 transition-colors">
              <X size={24} />
            </button>
            
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">
                <UserPlus size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Tambah Murid</h3>
              <div className="flex items-center gap-2 mt-2">
                 <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-500">{category}</span>
                 <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-500">{gender}</span>
                 <span className={`text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full ${HOUSES[houseId].textColor}`}>{HOUSES[houseId].name.split(' ')[0]}</span>
              </div>
            </div>

            <form onSubmit={handleBulkAddSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Senarai Nama (Satu baris satu nama)</label>
                <textarea
                  value={bulkNames}
                  onChange={(e) => setBulkNames(e.target.value)}
                  placeholder="AHMAD BIN ALI&#10;SITI BINTI ABU..."
                  className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-800 focus:border-indigo-500 min-h-[150px] font-mono text-sm leading-relaxed"
                  autoFocus
                  required
                />
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 font-black py-5 rounded-[1.5rem] transition-all uppercase tracking-widest text-[10px]">Batal</button>
                <button type="submit" className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-indigo-100 transition-all transform active:scale-[0.98] uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2">
                  <CheckCircle size={18} /> Simpan Murid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP: PENGESAHAN PADAM INDIVIDU */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
            <div className="w-20 h-20 bg-red-50 rounded-[2.5rem] flex items-center justify-center text-red-500 mx-auto mb-6"><AlertTriangle size={40} /></div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">Padam Rekod?</h3>
            <p className="text-sm text-slate-400 font-medium mb-8">Anda akan memadam <span className="text-slate-800 font-black">"{studentToDelete?.name}"</span> daripada pangkalan data.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 bg-slate-100 text-slate-500 font-black py-5 rounded-[1.5rem] uppercase text-[10px]">Batal</button>
              <button onClick={confirmIndividualDelete} className="flex-1 bg-red-600 text-white font-black py-5 rounded-[1.5rem] uppercase text-[10px]">Ya, Padam</button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP: PENGESAHAN PADAM SEMUA (BULK) */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-2 bg-red-800"></div>
            <div className="w-20 h-20 bg-red-100 rounded-[2.5rem] flex items-center justify-center text-red-800 mx-auto mb-6"><Trash size={40} /></div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">Padam Semua Murid?</h3>
            <p className="text-sm text-slate-400 font-medium mb-8 px-4">
              Tindakan ini akan memadam <span className="text-red-700 font-black">{filteredStudents.length} orang murid</span> dalam kategori <span className="text-slate-800 font-bold">{category} - {gender}</span> bagi Rumah {HOUSES[houseId].name.split(' ')[0]}.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowBulkDeleteModal(false)} className="flex-1 bg-slate-100 text-slate-500 font-black py-5 rounded-[1.5rem] uppercase text-[10px]">Kembali</button>
              <button onClick={confirmBulkDeleteAction} className="flex-1 bg-red-800 text-white font-black py-5 rounded-[1.5rem] uppercase text-[10px]">Ya, Padam Semua</button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-sm border border-slate-200">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 mb-12 border-b border-slate-50 pb-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
              <ClipboardList size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Pendaftaran Murid</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Urus Pangkalan Data Atlet</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={() => setShowBulkDeleteModal(true)} 
              disabled={filteredStudents.length === 0}
              className="w-full sm:w-auto bg-white border-2 border-red-100 hover:border-red-500 text-red-400 hover:text-red-600 font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-2 transition-all text-xs uppercase tracking-widest disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed group"
            >
              <Trash2 size={18} className="group-hover:animate-shake" /> Padam Murid
            </button>
            <button 
              onClick={() => setShowAddModal(true)} 
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-10 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-100 text-xs uppercase tracking-widest transform active:scale-95"
            >
              <UserPlus size={18} /> Tambah Murid
            </button>
          </div>
        </div>

        {/* BUTTON-BASED FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Category Buttons */}
          <div className="space-y-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Pilih Kategori</span>
            <div className="flex bg-slate-100 p-2 rounded-[1.5rem] gap-2">
              {(['A', 'B', 'C'] as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex-1 py-4 rounded-xl font-black text-sm transition-all duration-300 ${category === cat ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Gender Buttons */}
          <div className="space-y-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Pilih Jantina</span>
            <div className="flex bg-slate-100 p-2 rounded-[1.5rem] gap-2">
              {(['Lelaki', 'Perempuan'] as Gender[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 py-4 rounded-xl font-black text-[11px] transition-all duration-300 uppercase tracking-tight ${gender === g ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* House Buttons */}
          <div className="space-y-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Pilih Rumah Sukan</span>
            <div className="grid grid-cols-2 bg-slate-100 p-2 rounded-[1.5rem] gap-2">
              {(Object.values(HOUSES)).map((h) => (
                <button
                  key={h.id}
                  onClick={() => setHouseId(h.id)}
                  className={`py-2 px-3 rounded-xl font-black text-[10px] transition-all border-2 flex items-center gap-2 duration-300 ${houseId === h.id ? `bg-white border-indigo-200 ${h.textColor} shadow-md` : 'bg-transparent border-transparent text-slate-400'}`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${houseId === h.id ? `bg-gradient-to-br ${h.bgGradient}` : 'bg-slate-300'}`}></div>
                  <span className="truncate">{h.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LIST SECTION */}
        <div className="bg-slate-50/50 rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-inner">
          <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Users size={20} className="text-slate-400" />
              <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">
                Peserta Terdaftar <span className="text-indigo-600 ml-1">({filteredStudents.length})</span>
              </h3>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text"
                placeholder="Cari nama dalam senarai..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-100 outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-100/50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-10 py-5">Nama Penuh Murid</th>
                  <th className="px-10 py-5">Kategori</th>
                  <th className="px-10 py-5">Jantina</th>
                  <th className="px-10 py-5 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-indigo-50/30 transition-all group">
                    <td className="px-10 py-6">
                      <div className="font-black text-slate-800 text-sm uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                        {student.name}
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200">
                        {student.category}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                      {student.gender}
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button
                        onClick={() => {
                          setStudentToDelete(student);
                          setShowDeleteModal(true);
                        }}
                        className="p-3 text-slate-200 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all transform active:scale-90"
                        title="Padam Rekod"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-10 py-32 text-center">
                      <div className="flex flex-col items-center gap-5 opacity-40">
                        <Users size={64} className="text-slate-300" />
                        <div className="max-w-xs mx-auto">
                           <div className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-2 leading-relaxed">
                            {searchTerm ? 'Tiada hasil carian untuk nama tersebut.' : `Tiada rekod bagi kategori ini.`}
                          </div>
                          {!searchTerm && (
                            <button 
                              onClick={() => setShowAddModal(true)} 
                              className="text-indigo-600 font-black text-[10px] uppercase underline decoration-2 underline-offset-4 hover:text-indigo-800 transition-colors"
                            >
                              Tambah Murid Sekarang
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* INFO FOOTER */}
        <div className="mt-10 p-8 bg-indigo-50/30 rounded-[2.5rem] border border-indigo-100/50 flex flex-col sm:flex-row items-center gap-5">
          <div className="p-4 bg-indigo-100 rounded-2xl text-indigo-600 shadow-sm"><Info size={24} /></div>
          <div>
            <h4 className="text-xs font-black text-indigo-900 uppercase tracking-tight mb-1 text-center sm:text-left">Panduan Pantas</h4>
            <p className="text-[11px] text-indigo-700/70 font-medium leading-relaxed text-center sm:text-left">
              Gunakan butang pilihan di atas untuk menapis senarai murid secara dinamik. Anda boleh menambah murid secara pukal dengan menampal senarai nama ke dalam kotak input "Tambah Murid". Pemuatan data adalah secara langsung bagi memudahkan urusan pendaftaran acara.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPanel;
