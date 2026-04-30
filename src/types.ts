import { createContext, useContext, useState, useEffect } from 'react';

export type SchoolState = 'active' | 'inactive' | 'graduate';
export type MemberRole = 'Chairperson' | 'Secretary' | 'Treasurer' | 'Member';
export type GroupType = 'acting' | 'pr' | 'writing' | 'leader' | 'bible study leader' | 'director' | 'writer' | 'leaders' | 'pr team' | 'actor';
export type PaymentStatus = 'paid' | 'pending' | 'partial';

export interface Member {
  id: string;
  name: string;
  phone: string;
  admissionNumber: string;
  password: string;
  dob: string;
  monthlyContribution: number;
  weeklyChallenge: number;
  semesterContribution: number;
  yearlyContribution: number;
  paymentStatus: PaymentStatus;
  participation: number; // Percentage
  role: MemberRole;
  groups: GroupType[];
  year: string;
  schoolState: SchoolState;
  photo?: string;
  points: number;
  attendance: string[]; // Event IDs
  inactiveReason?: boolean; // If true, Ksh 150, else 250
}

export interface TheatreEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  type: 'semester' | 'meeting' | 'reminder' | 'event';
  link?: string;
  participants: string[]; // Member IDs
  reviews: { memberId: string; text: string; rating: number }[];
}

export type AwardType = 'best actor' | 'best performer loved by audience' | 'most active members' | 'most disciplined' | 'best leader' | 'best director' | 'active performer' | 'best director of the year';

export interface Award {
  id: string;
  title: AwardType;
  candidates: string[]; // Member IDs
  votes: Record<string, string>; // VoterAdmNo -> CandidateId
  deadline: string;
  isOpen: boolean;
  semester: 'January' | 'May' | 'Year';
  winnerId?: string;
}

export interface Message {
  id: string;
  type: 'birthday' | 'encouragement';
  content: string;
  sender: string;
  senderName: string;
  recipientId: string;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  title: string;
  addedBy: string;
}

export interface BibleStudy {
  id: string;
  date: string;
  topic: string;
  leaderId: string;
  description?: string;
}

export interface AppContextType {
  currentUser: Member | null;
  members: Member[];
  events: TheatreEvent[];
  awards: Award[];
  messages: Message[];
  media: MediaItem[];
  bibleStudies: BibleStudy[];
  backgroundUrl: string;
  setBackgroundUrl: (url: string) => void;
  setCurrentUser: (user: Member | null) => void;
  updateMember: (member: Member) => void;
  addMember: (member: Member) => void;
  removeMember: (id: string) => void;
  addEvent: (event: TheatreEvent) => void;
  updateEvent: (event: TheatreEvent) => void;
  addAward: (award: Award) => void;
  closeAward: (awardId: string, winnerId: string) => void;
  vote: (awardId: string, voterAdmNo: string, candidateId: string) => void;
  addMessage: (msg: Message) => void;
  addMedia: (item: MediaItem) => void;
  addBibleStudy: (study: BibleStudy) => void;
}