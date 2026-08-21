import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';

interface FlashProps {
    success?: string;
    error?: string;
}

export default function FlashToast() {
    const { flash } = usePage<PageProps & { flash: FlashProps }>().props;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setMessage({ type: 'success', text: flash.success });
            setVisible(true);
        } else if (flash?.error) {
            setMessage({ type: 'error', text: flash.error });
            setVisible(true);
        }
        const timer = setTimeout(() => setVisible(false), 5000);
        return () => clearTimeout(timer);
    }, [flash?.success, flash?.error]);

    if (!visible || !message) return null;

    const bg = message.type === 'success'
        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
        : 'bg-red-50 border-red-200 text-red-800';
    const icon = message.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill';
    const iconColor = message.type === 'success' ? 'text-emerald-500' : 'text-red-500';

    return (
        <div className="fixed top-4 right-4 z-[100] animate-[fadeIn_.2s_ease-out]">
            <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm ${bg}`}>
                <i className={`bi ${icon} text-lg ${iconColor} shrink-0 mt-0.5`} />
                <div className="flex-1 text-sm font-medium leading-relaxed">{message.text}</div>
                <button
                    type="button"
                    onClick={() => setVisible(false)}
                    className="opacity-60 hover:opacity-100 transition-opacity shrink-0 ml-1"
                >
                    <i className="bi bi-x-lg" />
                </button>
            </div>
        </div>
    );
}
