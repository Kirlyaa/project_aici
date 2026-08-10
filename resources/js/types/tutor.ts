export interface GradeValue {
    fokus: number;
    robotBuilding?: number; // Only for 5-value modules
    toolsManagement: number;
    interaksi: number;
    coding: number;
}

export interface ModuleGrade {
    moduleId: number;
    moduleName: string;
    moduleType: 'type4' | 'type5'; // type4: fokus, tools, interaksi, coding | type5: fokus, robot, tools, interaksi, coding
    values: GradeValue;
    average: number;
}

export interface StudentComment {
    studentId: number;
    studentName: string;
    semester: string;
    systemComment?: string;
    tutorComment?: string;
    lastUpdated?: string;
}

export interface TutorStudent {
    id: number;
    name: string;
    email: string;
    moduleGrades: ModuleGrade[];
    yearAverage: number;
    calendarEvents: CalendarEvent[];
    comments: StudentComment[];
}

export interface CalendarEvent {
    date: string;
    status: 'hadir' | 'absen' | 'reschedule' | 'libur' | 'akan-datang';
    notes?: string;
}

export interface Tutor {
    id: number;
    name: string;
    email: string;
    status: 'aktif' | 'nonaktif';
    students: TutorStudent[];
}

export interface SuperAdmin {
    id: number;
    name: string;
    email: string;
    status: 'aktif' | 'nonaktif';
}
