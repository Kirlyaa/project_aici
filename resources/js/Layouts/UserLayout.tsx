import { PropsWithChildren } from 'react';
import UserNavbar from '@/Components/UserNavbar';
import MobileNavbar from '@/Components/MobileNavbar';
import FlashToast from '@/Components/FlashToast';
import { usePage } from '@inertiajs/react';

interface UserLayoutProps {
    currentPage?: 'home' | 'tugas' | 'profil' | 'jadwal' | 'notifications';
}

export default function UserLayout({ currentPage, children }: PropsWithChildren<UserLayoutProps>) {
    const { auth } = usePage().props as any;

    return (
        <div className="min-h-screen bg-gray-50">
            <FlashToast />
            <UserNavbar userName={auth?.user?.name || 'User'} />
            <main className="pb-20 md:pb-8">
                {children}
            </main>
            <MobileNavbar currentPage={currentPage} />
        </div>
    );
}
