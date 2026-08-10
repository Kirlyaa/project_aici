interface BadgeProps {
    status: 'hadir' | 'absen' | 'reschedule' | 'libur' | 'akan-datang';
    children: React.ReactNode;
}

export default function Badge({ status, children }: BadgeProps) {
    const colors = {
        hadir: 'bg-green-100 text-green-700',
        absen: 'bg-red-100 text-red-700',
        reschedule: 'bg-yellow-100 text-yellow-700',
        libur: 'bg-orange-100 text-orange-700',
        'akan-datang': 'bg-blue-100 text-blue-700',
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status]}`}>
            {children}
        </span>
    );
}
