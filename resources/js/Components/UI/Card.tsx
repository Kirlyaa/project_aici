import { PropsWithChildren } from 'react';

interface CardProps {
    className?: string;
}

export default function Card({ className = '', children }: PropsWithChildren<CardProps>) {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
            {children}
        </div>
    );
}
