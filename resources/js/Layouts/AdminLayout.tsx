import { PropsWithChildren } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

interface AdminLayoutProps {
    children?: React.ReactNode;
}

interface AuthUser {
    name?: string;
    role?: string;
    avatar?: string | null;
    avatar_url?: string | null;
}

const navigation = [
    { label: 'Ringkasan', href: '/superadmin', icon: 'bi-grid-1x2' },
    { label: 'Tutor', href: '/superadmin/tutors', icon: 'bi-person-workspace' },
    { label: 'Siswa', href: '/superadmin/students', icon: 'bi-mortarboard' },
    { label: 'Kelas', href: '/superadmin/classes', icon: 'bi-people' },
    { label: 'Kalender', href: '/superadmin/calendar', icon: 'bi-calendar3' },
    { label: 'Modul', href: '/superadmin/modules', icon: 'bi-journal-bookmark' },
    { label: 'Periode rapor', href: '/superadmin/report-periods', icon: 'bi-file-earmark-bar-graph' },
    { label: 'Pengumuman', href: '/superadmin/holiday-announcement', icon: 'bi-megaphone' },
];

export default function AdminLayout({ children }: PropsWithChildren<AdminLayoutProps>) {
    const { auth } = usePage().props as { auth?: { user?: AuthUser } };
    const currentUrl = usePage().url.split('?')[0];
    const user = auth?.user;

    // Tutor routes are also available to superadmins. Keep their existing interface unchanged for tutors.
    if (user?.role !== 'superadmin') {
        return <>{children}</>;
    }

    const avatarUrl = user.avatar_url || user.avatar
        || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'Super Admin')}&background=0B6282&color=fff&size=200`;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
                <div className="mx-auto flex h-[4.5rem] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    <Link href="/superadmin" className="flex min-w-0 items-center gap-3" aria-label="AICI Super Admin, ke ringkasan">
                        <img src="/images/logo-aici.png" alt="AICI" className="h-10 w-auto max-w-[130px] object-contain" />
                        <span className="hidden h-8 w-px bg-slate-200 sm:block" />
                        <span className="hidden rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-rose-700 sm:inline-flex">
                            Super Admin
                        </span>
                    </Link>

                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                        <span className="hidden text-right sm:block">
                            <span className="block text-[11px] font-medium uppercase tracking-[0.1em] text-slate-400">Administrator</span>
                            <span className="block max-w-44 truncate text-sm font-semibold text-slate-700">{user.name || 'Super Admin'}</span>
                        </span>
                        <img
                            src={avatarUrl}
                            alt={user.name || 'Super Admin'}
                            className="h-9 w-9 rounded-full border border-slate-200 object-cover"
                            onError={(event) => {
                                event.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'Super Admin')}&background=0B6282&color=fff&size=200`;
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => router.post('/logout', {}, { onSuccess: () => window.location.reload() })}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-[#0B6282] focus:ring-offset-2"
                            title="Keluar"
                            aria-label="Keluar"
                        >
                            <i className="bi bi-box-arrow-right text-lg" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                <nav aria-label="Navigasi Super Admin" className="border-t border-slate-100">
                    <div
                        tabIndex={0}
                        aria-label="Menu Super Admin. Geser secara horizontal pada layar kecil."
                        className="mx-auto flex max-w-[1440px] gap-1 overflow-x-auto px-3 py-2 pr-20 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0B6282] sm:px-6 sm:pr-20 lg:pr-6 lg:px-8"
                    >
                        {navigation.map((item) => {
                            const active = item.href === '/superadmin'
                                ? currentUrl === item.href
                                : currentUrl === item.href || currentUrl.startsWith(`${item.href}/`);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={active ? 'page' : undefined}
                                    className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                                        active
                                            ? 'bg-[#0B6282] text-white shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                                >
                                    <i className={`bi ${item.icon}`} aria-hidden="true" />
                                    {item.label}
                                </Link>
                            );
                        })}
                        {currentUrl.startsWith('/tutor') && (
                            <Link
                                href="/tutor"
                                aria-current="page"
                                className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#0B6282] px-3 py-2 text-sm font-semibold text-white shadow-sm"
                            >
                                <i className="bi bi-easel" aria-hidden="true" />
                                Ruang Tutor
                            </Link>
                        )}
                    </div>
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute right-0 top-[4.5rem] flex h-[2.75rem] items-center gap-1 bg-gradient-to-l from-white via-white/95 to-transparent pl-5 pr-2 text-xs font-semibold text-slate-500 lg:hidden"
                    >
                        Geser <i className="bi bi-chevron-right text-[10px]" />
                    </span>
                </nav>
            </header>

            <main className="admin-layout-content pb-8">
                {children}
            </main>

            <style>{`
                .admin-layout-content > div > nav {
                    position: static !important;
                    height: auto !important;
                    border-color: transparent !important;
                    background: transparent !important;
                    box-shadow: none !important;
                }

                .admin-layout-content > div > nav > div > div {
                    height: auto !important;
                    min-height: 0 !important;
                    padding-top: .5rem;
                    padding-bottom: .5rem;
                }

                .admin-layout-content > div > nav img[src*="logo-aici"] {
                    display: none !important;
                }

                .admin-layout-content > div > nav a:has(img[src*="logo-aici"]) {
                    display: none !important;
                }

                .admin-layout-content > div > nav span.bg-red-100.text-red-700 {
                    display: none !important;
                }

                .admin-layout-content > div > nav div:has(> span.bg-red-100.text-red-700) {
                    display: none !important;
                }
            `}</style>
        </div>
    );
}
