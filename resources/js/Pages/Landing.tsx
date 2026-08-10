import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Landing() {
    const [email, setEmail] = useState('');

    return (
        <div className="min-h-screen bg-white">
            <Head title="AICI - Learning Management System" />

            {/* Navigation */}
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center">
                                <i className="bi bi-robot text-white text-lg" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">AICI</span>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Fitur</a>
                            <a href="#programs" className="text-gray-600 hover:text-gray-900 font-medium">Program</a>
                            <a href="/faq" className="text-gray-600 hover:text-gray-900 font-medium">FAQ</a>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href="/login"
                                className="px-6 py-2.5 text-teal-600 font-medium hover:bg-teal-50 rounded-lg"
                            >
                                Masuk
                            </Link>
                            <Link
                                href="/register"
                                className="px-6 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700"
                            >
                                Daftar
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-teal-50 via-white to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                Membangun Generasi Siap AI Melalui Pembelajaran yang Menyenangkan
                            </h1>
                            <p className="text-xl text-gray-600 mb-8">
                                Platform pembelajaran robotika dan coding berbasis AI untuk siswa, tutor, dan administrator sekolah.
                            </p>
                            <div className="flex gap-4">
                                <Link
                                    href="/register"
                                    className="px-8 py-3.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 flex items-center gap-2"
                                >
                                    <i className="bi bi-play-fill" /> Mulai Sekarang
                                </Link>
                                <button className="px-8 py-3.5 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50">
                                    Pelajari Lebih Lanjut
                                </button>
                            </div>
                            <div className="flex items-center gap-12 mt-12">
                                <div>
                                    <p className="text-3xl font-bold text-gray-900">5+</p>
                                    <p className="text-gray-600">Tahun Pengalaman</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-gray-900">1K+</p>
                                    <p className="text-gray-600">Siswa Aktif</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-gray-900">50+</p>
                                    <p className="text-gray-600">Sekolah Mitra</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-400 rounded-3xl blur-3xl opacity-20"></div>
                            <div className="relative bg-gradient-to-br from-teal-100 to-blue-100 rounded-3xl p-12 aspect-square flex items-center justify-center">
                                <div className="text-9xl text-center">
                                    🤖
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Highlight */}
            <section className="py-12 bg-teal-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8 text-white">
                        <div>
                            <i className="bi bi-lightning-fill text-4xl mb-4 block" />
                            <h3 className="text-xl font-bold mb-2">Platform Lengkap</h3>
                            <p className="text-teal-100">Manajemen pembelajaran, nilai, dan komentar siswa dalam satu dashboard.</p>
                        </div>
                        <div>
                            <i className="bi bi-robot text-4xl mb-4 block" />
                            <h3 className="text-xl font-bold mb-2">Berbasis AI</h3>
                            <p className="text-teal-100">Rekomendasi komentar otomatis dan sistem grading cerdas untuk tutor.</p>
                        </div>
                        <div>
                            <i className="bi bi-shield-check text-4xl mb-4 block" />
                            <h3 className="text-xl font-bold mb-2">Aman & Terpercaya</h3>
                            <p className="text-teal-100">Sistem keamanan berlapis untuk melindungi data siswa dan sekolah.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Fitur Unggulan AICI</h2>
                        <p className="text-xl text-gray-600">Semua yang Anda butuhkan untuk Manajemen Pembelajaran</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 mb-16">
                        {/* Feature 1 */}
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
                            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <i className="bi bi-person-circle text-white text-2xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Dashboard Siswa</h3>
                            <p className="text-gray-600 mb-4">Akses materi pembelajaran, track progress, dan lihat nilai real-time.</p>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-center gap-2">
                                    <i className="bi bi-check-circle-fill text-green-600" /> Beranda interaktif
                                </li>
                                <li className="flex items-center gap-2">
                                    <i className="bi bi-check-circle-fill text-green-600" /> Daftar tugas
                                </li>
                                <li className="flex items-center gap-2">
                                    <i className="bi bi-check-circle-fill text-green-600" /> Profil & sertifikat
                                </li>
                            </ul>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                            <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                                <i className="bi bi-briefcase text-white text-2xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Dashboard Tutor</h3>
                            <p className="text-gray-600 mb-4">Kelola siswa, beri nilai, dan tulis komentar berkembang dengan template AI.</p>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-center gap-2">
                                    <i className="bi bi-check-circle-fill text-green-600" /> Manajemen modul
                                </li>
                                <li className="flex items-center gap-2">
                                    <i className="bi bi-check-circle-fill text-green-600" /> Input nilai & charts
                                </li>
                                <li className="flex items-center gap-2">
                                    <i className="bi bi-check-circle-fill text-green-600" /> Template komentar
                                </li>
                            </ul>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-100">
                            <div className="w-14 h-14 bg-orange-600 rounded-xl flex items-center justify-center mb-6">
                                <i className="bi bi-shield text-white text-2xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Dashboard Admin</h3>
                            <p className="text-gray-600 mb-4">Kelola tutor, siswa, dan modul pembelajaran dari satu tempat.</p>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-center gap-2">
                                    <i className="bi bi-check-circle-fill text-green-600" /> CRUD Tutor & Siswa
                                </li>
                                <li className="flex items-center gap-2">
                                    <i className="bi bi-check-circle-fill text-green-600" /> Master modul
                                </li>
                                <li className="flex items-center gap-2">
                                    <i className="bi bi-check-circle-fill text-green-600" /> Laporan lengkap
                                </li>
                            </ul>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
                            <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                                <i className="bi bi-robot text-white text-2xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Assistant</h3>
                            <p className="text-gray-600 mb-4">Chatbot cerdas untuk menjawab pertanyaan siswa dan membantu pembelajaran.</p>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-center gap-2">
                                    <i className="bi bi-check-circle-fill text-green-600" /> Chat 24/7
                                </li>
                                <li className="flex items-center gap-2">
                                    <i className="bi bi-check-circle-fill text-green-600" /> Jawab otomatis
                                </li>
                                <li className="flex items-center gap-2">
                                    <i className="bi bi-check-circle-fill text-green-600" /> Rekomendasi belajar
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Programs Section */}
            <section id="programs" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Program Pembelajaran</h2>
                        <p className="text-xl text-gray-600">Kurikulum terstruktur untuk semua tingkat kemampuan</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                            <div className="text-5xl mb-4">🦁</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Fantasy Zoo</h3>
                            <p className="text-gray-600 mb-4">Pembelajaran robotika dasar dengan tema hewan yang seru dan interaktif.</p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>✓ Dasar robotika</li>
                                <li>✓ Robot building</li>
                                <li>✓ Interaksi sosial</li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                            <div className="text-5xl mb-4">🏙️</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Future Town</h3>
                            <p className="text-gray-600 mb-4">Pembelajaran coding lanjutan tanpa robot dengan teknologi terkini.</p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>✓ Python basics</li>
                                <li>✓ Web development</li>
                                <li>✓ Problem solving</li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                            <div className="text-5xl mb-4">💻</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Advanced Coding</h3>
                            <p className="text-gray-600 mb-4">Pembelajaran coding profesional untuk siswa yang ingin lebih mendalam.</p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>✓ Full stack dev</li>
                                <li>✓ Database design</li>
                                <li>✓ Deployment</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-teal-600 to-teal-700">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">Siap Memulai?</h2>
                    <p className="text-xl text-teal-100 mb-8">Bergabunglah dengan ribuan siswa dan sekolah yang telah mempercayai AICI untuk pembelajaran robotika dan coding mereka.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/register"
                            className="px-8 py-4 bg-white text-teal-600 font-bold rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2"
                        >
                            <i className="bi bi-play-fill" /> Daftar Gratis Sekarang
                        </Link>
                        <Link
                            href="/faq"
                            className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 flex items-center justify-center gap-2"
                        >
                            <i className="bi bi-question-circle" /> Lihat FAQ
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
                                    <i className="bi bi-robot text-white" />
                                </div>
                                <span className="font-bold text-white">AICI</span>
                            </div>
                            <p className="text-sm">Platform pembelajaran robotika dan coding berbasis AI untuk masa depan.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Produk</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white">Dashboard</a></li>
                                <li><a href="#" className="hover:text-white">Fitur</a></li>
                                <li><a href="/faq" className="hover:text-white">FAQ</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Perusahaan</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white">Tentang</a></li>
                                <li><a href="#" className="hover:text-white">Blog</a></li>
                                <li><a href="#" className="hover:text-white">Kontak</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white">Privacy</a></li>
                                <li><a href="#" className="hover:text-white">Terms</a></li>
                                <li><a href="#" className="hover:text-white">Security</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center">
                        <p className="text-sm">&copy; 2025 AICI. Semua hak dilindungi.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
