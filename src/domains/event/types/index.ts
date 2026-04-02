export type EventType = "tester_recruitment" | "sale" | "event_popup";

export type RecruitmentStatus =
  | "draft"
  | "pending"
  | "open"
  | "closed"
  | "in_progress"
  | "completed"
  | "hidden";

export type ApplicationStatus =
  | "submitted"
  | "reviewing"
  | "accepted"
  | "rejected"
  | "canceled";

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  description: string;
  startDate: string;
  endDate: string;
  link?: string;
  location?: string;
  placeId?: string;
  lat?: number;
  lng?: number;
}

export interface TesterRecruitment extends CalendarEvent {
  type: "tester_recruitment";
  patternName: string;
  category: string;
  maxParticipants: number;
  currentParticipants: number;
  applicationStart: string;
  applicationEnd: string;
  testPeriodStart: string;
  testPeriodEnd: string;
  conditions: string;
  requirements: string;
  contactMethod: string;
  recruitmentStatus: RecruitmentStatus;
}

export interface TesterApplication {
  id: string;
  recruitmentId: string;
  nickname: string;
  contact: string;
  experience: string;
  reason: string;
  portfolio?: string;
  status: ApplicationStatus;
  appliedAt: string;
}

export type AnyEvent = CalendarEvent | TesterRecruitment;
