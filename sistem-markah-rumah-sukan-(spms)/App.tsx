
import React, { useState, useEffect } from 'react';
import { ScoreEntry, Student, Participation } from './types';
import AdminPanel from './components/AdminPanel';
import Dashboard from './components/Dashboard';
import RegistrationPanel from './components/RegistrationPanel';
import EventParticipationPanel from './components/EventParticipationPanel';
import ReportsPanel from './components/ReportsPanel';
import AdminLogin from './components/AdminLogin';
import { LayoutDashboard, Settings, Medal, Trophy, Users, LogOut, ChevronRight, GraduationCap, Printer, Lock, Unlock, ShieldAlert } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'admin' | 'guru'>('dashboard');
  const [adminSubTab, setAdminSubTab] = useState<'home' | 'scoring' | 'registration' | 'reports'>('home');
  
  // Lock state for Guru tab
  const [isGuruLocked, setIsGuruLocked] = useState<boolean>(false);
  
  // Separate login states for Admin and Guru
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isGuruLoggedIn, setIsGuruLoggedIn] = useState<boolean>(false);
  
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [participations, setParticipations] = useState<Participation[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedScores = localStorage.getItem('sports_house_scores');
    if (savedScores) {
      try { setScores(JSON.parse(savedScores)); } catch (e) { console.error(e); }
    }

    const savedStudents = localStorage.getItem('sports_house_students');
    if (savedStudents) {
      try { setStudents(JSON.parse(savedStudents)); } catch (e) { console.error(e); }
    }

    const savedParts = localStorage.getItem('sports_house_participations');
    if (savedParts) {
      try { setParticipations(JSON.parse(savedParts)); } catch (e) { console.error(e); }
    }

    const savedLock = localStorage.getItem('guru_tab_locked');
    if (savedLock === 'true') setIsGuruLocked(true);

    // Load login states
    if (localStorage.getItem('admin_logged_in') === 'true') setIsAdminLoggedIn(true);
    if (localStorage.getItem('guru_logged_in') === 'true') setIsGuruLoggedIn(true);
  }, []);

  // Persistence
  useEffect(() => {
    localStorage.setItem('sports_house_scores', JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    localStorage.setItem('sports_house_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('sports_house_participations', JSON.stringify(participations));
  }, [participations]);

  useEffect(() => {
    localStorage.setItem('guru_tab_locked', isGuruLocked.toString());
  }, [isGuruLocked]);

  const handleLogin = (password: string) => {
    if (activeTab === 'admin') {
      if (password === 'Cba9046') {
        setIsAdminLoggedIn(true);
        localStorage.setItem('admin_logged_in', 'true');
        return true;
      }
    } else if (activeTab === 'guru') {
      if (password === 'Guru123') {
        setIsGuruLoggedIn(true);
        localStorage.setItem('guru_logged_in', 'true');
        return true;
      }
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setIsGuruLoggedIn(false);
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('guru_logged_in');
    setAdminSubTab('home');
    setActiveTab('dashboard');
  };

  const handleAddScore = (newScore: ScoreEntry) => {
    setScores(prev => [...prev, newScore]);
  };

  const handleDeleteScore = (id: string) => {
    setScores(prev => prev.filter(s => s.id !== id));
  };

  const handleAddStudent = (newStudent: Student) => {
    setStudents(prev => [...prev, newStudent]);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setParticipations(prev => prev.filter(p => p.studentId !== id));
  };

  const handleToggleParticipation = (studentId: string, eventId: string) => {
    setParticipations(prev => {
      const exists = prev.find(p => p.studentId === studentId && p.eventId === eventId);
      if (exists) {
        return prev.filter(p => p !== exists);
      } else {
        return [...prev, { studentId, eventId }];
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-2.5 rounded-2xl shadow-lg shadow-indigo-200">
                <Medal className="text-white" size={24} />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-black text-slate-800 leading-none tracking-tight uppercase">SK BUKIT BOTA</h1>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] mt-1">Kejohanan Olahraga 2026</span>
              </div>
            </div>

            <nav className="flex items-center gap-2">
              <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 px-6 py-2 rounded-xl font-black transition-all ${
                    activeTab === 'dashboard' 
                      ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <LayoutDashboard size={18} />
                  <span className="text-sm">Dashboard</span>
                </button>
                <button
                  onClick={() => setActiveTab('guru')}
                  className={`flex items-center gap-2 px-6 py-2 rounded-xl font-black transition-all ${
                    activeTab === 'guru' 
                      ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' 
                      : isGuruLocked 
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {isGuruLocked ? <Lock size={18} className="text-red-400" /> : <GraduationCap size={18} />}
                  <span className="text-sm">Guru</span>
                </button>
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`flex items-center gap-2 px-6 py-2 rounded-xl font-black transition-all ${
                    activeTab === 'admin' 
                      ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Settings size={18} />
                  <span className="text-sm">Admin</span>
                </button>
              </div>
              
              {(isAdminLoggedIn || isGuruLoggedIn) && activeTab !== 'dashboard' && (
                <button
                  onClick={handleLogout}
                  className="p-2.5 text-slate-400 hover:text-red-500 transition-colors ml-2"
                  title="Log Keluar Semua"
                >
                  <LogOut size={20} />
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="mb-10 text-center sm:text-left print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-4xl font-black text-slate-800 tracking-tight">
                {activeTab === 'dashboard' && 'Kedudukan Rumah Sukan'}
                {activeTab === 'guru' && (isGuruLocked ? 'Sistem Dikunci' : !isGuruLoggedIn ? 'Log Masuk Guru' : 'Pendaftaran Acara')}
                {activeTab === 'admin' && (
                  !isAdminLoggedIn ? 'Log Masuk Pentadbir' : 
                  adminSubTab === 'home' ? 'Menu Pentadbiran' :
                  adminSubTab === 'scoring' ? 'Markah' :
                  adminSubTab === 'reports' ? 'Cetakan Senarai' :
                  'Pendaftaran Murid'
                )}
              </h2>
              <p className="text-slate-500 mt-2 max-w-2xl text-lg font-medium">
                {activeTab === 'dashboard' && 'Pantau keputusan terkini Kejohanan Olahraga Tahunan SK Bukit Bota 2026.'}
                {activeTab === 'guru' && (
                  isGuruLocked ? 'Pendaftaran acara telah ditutup oleh pihak urus setia.' :
                  !isGuruLoggedIn ? 'Hanya untuk kegunaan guru pengiring rumah sukan.' : 
                  'Daftarkan atlet rumah sukan anda ke acara-acara yang dipertandingkan.'
                )}
                {activeTab === 'admin' && (
                  !isAdminLoggedIn ? 'Kawasan larangan untuk urus setia kejohanan sahaja.' :
                  adminSubTab === 'home' ? 'Sila pilih tugasan pentadbiran untuk diteruskan.' :
                  adminSubTab === 'scoring' ? 'Masukkan keputusan pemenang bagi setiap acara sukan.' :
                  adminSubTab === 'reports' ? 'Cetak senarai peserta mengikut acara untuk urusan kejohanan.' :
                  'Urus pangkalan data murid bagi setiap rumah sukan.'
                )}
              </p>
            </div>
            
            {isAdminLoggedIn && activeTab === 'admin' && adminSubTab !== 'home' && (
              <button 
                onClick={() => setAdminSubTab('home')}
                className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
              >
                Kembali ke Menu
              </button>
            )}
          </div>
        </div>

        {activeTab === 'dashboard' && <Dashboard scores={scores} students={students} />}
        
        {activeTab === 'guru' && (
          isGuruLocked ? (
            <div className="max-w-md mx-auto py-20 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-red-50 border border-red-100 flex flex-col items-center">
                <div className="w-24 h-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center text-red-500 mb-8 animate-pulse">
                  <ShieldAlert size={48} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-4">Akses Disekat</h3>
                <p className="text-slate-400 font-medium leading-relaxed">
                  Sistem pendaftaran peserta bagi guru rumah sukan telah <strong>DITUTUP</strong> sementara waktu untuk urusan teknikal atau tarikh tutup pendaftaran telah tamat.
                </p>
                <div className="mt-8 pt-8 border-t border-slate-100 w-full">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Sila Hubungi Urus Setia</span>
                </div>
              </div>
            </div>
          ) : !isGuruLoggedIn ? (
            <AdminLogin onLogin={handleLogin} role="Guru" />
          ) : (
            <EventParticipationPanel 
              students={students} 
              participations={participations}
              onToggleParticipation={handleToggleParticipation}
            />
          )
        )}

        {activeTab === 'admin' && (
          !isAdminLoggedIn ? (
            <AdminLogin onLogin={handleLogin} role="Admin" />
          ) : (
            <>
              {adminSubTab === 'home' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                  <button
                    onClick={() => setAdminSubTab('scoring')}
                    className="group relative bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-300 transition-all text-left overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50/50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 mb-6 group-hover:scale-110 transition-transform">
                        <Trophy size={32} />
                      </div>
                      <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2 leading-tight">Markah</h3>
                      <p className="text-slate-400 font-medium mb-6 text-xs leading-relaxed">Masukkan keputusan rasmi acara dan mata rumah sukan.</p>
                      <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">
                        Mula Sekarang <ChevronRight size={14} />
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setAdminSubTab('registration')}
                    className="group relative bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-purple-300 transition-all text-left overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-purple-50/50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-purple-100 mb-6 group-hover:scale-110 transition-transform">
                        <Users size={32} />
                      </div>
                      <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2 leading-tight">Pendaftaran<br/>Murid</h3>
                      <p className="text-slate-400 font-medium mb-6 text-xs leading-relaxed">Urus pangkalan data murid bagi setiap rumah sukan.</p>
                      <div className="flex items-center gap-2 text-purple-600 font-black text-[10px] uppercase tracking-[0.2em]">
                        Urus Sekarang <ChevronRight size={14} />
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setAdminSubTab('reports')}
                    className="group relative bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-emerald-300 transition-all text-left overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50/50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-100 mb-6 group-hover:scale-110 transition-transform">
                        <Printer size={32} />
                      </div>
                      <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2 leading-tight">Cetakan<br/>Senarai</h3>
                      <p className="text-slate-400 font-medium mb-6 text-xs leading-relaxed">Cetak senarai peserta bagi setiap acara yang dipertandingkan.</p>
                      <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em]">
                        Lihat Cetakan <ChevronRight size={14} />
                      </div>
                    </div>
                  </button>

                  <div
                    className={`group relative p-10 rounded-[3rem] border transition-all text-left overflow-hidden ${isGuruLocked ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}
                  >
                    <div className="relative z-10">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl mb-6 transition-colors ${isGuruLocked ? 'bg-red-600' : 'bg-slate-400'}`}>
                        {isGuruLocked ? <Lock size={32} /> : <Unlock size={32} />}
                      </div>
                      <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2 leading-tight">Kawalan<br/>Akses</h3>
                      <p className="text-slate-400 font-medium mb-6 text-xs leading-relaxed">Kunci atau buka pendaftaran acara untuk guru-guru.</p>
                      <button 
                        onClick={() => setIsGuruLocked(!isGuruLocked)}
                        className={`w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-md active:scale-95 ${isGuruLocked ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-white text-slate-800 hover:bg-slate-200 border border-slate-200'}`}
                      >
                        {isGuruLocked ? 'BUKA SEKARANG' : 'KUNCI SISTEM'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {adminSubTab === 'scoring' && (
                <AdminPanel 
                  scores={scores} 
                  students={students}
                  participations={participations}
                  onAddScore={handleAddScore} 
                  onDeleteScore={handleDeleteScore} 
                />
              )}

              {adminSubTab === 'registration' && (
                <RegistrationPanel 
                  students={students} 
                  onAddStudent={handleAddStudent} 
                  onDeleteStudent={handleDeleteStudent} 
                />
              )}

              {adminSubTab === 'reports' && (
                <ReportsPanel 
                  students={students}
                  participations={participations}
                />
              )}
            </>
          )
        )}
      </main>

      <footer className="mt-20 py-12 border-t border-slate-200 bg-white print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-indigo-600 opacity-50">
            <Medal size={24} />
            <span className="font-black tracking-widest text-sm uppercase">SK BUKIT BOTA</span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] text-center">
            &copy; 2026 SK Bukit Bota • Sistem Pengurusan Markah Sukan
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
