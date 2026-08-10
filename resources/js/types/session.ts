export type SessionStatus = 'hadir' | 'absen' | 'reschedule' | 'libur' | 'akan-datang';

export interface SessionModule {
    id: number;
    name: string;
    format?: string;
    size?: string;
}

export interface SessionItem {
    id: number;
    title: string;
    date: string;
    module: string;
    status: SessionStatus;
    description?: string;
    tools?: string[];
    modules?: SessionModule[];
}
