interface ProgressBarProps {
    value: number;
    max?: number;
    color?: string;
    label?: string;
}

export default function ProgressBar({ value, max = 100, color = 'bg-teal-600', label }: ProgressBarProps) {
    const percentage = (value / max) * 100;

    return (
        <div className="w-full">
            {label && (
                <div className="flex justify-between text-sm mb-1">
                    <span>{label}</span>
                    <span className="font-medium">{percentage.toFixed(0)}%</span>
                </div>
            )}
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className={`${color} h-2.5 rounded-full transition-all`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
