import { apiRequest } from './api';

export interface SessionData {
  id: string | number;
  bookingId: string | number;
  roomCode: string;
  mentorName: string;
  studentName: string;
  packageTitle: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  isActive: boolean;
  notes?: string;
}

export const sessionService = {
  async getSession(bookingId: string | number): Promise<SessionData> {
    return apiRequest<SessionData>(`/sessions/${bookingId}`);
  },

  async submitReview(data: {
    bookingId: string | number;
    rating: number;
    comment?: string;
  }): Promise<any> {
    return apiRequest<any>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};
