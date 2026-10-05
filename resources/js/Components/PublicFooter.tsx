import { Link } from '@inertiajs/react';

export default function PublicFooter() {
    return (
        <footer className="bg-[#0B6282] text-slate-100 pt-16 pb-10 border-t border-[#08455c] font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/15">
                    {/* Col 1: Institutional Identity */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-1.5 px-2.5 rounded-xl shadow-sm border border-slate-100">
                                <img
                                    src="/images/logo-aici.png"
                                    alt="AiCI Logo"
                                    className="h-8 w-auto object-contain"
                                />
                            </div>
                            <div>
                                <div className="text-base font-extrabold text-white tracking-tight leading-none">
                                    AiCI FMIPA UI
                                </div>
                                <div className="text-[10px] text-cyan-200 tracking-wider uppercase mt-1 font-medium">
                                    AI Center Indonesia
                                </div>
                            </div>
                        </div>

                        <p className="text-xs text-slate-100/90 leading-relaxed max-w-sm">
                            Pusat unggulan pengembangan sumber daya manusia, riset terapan robotika humanoid, dan literasi kecerdasan artifisial nasional hasil kemitraan strategis FMIPA Universitas Indonesia bersama UMG IdeaLab Indonesia.
                        </p>

                        <div className="pt-1 text-[11px] space-y-1.5 text-slate-100/90">
                            <div className="flex items-start gap-2">
                                <i className="bi bi-geo-alt text-cyan-300 mt-0.5 shrink-0"></i>
                                <span>Gedung Lab. Riset Multidisiplin Pertamina FMIPA UI Lt. 4, Kampus UI Depok 16424</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="bi bi-envelope text-cyan-300 shrink-0"></i>
                                <a href="mailto:aici@sci.ui.ac.id" className="hover:text-white transition-colors">aici@sci.ui.ac.id</a>
                            </div>
                        </div>
                    </div>

                    {/* Col 2: Navigasi Cepat */}
                    <div className="lg:col-span-3 space-y-3">
                        <div className="text-xs font-bold tracking-wider uppercase text-cyan-200">
                            Navigasi
                        </div>
                        <ul className="space-y-2 text-xs text-slate-100/90">
                            <li><Link href="/landing" className="hover:text-white transition-colors flex items-center gap-2"><i className="bi bi-chevron-right text-[10px] text-cyan-300"></i> Beranda Utama</Link></li>
                            <li><Link href="/program" className="hover:text-white transition-colors flex items-center gap-2"><i className="bi bi-chevron-right text-[10px] text-cyan-300"></i> Program Pelatihan & Kurikulum</Link></li>
                            <li><Link href="/profil" className="hover:text-white transition-colors flex items-center gap-2"><i className="bi bi-chevron-right text-[10px] text-cyan-300"></i> Profil & Visi Misi Lembaga</Link></li>
                            <li><Link href="/fasilitas" className="hover:text-white transition-colors flex items-center gap-2"><i className="bi bi-chevron-right text-[10px] text-cyan-300"></i> 6 Ruang Laboratorium AI</Link></li>
                            <li><Link href="/galeri" className="hover:text-white transition-colors flex items-center gap-2"><i className="bi bi-chevron-right text-[10px] text-cyan-300"></i> Galeri Dokumentasi Aktivitas</Link></li>
                            <li><Link href="/riset" className="hover:text-white transition-colors flex items-center gap-2"><i className="bi bi-chevron-right text-[10px] text-cyan-300"></i> Publikasi & Prototipe Riset</Link></li>
                            <li><Link href="/kontak" className="hover:text-white transition-colors flex items-center gap-2"><i className="bi bi-chevron-right text-[10px] text-cyan-300"></i> Layanan Konsultasi & Lokasi</Link></li>
                        </ul>
                    </div>

                    {/* Col 3: Pilar Riset & Program */}
                    <div className="lg:col-span-3 space-y-3">
                        <div className="text-xs font-bold tracking-wider uppercase text-cyan-200">
                            Fokus Utama
                        </div>
                        <ul className="space-y-2 text-xs text-slate-100/90">
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-300"></span> Humanoid & Service Robotics</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-300"></span> Computer Vision & Real-time AI</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-300"></span> AI Literacy & STEAM (K-12)</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-300"></span> AI For Teachers & Lecturers</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-300"></span> Magang & Studi Independen (MSIB)</li>
                        </ul>
                    </div>

                    {/* Col 4: Layanan Informasi & Jam Kerja */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="text-xs font-bold tracking-wider uppercase text-cyan-200">
                            Jam Operasional
                        </div>
                        <div className="bg-[#08455c] border border-cyan-400/20 rounded-xl p-3 text-[11px] space-y-1">
                            <div className="font-semibold text-white">Senin - Jumat</div>
                            <div className="text-slate-200 font-semibold">08:00 - 17:00 WIB</div>
                            <div className="pt-1 text-[10px] text-cyan-200">Sabtu & Minggu Tutup (kecuali jadwal workshop khusus)</div>
                        </div>

                        <div>
                            <Link
                                href="/kontak"
                                className="block w-full text-center py-2.5 px-3 rounded-full bg-[#E62C29] hover:bg-[#d02522] text-white text-xs font-bold transition-all shadow-md shadow-red-950/20"
                            >
                                Konsultasi & Kemitraan
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Copyright & Credit */}
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-cyan-100/80 gap-3">
                    <div>
                        © {new Date().getFullYear()} Artificial Intelligence Center Indonesia (AiCI). FMIPA Universitas Indonesia.
                    </div>
                    <div className="flex items-center gap-4 text-cyan-100/80">
                        <span>Pusat Riset Sains Terapan & Inovasi AI</span>
                        <span>•</span>
                        <Link href="/kontak" className="hover:text-white transition-colors">Bantuan</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
