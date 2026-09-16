import React from 'react';
import { LockInfo } from '@/Hooks/useStudentLock';

interface StudentLockBannerProps {
    lock: LockInfo | null;
    studentName?: string;
    onDismiss?: () => void;
}

export default function StudentLockBanner({ lock, studentName = 'murid ini', onDismiss }: StudentLockBannerProps) {
    if (!lock || !lock.locked || !lock.by) {
        return null;
    }

    const pageLabels: Record<string, string> = {
        calendar: 'Kalender / Jadwal',
        grades: 'Input Nilai',
        comments: 'Komentar',
        view: 'halaman murid',
    };

    const targetPage = pageLabels[lock.by.page] || lock.by.page;

    return (
        <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900 shadow-sm animate-pulse">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-200 flex items-center justify-center flex-shrink-0">
                    <i className="bi bi-lock-fill text-amber-700 text-xl" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h4 className="font-bold text-base text-amber-900">
                            Murid Sedang Dibuka oleh Tutor Lain
                        </h4>
                        {onDismiss && (
                            <button
                                type="button"
                                onClick={onDismiss}
                                className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                            >
                                <i className="bi bi-x-lg" />
                            </button>
                        )}
                    </div>
                    <p className="text-sm text-amber-800 mt-1">
                        <strong>{studentName}</strong> saat ini sedang diakses oleh{' '}
                        <span className="font-semibold text-amber-950 underline">{lock.by.tutorName}</span> pada bagian{' '}
                        <span className="font-semibold">{targetPage}</span>.
                    </p>
                    <p className="text-xs text-amber-700 mt-2 flex items-center gap-1.5">
                        <i className="bi bi-info-circle-fill" />
                        Untuk menghindari bentrok data, silakan tunggu beberapa saat atau koordinasi dengan tutor bersangkutan.
                    </p>
                </div>
            </div>
        </div>
    );
}
