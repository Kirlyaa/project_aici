import { PropsWithChildren } from 'react';
import { usePage } from '@inertiajs/react';

interface AdminLayoutProps {
    children?: React.ReactNode;
}

export default function AdminLayout({ children }: PropsWithChildren<AdminLayoutProps>) {
    const { auth } = usePage().props as any;

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="pb-20 md:pb-8">
                {children}
            </main>
        </div>
    );
}
