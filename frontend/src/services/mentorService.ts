import { apiRequest } from './api';
import { Mentor, MentorPackage } from '../types';

export interface MentorFilters {
  q?: string;
  skill?: string;
  company?: string;
  sortBy?: string;
}

export const mentorService = {
  async getMentors(filters: MentorFilters = {}): Promise<Mentor[]> {
    const params = new URLSearchParams();
    if (filters.q) params.append('q', filters.q);
    if (filters.skill && filters.skill !== 'all') params.append('skill', filters.skill);
    if (filters.company && filters.company !== 'all') params.append('company', filters.company);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    const query = params.toString() ? `?${params.toString()}` : '';
    const data = await apiRequest<any[]>(`/mentors${query}`);

    return data.map((m) => ({
      id: String(m.id),
      name: m.name,
      title: m.title || '',
      company: m.company || '',
      experienceYears: m.experienceYears || 0,
      rating: m.rating || 5.0,
      reviewCount: m.reviewCount || 0,
      hourlyRateInr: m.hourlyRateInr || 1999,
      avatar: m.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(m.name)}`,
      bio: m.bio || '',
      about: m.about || '',
      skills: m.skills || [],
      languages: m.languages || ['English'],
      nextAvailableSlot: m.nextAvailableSlot || 'Tomorrow, 7:00 PM',
      packages: (m.packages || []).map((p: any) => ({
        id: String(p.id),
        mentorId: String(p.mentorId || m.id),
        title: p.title,
        description: p.description,
        durationMinutes: p.durationMinutes,
        priceInr: p.priceInr || p.priceINR || 0,
        priceINR: p.priceINR || p.priceInr || 0,
        sessionsCount: p.sessionsCount || 1,
        topics: p.topics || [],
        deliverables: p.deliverables || []
      }))
    }));
  },

  async getMentorById(id: string): Promise<Mentor> {
    const m = await apiRequest<any>(`/mentors/${id}`);
    return {
      id: String(m.id),
      name: m.name,
      title: m.title || '',
      company: m.company || '',
      experienceYears: m.experienceYears || 0,
      rating: m.rating || 5.0,
      reviewCount: m.reviewCount || 0,
      hourlyRateInr: m.hourlyRateInr || 1999,
      avatar: m.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(m.name)}`,
      bio: m.bio || '',
      about: m.about || '',
      skills: m.skills || [],
      languages: m.languages || ['English'],
      nextAvailableSlot: m.nextAvailableSlot || 'Tomorrow, 7:00 PM',
      packages: (m.packages || []).map((p: any) => ({
        id: String(p.id),
        mentorId: String(p.mentorId || m.id),
        title: p.title,
        description: p.description,
        durationMinutes: p.durationMinutes,
        priceInr: p.priceInr || p.priceINR || 0,
        priceINR: p.priceINR || p.priceInr || 0,
        sessionsCount: p.sessionsCount || 1,
        topics: p.topics || [],
        deliverables: p.deliverables || []
      }))
    };
  },

  async getMentorPackages(mentorId: string): Promise<MentorPackage[]> {
    const data = await apiRequest<any[]>(`/mentors/${mentorId}/packages`);
    return data.map((p) => ({
      id: String(p.id),
      mentorId: String(p.mentorId || mentorId),
      title: p.title,
      description: p.description,
      durationMinutes: p.durationMinutes,
      priceInr: p.priceInr || p.priceINR || 0,
      priceINR: p.priceINR || p.priceInr || 0,
      sessionsCount: p.sessionsCount || 1,
      topics: p.topics || [],
      deliverables: p.deliverables || []
    }));
  },

  async getMentorAvailability(mentorId: string): Promise<any[]> {
    return apiRequest<any[]>(`/mentors/${mentorId}/availability`);
  },

  async createPackage(data: {
    title: string;
    description?: string;
    durationMinutes: number;
    priceInr: number;
    sessionsCount?: number;
    topics?: string[];
    deliverables?: string[];
  }): Promise<MentorPackage> {
    const p = await apiRequest<any>('/mentor/packages', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return {
      id: String(p.id),
      mentorId: String(p.mentorId),
      title: p.title,
      description: p.description,
      durationMinutes: p.durationMinutes,
      priceInr: p.priceInr || p.priceINR,
      priceINR: p.priceINR || p.priceInr,
      sessionsCount: p.sessionsCount || 1,
      topics: p.topics || [],
      deliverables: p.deliverables || []
    };
  },

  async getMentorStats(): Promise<any> {
    return apiRequest<any>('/mentor/stats');
  }
};
