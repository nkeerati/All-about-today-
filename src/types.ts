export interface UserProfile {
  name: string;
  age: number;
  gender: string;
  hasCongenitalDisease: boolean;
  congenitalDiseaseDetails: string;
  weight?: number;
  height?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'doctor';
  text: string;
  timestamp: Date;
}

export interface Caregiver {
  id: string;
  name: string;
  role: string;
  experience: string;
  phone: string;
  distance: string;
  avatar: string;
  latitude: number;
  longitude: number;
  status: 'online' | 'offline';
}

export interface ScreeningAnswer {
  q1: boolean; // คลื่นไส้ อาเจียน เวียนหัว
  q2: boolean; // กระหายน้ำมาก
  q3: boolean; // ชีพจรเร็ว หายใจเร็ว
  q4: boolean; // วิงเวียน หน้ามืด เป็นลม
}

export type ViewType = 'home' | 'knowledge' | 'screening' | 'doctor' | 'caregivers' | 'prevention' | 'settings' | 'notifications';
