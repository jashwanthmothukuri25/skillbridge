import { apiRequest } from './api';
import { Booking } from '../types';

export const bookingService = {
  async getMyBookings(): Promise<Booking[]> {
    const data = await apiRequest<any[]>('/bookings');
    return data.map((b) => ({
      id: String(b.id),
      studentId: String(b.studentId),
      studentName: b.studentName || 'Student',
      mentorId: String(b.mentorId),
      mentorName: b.mentorName || 'Mentor',
      mentorCompany: b.mentorCompany || '',
      mentorAvatar: b.mentorAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(b.mentorName || 'Mentor')}`,
      packageId: String(b.packageId),
      packageTitle: b.packageTitle || 'Mentorship Session',
      date: b.date || (b.scheduledStartTime ? b.scheduledStartTime.split('T')[0] : 'Scheduled'),
      timeSlot: b.timeSlot || '7:00 PM - 8:30 PM',
      durationMinutes: b.durationMinutes || 60,
      amountInr: b.amountInr !== undefined ? Number(b.amountInr) : 1999,
      packagePriceINR: b.amountInr !== undefined ? Number(b.amountInr) : 1999,
      status: (b.status ? b.status.toLowerCase() : 'upcoming') as 'upcoming' | 'pending' | 'completed' | 'cancelled',
      zoomLink: b.zoomLink || `/session/live-${b.id}`
    }));
  },

  async createBooking(data: {
    packageId: string | number;
    slotId?: string | number;
    notes?: string;
  }): Promise<Booking> {
    const b = await apiRequest<any>('/bookings', {
      method: 'POST',
      body: JSON.stringify({
        packageId: Number(data.packageId),
        slotId: data.slotId ? Number(data.slotId) : null,
        notes: data.notes || ''
      })
    });

    return {
      id: String(b.id),
      studentId: String(b.studentId),
      studentName: b.studentName || 'Student',
      mentorId: String(b.mentorId),
      mentorName: b.mentorName || 'Mentor',
      mentorCompany: b.mentorCompany || '',
      mentorAvatar: b.mentorAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(b.mentorName || 'Mentor')}`,
      packageId: String(b.packageId),
      packageTitle: b.packageTitle || 'Mentorship Session',
      date: b.date || (b.scheduledStartTime ? b.scheduledStartTime.split('T')[0] : 'Scheduled'),
      timeSlot: b.timeSlot || '7:00 PM - 8:30 PM',
      durationMinutes: b.durationMinutes || 60,
      amountInr: b.amountInr !== undefined ? Number(b.amountInr) : 1999,
      packagePriceINR: b.amountInr !== undefined ? Number(b.amountInr) : 1999,
      status: (b.status ? b.status.toLowerCase() : 'upcoming') as 'upcoming' | 'pending' | 'completed' | 'cancelled',
      zoomLink: b.zoomLink || `/session/live-${b.id}`
    };
  },

  async cancelBooking(bookingId: string | number, reason?: string): Promise<void> {
    await apiRequest<void>(`/bookings/${bookingId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason: reason || 'Cancelled by user' })
    });
  }
};
