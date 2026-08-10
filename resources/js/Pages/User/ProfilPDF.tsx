import { Head } from '@inertiajs/react';
import Card from '@/Components/UI/Card';
import ProgressBar from '@/Components/UI/ProgressBar';

export default function ProfilPDF() {
    return (
        <>
            <Head title="Profil - Faris Sukirman" />
            
            <div className="bg-white min-h-screen p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header Card */}
                    <Card className="p-6 mb-6 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
                        <p className="text-teal-100 text-sm mb-1">Peserta Program</p>
                        <h1 className="text-3xl font-bold mb-1">Faris Sukirman</h1>
                        <p className="text-teal-100 mb-4">Kelas Robotika • Periode 2025</p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                                Age: Anak-anak (2025)
                            </span>
                            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                                <i className="bi bi-trophy-fill"></i> Level 2
                            </span>
                            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                                <i className="bi bi-check-circle-fill"></i> 11 Sesi Total
                            </span>
                        </div>
                    </Card>

                    {/* Statistics Grid */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <Card className="p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <i className="bi bi-calendar-check text-teal-600"></i>
                                Statistik Kehadiran
                            </h2>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-3xl font-bold text-green-600">8</div>
                                    <div className="text-sm text-gray-600">Hadir</div>
                                </div>
                                <div className="text-center p-4 bg-red-50 rounded-lg">
                                    <div className="text-3xl font-bold text-red-600">2</div>
                                    <div className="text-sm text-gray-600">Absen</div>
                                </div>
                                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                    <div className="text-3xl font-bold text-yellow-600">1</div>
                                    <div className="text-sm text-gray-600">Reschedule</div>
                                </div>
                            </div>
                            <ProgressBar value={73} label="Tingkat Kehadiran" color="bg-green-600" />
                            <p className="text-sm text-gray-500 mt-2">72.7% (8 dari 11 sesi)</p>
                        </Card>

                        <Card className="p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <i className="bi bi-bar-chart-fill text-teal-600"></i>
                                Breakdown Nilai
                            </h2>
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

                    {/* Chart Section */}
                    <Card className="p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <i className="bi bi-graph-up text-teal-600"></i>
                            Grafik Perkembangan
                        </h2>
                        <div className="mb-4 space-y-2">
                            <div className="flex gap-2 text-sm">
                                <span className="font-medium">Interaksi</span>
                                <span className="text-gray-500">Fokus</span>
                                <span className="text-gray-500">Robot Build</span>
                                <span className="text-gray-500">Tools Mgmt</span>
                                <span className="text-gray-500">Coding</span>
                            </div>
                        </div>
                        <div className="h-48 bg-gray-50 rounded-lg flex items-end justify-around p-4">
                            <div className="text-center">
                                <div className="w-16 bg-teal-600 rounded-t" style={{height: '140px'}}></div>
                                <span className="text-xs mt-1 block">Interaksi</span>
                            </div>
                            <div className="text-center">
                                <div className="w-16 bg-blue-600 rounded-t" style={{height: '120px'}}></div>
                                <span className="text-xs mt-1 block">Fokus</span>
                            </div>
                            <div className="text-center">
                                <div className="w-16 bg-green-600 rounded-t" style={{height: '130px'}}></div>
                                <span className="text-xs mt-1 block">Robot Build</span>
                            </div>
                            <div className="text-center">
                                <div className="w-16 bg-orange-600 rounded-t" style={{height: '110px'}}></div>
                                <span className="text-xs mt-1 block">Tools Mgmt</span>
                            </div>
                            <div className="text-center">
                                <div className="w-16 bg-red-600 rounded-t" style={{height: '125px'}}></div>
                                <span className="text-xs mt-1 block">Coding</span>
                            </div>
                        </div>
                    </Card>

                    {/* Session History */}
                    <Card className="p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <i className="bi bi-clock-history text-teal-600"></i>
                            Riwayat Sesi
                        </h2>
                        <div className="space-y-2">
                            {[
                                { title: 'Sesi April', date: '5 Apr, 2025', status: 'hadir' },
                                { title: 'Sesi Mei 1', date: '10 Mei 2025', status: 'hadir' },
                                { title: 'Sesi Mei 2', date: '17 Mei 2025', status: 'absen' },
                                { title: 'Intro Lanjutan', date: '7 Jun 2025', status: 'hadir' },
                            ].map((session, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 border-b">
                                    <div className="flex items-center gap-3">
                                        <i className={`bi ${session.status === 'hadir' ? 'bi-check-circle-fill text-green-500' : 'bi-x-circle-fill text-red-500'}`}></i>
                                        <div>
                                            <h3 className="font-bold text-sm">{session.title}</h3>
                                            <p className="text-xs text-gray-600">{session.date}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* System Comments */}
                    <Card className="p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <i className="bi bi-info-circle-fill text-teal-600"></i>
                            Komentar Sistem
                        </h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                                <div className="flex items-start gap-3">
                                    <i className="bi bi-check-circle-fill text-green-600 text-xl"></i>
                                    <div>
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
                                    <i className="bi bi-exclamation-triangle-fill text-yellow-600 text-xl"></i>
                                    <div>
                                        <p className="font-medium mb-1">Catatan</p>
                                        <p className="text-sm text-gray-700">
                                            Anak bisa lebih fokus ke course nya semisal buku kecil atau peralatan bisa di set teratur 
                                            supaya gak dimainin pas sesi.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Tutor Notes */}
                    <Card className="p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <i className="bi bi-person-fill text-teal-600"></i>
                            Catatan Tutor
                        </h2>
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <i className="bi bi-person-fill text-white"></i>
                            </div>
                            <div>
                                <p className="font-medium">User Reza</p>
                                <p className="text-sm text-gray-500 mb-2">+62 9298</p>
                                <p className="text-gray-700 italic text-sm">
                                    "FCU actually aaahh satu sesi nya yang dimanaaa?? Masyaa Allah TTS sesinya ada di zoom class 2 bwahni TTS 
                                    Terasa senaaang!! Terasa senaaang!"
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Footer */}
                    <div className="text-center text-sm text-gray-500 mt-8 pb-8">
                        <p>Catatan ini dibuat pada 04 Juli 2025 oleh sistem AICI</p>
                        <p className="mt-1">Artificial Intelligence Center Indonesia</p>
                    </div>
                </div>
            </div>
        </>
    );
}
