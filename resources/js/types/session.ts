export type SessionStatus = 'hadir' | 'absen' | 'libur' | 'akan-datang';

export interface SessionModule {
    id: number;
    name: string;
    description?: string | null;
    format?: string;
    size?: string;
}

export interface SessionTutor {
    id: number;
    name: string;
    email?: string;
    avatar?: string | null;
}

export interface SessionClassroom {
    id: number;
    name: string;
}

export interface SessionItem {
    id: number;
    title: string;
    date: string;
    date_string?: string;
    module: string;
    status: SessionStatus;
    description?: string;
    tools?: string[];
    modules?: SessionModule[];
    tutor?: SessionTutor | null;
    classroom?: SessionClassroom | null;
}
