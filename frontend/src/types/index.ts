export type UserRole = 'student' | 'mentor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  title?: string;
  company?: string;
  college?: string;
  department?: string;
  year?: string;
  phone?: string;
}

export interface MentorPackage {
  id: string;
  mentorId?: string;
  title: string;
  description?: string;
  durationMinutes: number;
  priceINR?: number;
  priceInr?: number;
  sessionsCount?: number;
  topics: string[];
  deliverables?: string[];
}

export interface MentorBankDetails {
  bankName: string;
  accountNumberMasked: string;
  ifscCode: string;
  accountHolderName: string;
  payoutStatus: 'verified' | 'pending';
  upiId?: string;
}

export interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  hourlyRateInr: number;
  avatar: string;
  bio: string;
  about?: string;
  skills: string[];
  languages: string[];
  nextAvailableSlot: string;
  packages: MentorPackage[];
  bankDetails?: MentorBankDetails;
}

export interface Booking {
  id: string;
  studentId: string;
  studentName: string;
  mentorId: string;
  mentorName: string;
  mentorCompany?: string;
  mentorAvatar?: string;
  packageId: string;
  packageTitle: string;
  date: string;
  timeSlot: string;
  durationMinutes: number;
  amountInr: number;
  packagePriceINR?: number;
  status: 'upcoming' | 'pending' | 'completed' | 'cancelled';
  zoomLink?: string;
  // Bank Escrow & Transfer Fields
  paymentStatus?: 'escrow_held' | 'escrow_released' | 'refunded';
  escrowHoldRef?: string;
  bankEscrowAccount?: string;
  mentorBankAccount?: string;
  bankTransferUtr?: string;
  platformFeeInr?: number;
  mentorPayoutInr?: number;
  paymentMethod?: string;
  sessionCompletedAt?: string;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  role?: 'student' | 'mentor' | 'all';
  title: string;
  message: string;
  type: 'class_reminder' | 'payment_escrow' | 'payout_released' | 'booking_confirmed';
  createdAt: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}
