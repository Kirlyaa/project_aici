import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import Card from '@/Components/UI/Card';
import ProgressBar from '@/Components/UI/ProgressBar';
import Button from '@/Components/UI/Button';
import { sessions } from '@/data/sessions';

export default function Profil() {
    return (
        <UserLayout currentPage="profil">
            <Head title="Profil" />
            
            <div className="max-w-7xl mx-auto px-4 py-6">
                <Card className="p-6 mb-6 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-teal-100 text-sm">Peserta Program</p>
                            <h1 className="text-3xl font-bold">Faris Sukirman</h1>
                            <p className="text-teal-100">Kelas Robotika • Periode 2025</p>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                            <span className="font-medium">Age:</span> Anak-anak (2025)
                        </span>
                        <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                            <span className="font-medium">Level 2</span>
                        </span>
                        <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                            7 Sesi Selesai
                        </span>
                        <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                            78.8% Rata-rata
                        </span>
                    </div>
                </Card>

                <div className="grid md:grid-cols-2 gap-6 mb-6">

                    <Card className="p-6">
                        <h2 className="text-xl font-bold mb-4">Statistik Kehadiran</h2>
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600">8</div>
                                <div className="text-sm text-gray-600">Hadir</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-red-600">2</div>
                                <div className="text-sm text-gray-600">Absen</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-yellow-600">1</div>
                                <div className="text-sm text-gray-600">Reschedule</div>
                            </div>
                        </div>
                        <ProgressBar value={73} label="Tingkat Kehadiran" color="bg-green-600" />
                        <p className="text-sm text-gray-500 mt-2">72.7% (8 dari 11 sesi)</p>
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-xl font-bold mb-4">Breakdown Nilai</h2>
                        <div className="space-y-3">
                            <ProgressBar value={88} label="Interaksi" color="bg-teal-600" />
                            <ProgressBar value={75} label="Fokus" color="bg-blue-600" />
                            <ProgressBar value={82} label="Robot Building" color="bg-green-600" />
                            <ProgressBar value={70} label="Tools Mgmt" color="bg-orange-600" />
                            <ProgressBar value={79} label="Coding" color="bg-red-600" />
                        </div>
                        <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Rata-rata</span>
                                <span className="text-2xl font-bold text-teal-600">78.8%</span>
                            </div>
                        </div>
                    </Card>
                </div>

                <h2 className="text-xl font-bold mb-4">Grafik Perkembangan</h2>
                <Card className="p-6 mb-6">
                    <div className="flex gap-4 mb-4">
                        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium">
                            Robot Building
                        </button>
                        <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                            Focus & Tools
                        </button>
                    </div>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                        <p className="text-gray-400">Chart placeholder</p>
                    </div>
                </Card>

                <h2 className="text-xl font-bold mb-4">Riwayat Sesi</h2>
                <div className="space-y-3 mb-6">
                    {sessions.slice(0, 5).map((session) => (
                        <Link key={session.id} href={`/tugas/${session.id}`}>
                            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${
                                            session.status === 'hadir' ? 'bg-green-500' : 
                                            session.status === 'absen' ? 'bg-red-500' :
                                            session.status === 'reschedule' ? 'bg-yellow-500' :
                                            'bg-blue-500'
                                        }`}/>
                                        <div>
                                            <h3 className="font-bold">{session.title}</h3>
                                            <p className="text-sm text-gray-600">{session.date}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                                        session.status === 'hadir' ? 'bg-green-100 text-green-700' : 
                                        session.status === 'absen' ? 'bg-red-100 text-red-700' :
                                        session.status === 'reschedule' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>
                                        <i className={`bi ${
                                            session.status === 'hadir' ? 'bi-check-circle-fill' :
                                            session.status === 'absen' ? 'bi-x-circle-fill' :
                                            session.status === 'reschedule' ? 'bi-arrow-repeat' :
                                            'bi-calendar-event-fill'
                                        }`} />
                                        {session.status === 'hadir' ? 'Hadir' : 
                                         session.status === 'absen' ? 'Absen' :
                                         session.status === 'reschedule' ? 'Reschedule' :
                                         'Akan Datang'}
                                    </span>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>

                <h2 className="text-xl font-bold mb-4">Komentar Sistem</h2>
                <Card className="p-6 mb-6">
                    <div className="space-y-4">
                        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold">K</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium mb-1">Kondisi Umum</p>
                                    <p className="text-sm text-gray-700">
                                        Selamat Faris! Kamu sudah pindah ke sesi aktif kelas robotika! Yuk siapkan diri dengan 
                                        membaca materi robotik nya. Harap siapkan kit, software block coding dan kabel USB.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold">⚠</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium mb-1">Catatan</p>
                                    <p className="text-sm text-gray-700">
                                        Anak bisa lebih fokus ke course nya semisal buku kecil, buku catatan kecil, atau peralatan 
                                        bisa di set teratur supaya gak dimainin pas sesi. Kalau ada time limit session bisa Faris 
                                        boleh di boost sesuai kerelaannya supaya learning experience nya lebih bertambah.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <h2 className="text-xl font-bold mb-4">Catatan Tutor</h2>
                <Card className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold">U</span>
                        </div>
                        <div>
                            <p className="font-medium">User Reza</p>
                            <p className="text-sm text-gray-500">+62 9298</p>
                        </div>
                    </div>
                    <p className="text-gray-700 italic">
                        "FCU actually aaahh satu sesi nya yang dimanaaa?? Masyaa Allah TTS sesinya ada di zoom class 2 bwahni TTS 
                        Terasa senaaang!! Terasa senaaang!"
                    </p>
                </Card>

                <div className="mt-6 text-center">
                    <a href="/profil/pdf" target="_blank">
                        <Button variant="primary" size="lg" className="w-full md:w-auto">
                            <i className="bi bi-file-pdf mr-2"></i>
                            Cetak / Simpan PDF
                        </Button>
                    </a>
                </div>
            </div>
        </UserLayout>
    );
}
