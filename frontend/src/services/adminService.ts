import { apiRequest } from './api';

export interface AdminStats {
  pendingApprovals: number;
  activeMentors: number;
  totalBookings: number;
  platformVolumeInr: number;
}

export const adminService = {
  async getStats(): Promise<AdminStats> {
    return apiRequest<AdminStats>('/admin/stats');
  },

  async getPendingMentors(): Promise<any[]> {
    return apiRequest<any[]>('/admin/mentors/pending');
  },

  async verifyMentor(id: string | number): Promise<void> {
    await apiRequest<void>(`/admin/mentors/${id}/verify`, {
      method: 'POST'
    });
  },

  async rejectMentor(id: string | number): Promise<void> {
    await apiRequest<void>(`/admin/mentors/${id}/reject`, {
      method: 'POST'
    });
  },

  async getAllBookings(): Promise<any[]> {
    return apiRequest<any[]>('/admin/bookings');
  }
};
