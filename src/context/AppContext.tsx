import React, { createContext, useContext, useState, useEffect } from 'react';
import { Member, TheatreEvent, Award, Message, MediaItem, BibleStudy, AppContextType } from '../types';
import { toast } from 'sonner';

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const INITIAL_MEMBERS: Member[] = [
  {
    id: '1',
    name: 'Christine Musimbi',
    phone: '0113196988',
    admissionNumber: '24-2733',
    password: '123',
    dob: '2004-02-24',
    monthlyContribution: 0,
    weeklyChallenge: 0,
    semesterContribution: 0,
    yearlyContribution: 0,
    paymentStatus: 'pending',
    participation: 0,
    role: 'Secretary',
    groups: ['acting', 'pr team', 'writer'],
    year: '2.1',
    schoolState: 'active',
    points: 150,
    attendance: [],
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '2',
    name: 'Admin Chair',
    phone: '0712345678',
    admissionNumber: 'CH-001',
    password: '123',
    dob: '1995-01-01',
    monthlyContribution: 300,
    weeklyChallenge: 0,
    semesterContribution: 0,
    yearlyContribution: 0,
    paymentStatus: 'paid',
    participation: 95,
    role: 'Chairperson',
    groups: ['leader'],
    year: 'Graduated',
    schoolState: 'graduate',
    points: 500,
    attendance: [],
  }
];

const INITIAL_EVENTS: TheatreEvent[] = [
  {
    id: 'e1',
    title: 'Semester Opening Meeting',
    date: new Date().toISOString(),
description: 'Welcome back everyone! Discussing the new play.',
    type: 'semester',
    link: 'https://zoom.us/j/meeting1',
    participants: ['1', '2'],
    reviews: []
  }
];

const INITIAL_AWARDS: Award[] = [
  {
    id: 'a1',
    title: 'most disciplined',
    candidates: ['1', '2'],
    votes: {},
deadline: new Date(Date.now() + 86400000 * 7).toISOString(),
    isOpen: true,
    semester: 'January'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [events, setEvents] = useState<TheatreEvent[]>(INITIAL_EVENTS);
  const [awards, setAwards] = useState<Award[]>(INITIAL_AWARDS);
  const [messages, setMessages] = useState<Message[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [bibleStudies, setBibleStudies] = useState<BibleStudy[]>([]);
  const [backgroundUrl, setBackgroundUrl] = useState('https://storage.googleapis.com/dala-prod-public-storage/generated-images/a74bbf3b-8735-48f0-9c68-95390a794e32/theatre-bg-main-7eb5ff85-1777526302431.webp');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setMessages(prev => prev.filter(msg => {
        const created = new Date(msg.createdAt).getTime();
        if (msg.type === 'birthday') return now - created < 28 * 3600000;
        if (msg.type === 'encouragement') return now - created < 7 * 24 * 3600000;
        return true;
      }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const updateMember = (updated: Member) => {
    setMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
    if (currentUser?.id === updated.id) setCurrentUser(updated);
  };

  const addMember = (m: Member) => setMembers(prev => [...prev, m]);
  const removeMember = (id: string) => setMembers(prev => prev.filter(m => m.id !== id));
  
  const addEvent = (e: TheatreEvent) => setEvents(prev => [...prev, e]);
  const updateEvent = (e: TheatreEvent) => setEvents(prev => prev.map(ev => ev.id === e.id ? e : ev));
  
  const addAward = (a: Award) => setAwards(prev => [...prev, a]);
  const closeAward = (awardId: string, winnerId: string) => {
    setAwards(prev => prev.map(a => a.id === awardId ? { ...a, isOpen: false, winnerId } : a));
  };
  
  const vote = (awardId: string, voterAdmNo: string, candidateId: string) => {
    setAwards(prev => prev.map(a => {
      if (a.id === awardId) {
        if (!a.isOpen) {
          toast.error("Voting is closed for this award!");
          return a;
        }
        if (a.votes[voterAdmNo]) {
          toast.error("You have already voted for this award!");
          return a;
        }
        toast.success("Vote cast successfully!");
        return { ...a, votes: { ...a.votes, [voterAdmNo]: candidateId } };
      }
      return a;
    }));
  };

  const addMessage = (m: Message) => setMessages(prev => [...prev, m]);
  const addMedia = (m: MediaItem) => setMedia(prev => [...prev, m]);
  const addBibleStudy = (s: BibleStudy) => setBibleStudies(prev => [...prev, s]);

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser, members, events, awards, messages, media, bibleStudies, backgroundUrl, setBackgroundUrl,
      updateMember, addMember, removeMember, addEvent, updateEvent, addAward, closeAward, vote, addMessage, addMedia, addBibleStudy
    }}>
      {children}
    </AppContext.Provider>
  );
};