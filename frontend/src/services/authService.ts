import { apiRequest, setToken, clearToken } from './api';
import { User, UserRole } from '../types';

export interface AuthResponseData {
  token: string;
  type: string;
  user: {
    id: string | number;
    email: string;
    name: string;
    role: string;
    title?: string;
    company?: string;
    college?: string;
    department?: string;
    year?: string;
    avatar?: string;
    phone?: string;
  };
}

export const authService = {
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await apiRequest<AuthResponseData>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    setToken(res.token);

    const user: User = {
      id: String(res.user.id),
      name: res.user.name,
      email: res.user.email,
      role: res.user.role.toLowerCase() as UserRole,
      title: res.user.title,
      company: res.user.company,
      college: res.user.college,
      department: res.user.department,
      year: res.user.year,
      avatar: res.user.avatar,
      phone: res.user.phone
    };

    return { token: res.token, user };
  },

  async registerStudent(data: {
    name: string;
    email: string;
    password?: string;
    college?: string;
    department?: string;
    year?: string;
    phone?: string;
  }): Promise<{ token: string; user: User }> {
    const res = await apiRequest<AuthResponseData>('/auth/register/student', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password || 'demoPass123!',
        college: data.college || 'Engineering College',
        department: data.department || 'Computer Science',
        year: data.year || 'Final Year (2026)',
        phone: data.phone
      })
    });

    setToken(res.token);

    const user: User = {
      id: String(res.user.id),
      name: res.user.name,
      email: res.user.email,
      role: 'student',
      college: res.user.college || data.college,
      department: res.user.department || data.department,
      year: res.user.year || data.year,
      avatar: res.user.avatar,
      phone: res.user.phone
    };

    return { token: res.token, user };
  },

  async registerMentor(data: {
    name: string;
    email: string;
    password?: string;
    title: string;
    company: string;
    experienceYears: number;
    skills: string[];
    hourlyRateInr: number;
  }): Promise<{ token: string; user: User }> {
    const res = await apiRequest<AuthResponseData>('/auth/register/mentor', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password || 'demoPass123!',
        title: data.title,
        company: data.company,
        experienceYears: data.experienceYears,
        skills: data.skills,
        hourlyRateInr: data.hourlyRateInr
      })
    });

    setToken(res.token);

    const user: User = {
      id: String(res.user.id),
      name: res.user.name,
      email: res.user.email,
      role: 'mentor',
      title: data.title,
      company: data.company,
      avatar: res.user.avatar
    };

    return { token: res.token, user };
  },

  async getMe(): Promise<User> {
    const res = await apiRequest<any>('/auth/me');
    return {
      id: String(res.id),
      name: res.name,
      email: res.email,
      role: res.role.toLowerCase() as UserRole,
      title: res.title,
      company: res.company,
      college: res.college,
      department: res.department,
      year: res.year,
      avatar: res.avatar,
      phone: res.phone
    };
  },

  logout(): void {
    clearToken();
  }
};
