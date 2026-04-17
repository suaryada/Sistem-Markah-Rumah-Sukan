import React, { FormEvent, useMemo, useState } from 'react';
import { CalendarDays, Download, ShieldCheck, Trash2, UserPlus } from 'lucide-react';

type RumahSukan = 'Merah' | 'Biru' | 'Hijau' | 'Kuning';

interface Participant {
  id: string;
  nama: string;
  noMurid: string;
  kelas: string;
  rumahSukan: RumahSukan;
  acara: string[];
  saizBaju: string;
  namaPenjaga: string;
  telefonPenjaga: string;
  catatanKesihatan: string;
  masaDaftar: string;
}

const acaraList = [
  '100 Meter',
  '200 Meter',
  '4 x 100 Meter',
  'Lompat Jauh',
  'Lontar Peluru',
  'Tarik Tali'
];

const emptyForm = {
  nama: '',
  noMurid: '',
  kelas: '',
  rumahSukan: 'Merah' as RumahSukan,
  acara: [] as string[],
  saizBaju: 'M',
  namaPenjaga: '',
  telefonPenjaga: '',
  catatanKesihatan: ''
};

const App: React.FC = () => {
  const [form, setForm] = useState(emptyForm);
  const [participants, setParticipants] = useState<Participant[]>(() => {
    try {
      const saved = localStorage.getItem('pendaftaran_hari_sukan');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [mesej, setMesej] = useState('');

  const jumlahIkutRumah = useMemo(() => {
    return participants.reduce<Record<RumahSukan, number>>(
      (acc, p) => {
        acc[p.rumahSukan] += 1;
        return acc;
      },
      { Merah: 0, Biru: 0, Hijau: 0, Kuning: 0 }
    );
  }, [participants]);

  const simpanKeLocalStorage = (data: Participant[]) => {
    setParticipants(data);
    localStorage.setItem('pendaftaran_hari_sukan', JSON.stringify(data));
  };

  const toggleAcara = (acaraDipilih: string) => {
    setForm((prev) => ({
      ...prev,
      acara: prev.acara.includes(acaraDipilih)
        ? prev.acara.filter((a) => a !== acaraDipilih)
        : [...prev.acara, acaraDipilih]
    }));
  };

  const daftarPeserta = (e: FormEvent) => {
    e.preventDefault();

    if (form.acara.length === 0) {
      setMesej('Pilih sekurang-kurangnya satu acara untuk peserta.');
      return;
    }

    const baru: Participant = {
      id: crypto.randomUUID(),
      ...form,
      masaDaftar: new Date().toLocaleString('ms-MY')
    };

    simpanKeLocalStorage([baru, ...participants]);
    setForm(emptyForm);
    setMesej(`Pendaftaran berjaya untuk ${baru.nama}.`);
  };

  const buangPeserta = (id: string) => {
    const kemaskini = participants.filter((p) => p.id !== id);
    simpanKeLocalStorage(kemaskini);
  };

  const eksportCSV = () => {
    if (participants.length === 0) {
      setMesej('Tiada data untuk dieksport.');
      return;
    }

    const headers = [
      'Nama',
      'No. Murid',
      'Kelas',
      'Rumah Sukan',
      'Acara',
      'Saiz Baju',
      'Nama Penjaga',
      'Telefon Penjaga',
      'Catatan Kesihatan',
      'Masa Daftar'
    ];

    const rows = participants.map((p) => [
      p.nama,
      p.noMurid,
      p.kelas,
      p.rumahSukan,
      p.acara.join(' | '),
      p.saizBaju,
      p.namaPenjaga,
      p.telefonPenjaga,
      p.catatanKesihatan || '-',
      p.masaDaftar
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((col) => `"${String(col).replaceAll('"', '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pendaftaran-hari-sukan.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        <header className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-2">
            <CalendarDays className="text-indigo-600" />
            <h1 className="text-2xl md:text-3xl font-black">Pendaftaran Peserta Hari Sukan Sekolah</h1>
          </div>
          <p className="text-slate-600">
            Borang ini sesuai untuk diembed dalam Google Site menggunakan pautan aplikasi Vite yang telah diterbitkan.
            Data disimpan dalam pelayar (localStorage) dan boleh dieksport sebagai CSV.
          </p>
        </header>

        <section className="grid md:grid-cols-4 gap-4">
          {(['Merah', 'Biru', 'Hijau', 'Kuning'] as RumahSukan[]).map((rumah) => (
            <article key={rumah} className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
              <p className="text-sm text-slate-500 uppercase tracking-wide">Rumah {rumah}</p>
              <p className="text-3xl font-black text-indigo-600">{jumlahIkutRumah[rumah]}</p>
            </article>
          ))}
        </section>

        <section className="grid lg:grid-cols-5 gap-6">
          <form onSubmit={daftarPeserta} className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2"><UserPlus size={20} /> Borang Peserta</h2>

            <input required className="w-full rounded-xl border border-slate-300 px-4 py-2" placeholder="Nama penuh peserta"
              value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />

            <div className="grid grid-cols-2 gap-3">
              <input required className="rounded-xl border border-slate-300 px-4 py-2" placeholder="No. murid"
                value={form.noMurid} onChange={(e) => setForm({ ...form, noMurid: e.target.value })} />
              <input required className="rounded-xl border border-slate-300 px-4 py-2" placeholder="Kelas"
                value={form.kelas} onChange={(e) => setForm({ ...form, kelas: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <select className="rounded-xl border border-slate-300 px-4 py-2" value={form.rumahSukan}
                onChange={(e) => setForm({ ...form, rumahSukan: e.target.value as RumahSukan })}>
                <option>Merah</option><option>Biru</option><option>Hijau</option><option>Kuning</option>
              </select>
              <select className="rounded-xl border border-slate-300 px-4 py-2" value={form.saizBaju}
                onChange={(e) => setForm({ ...form, saizBaju: e.target.value })}>
                <option>S</option><option>M</option><option>L</option><option>XL</option>
              </select>
            </div>

            <div>
              <p className="font-semibold mb-2">Pilih acara</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {acaraList.map((acara) => (
                  <label key={acara} className="flex items-center gap-2">
                    <input type="checkbox" checked={form.acara.includes(acara)} onChange={() => toggleAcara(acara)} />
                    {acara}
                  </label>
                ))}
              </div>
            </div>

            <input required className="w-full rounded-xl border border-slate-300 px-4 py-2" placeholder="Nama penjaga"
              value={form.namaPenjaga} onChange={(e) => setForm({ ...form, namaPenjaga: e.target.value })} />
            <input required className="w-full rounded-xl border border-slate-300 px-4 py-2" placeholder="Telefon penjaga"
              value={form.telefonPenjaga} onChange={(e) => setForm({ ...form, telefonPenjaga: e.target.value })} />

            <textarea className="w-full rounded-xl border border-slate-300 px-4 py-2" placeholder="Catatan kesihatan/alahan (jika ada)"
              value={form.catatanKesihatan} onChange={(e) => setForm({ ...form, catatanKesihatan: e.target.value })} />

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl">
              Simpan Pendaftaran
            </button>

            {mesej && <p className="text-sm text-emerald-700 font-semibold">{mesej}</p>}
          </form>

          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Senarai Pendaftaran ({participants.length})</h2>
              <button onClick={eksportCSV} className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm">
                <Download size={16} /> Eksport CSV
              </button>
            </div>

            <div className="overflow-auto max-h-[520px] border border-slate-200 rounded-xl">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 sticky top-0">
                  <tr>
                    <th className="p-3 text-left">Nama</th>
                    <th className="p-3 text-left">Kelas</th>
                    <th className="p-3 text-left">Rumah</th>
                    <th className="p-3 text-left">Acara</th>
                    <th className="p-3 text-left">Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p) => (
                    <tr key={p.id} className="border-t border-slate-200 align-top">
                      <td className="p-3">
                        <p className="font-semibold">{p.nama}</p>
                        <p className="text-xs text-slate-500">No: {p.noMurid} • {p.masaDaftar}</p>
                      </td>
                      <td className="p-3">{p.kelas}</td>
                      <td className="p-3">{p.rumahSukan}</td>
                      <td className="p-3">{p.acara.join(', ')}</td>
                      <td className="p-3">
                        <button
                          onClick={() => buangPeserta(p.id)}
                          className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={14} /> Padam
                        </button>
                      </td>
                    </tr>
                  ))}
                  {participants.length === 0 && (
                    <tr>
                      <td className="p-8 text-center text-slate-500" colSpan={5}>Belum ada peserta didaftarkan.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-slate-500 flex items-center gap-2">
              <ShieldCheck size={14} /> Tip Google Sites: guna menu <strong>Embed &gt; By URL</strong> dan tampal pautan laman ini.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
