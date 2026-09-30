interface BadgeProps {
    status: 'hadir' | 'absen' | 'libur' | 'akan-datang';
    children: React.ReactNode;
}

export default function Badge({ status, children }: BadgeProps) {
    const colors = {
        hadir: 'bg-blue-100 text-blue-700',
        absen: 'bg-amber-100 text-amber-800',
        libur: 'bg-red-100 text-red-700',
        'akan-datang': 'bg-purple-100 text-purple-700',
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status]}`}>
            {children}
        </span>
    );
}
