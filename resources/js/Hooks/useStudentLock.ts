import { useEffect, useRef, useState, useCallback } from 'react';
import { router } from '@inertiajs/react';

export interface LockInfo {
    locked: boolean;
    readOnly: boolean;
    by: {
        tutorId: number;
        tutorName: string;
        page: string;
        since: number;
    } | null;
}

interface UseStudentLockOptions {
    studentId: number;
    page: string; // 'calendar' | 'grades' | 'comments'
    onLocked?: (info: LockInfo) => void;
    onReleased?: () => void;
    onTakenOver?: () => void;
}

/**
 * Hook untuk mengelola lock murid agar tidak bentrok antar tutor.
 *
 * - Saat mount: cek status lock → jika sudah dipakai tutor lain, tampilkan notif.
 * - Setiap 2 menit: heartbeat untuk memperpanjang lock.
 * - Saat unmount: release lock.
 */
export function useStudentLock({ studentId, page, onLocked, onReleased, onTakenOver }: UseStudentLockOptions) {
    const [lockInfo, setLockInfo] = useState<LockInfo | null>(null);
    const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const mountedRef = useRef(true);

    const fetchStatus = useCallback(async () => {
        try {
            const res = await fetch(`/tutor/lock/${studentId}?page=${page}`, {
                headers: { 'Accept': 'application/json' },
            });
            if (!res.ok) return null;
            const data = await res.json();
            return data.lock as LockInfo;
        } catch {
            return null;
        }
    }, [studentId, page]);

    const sendHeartbeat = useCallback(async () => {
        try {
            await fetch(`/tutor/lock/${studentId}/heartbeat`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
            });
        } catch { /* silent */ }
    }, [studentId]);

    const sendRelease = useCallback(async () => {
        try {
            await fetch(`/tutor/lock/${studentId}/release`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
            });
        } catch { /* silent */ }
    }, [studentId]);

    useEffect(() => {
        mountedRef.current = true;

        (async () => {
            const lock = await fetchStatus();
            if (!mountedRef.current) return;

            setLockInfo(lock);

            if (lock?.locked) {
                onLocked?.(lock);
            } else {
                onReleased?.();
            }
        })();

        // Heartbeat setiap 2 menit
        heartbeatRef.current = setInterval(() => {
            sendHeartbeat();
        }, 120_000);

        // Release saat navigasi Inertia
        const removeListener = router.on('navigate', () => {
            sendRelease();
        });

        return () => {
            mountedRef.current = false;
            if (heartbeatRef.current) clearInterval(heartbeatRef.current);
            removeListener();
            sendRelease();
        };
    }, [studentId, page]);

    return {
        lock: lockInfo,
        release: sendRelease,
        refresh: async () => {
            const l = await fetchStatus();
            if (mountedRef.current) setLockInfo(l);
            return l;
        },
    };
}
