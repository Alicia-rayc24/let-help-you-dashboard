import { useApp } from '../context/AppContext';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { User, DollarSign, Award, Calendar, Users, Heart, MessageSquare, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useState } from 'react';
import { Message } from '../types';

export const Dashboard = () => {
  const { currentUser, events, members, awards, messages, addMessage } = useApp();
  const [wishContent, setWishContent] = useState('');
  const [showWishModal, setShowWishModal] = useState<{ type: 'birthday' | 'encouragement', memberId: string } | null>(null);

  if (!currentUser) return null;

  const upcomingBirthdays = members.filter(m => {
    const dob = new Date(m.dob);
    const today = new Date();
    return dob.getMonth() === today.getMonth() && Math.abs(dob.getDate() - today.getDate()) <= 2;
  });

  const activeMessages = messages.filter(m => m.recipientId === currentUser.id);

  const handleSendWish = () => {
    if (!wishContent || !showWishModal) return;
    const msg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      type: showWishModal.type,
      content: wishContent,
      sender: currentUser.id,
      senderName: currentUser.name,
      recipientId: showWishModal.memberId,
      createdAt: new Date().toISOString()
    };
    addMessage(msg);
    toast.success(`${showWishModal.type === 'birthday' ? 'Birthday wish' : 'Encouragement'} sent!`);
    setWishContent('');
    setShowWishModal(null);
  };

  const stats = [
    { label: 'Participation', value: `${currentUser.participation}%`, icon: User, color: 'bg-blue-500' },
    { label: 'Contributions', value: `Ksh ${currentUser.monthlyContribution}`, icon: DollarSign, color: 'bg-green-500' },
    { label: 'Awards Won', value: awards.filter(a => a.winnerId === currentUser.id).length, icon: Award, color: 'bg-amber-500' },
    { label: 'Points', value: currentUser.points, icon: Heart, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white drop-shadow-md">Curtain Call, {currentUser.name}!</h1>
          <p className="text-amber-100/80">Welcome to Daystar Theatre of Arts Backstage.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/30 text-white">
          <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center overflow-hidden">
            {currentUser.photo ? <img src={currentUser.photo} className="w-full h-full object-cover" /> : <User />}
          </div>
          <div>
            <p className="text-sm font-bold">{currentUser.role}</p>
            <p className="text-xs text-amber-100">{currentUser.schoolState.toUpperCase()}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white overflow-hidden">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-xs text-amber-100/70">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="text-amber-400" /> Upcoming Events
              </h3>
              <div className="space-y-4">
                {events.length > 0 ? events.slice(0, 3).map(event => (
                  <div key={event.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                    <div>
                      <h4 className="font-bold">{event.title}</h4>
                      <p className="text-sm text-amber-100/60">{new Date(event.date).toLocaleDateString()}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-xs text-amber-300 capitalize">
                      {event.type}
                    </span>
                  </div>
                )) : <p className="text-center text-amber-100/50 py-8">No upcoming events.</p>}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MessageSquare className="text-amber-400" /> My Messages
                </h3>
                <div className="space-y-3">
                  {activeMessages.length > 0 ? activeMessages.map(msg => (
                    <div key={msg.id} className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <p className="text-xs font-bold text-amber-400 mb-1">{msg.type.toUpperCase()} from {msg.senderName}</p>
                      <p className="text-sm italic">"{msg.content}"</p>
                    </div>
                  )) : <p className="text-sm text-amber-100/40 italic">No messages yet...</p>}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users className="text-amber-400" /> Member Shoutouts
                </h3>
                <div className="space-y-3">
                  {upcomingBirthdays.length > 0 ? upcomingBirthdays.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                      <span className="text-sm">{m.name}'s Birthday!</span>
                      <Button size="sm" variant="ghost" className="text-amber-400" onClick={() => setShowWishModal({ type: 'birthday', memberId: m.id })}>
                        Wish Happy Birthday
                      </Button>
                    </div>
                  )) : (
                    <Button 
                      variant="outline" 
                      className="w-full border-white/20 text-xs" 
                      onClick={() => setShowWishModal({ type: 'encouragement', memberId: members.find(m => m.id !== currentUser.id)?.id || '' })}
                    >
                      Send Encouragement to a Friend
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Quote className="text-amber-400" /> My Groups
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentUser.groups.map(group => (
                  <span key={group} className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs capitalize">
                    {group}
                  </span>
                ))}
              </div>
              <div className="mt-8">
                <h4 className="text-[10px] font-bold text-amber-100/70 mb-2 uppercase tracking-widest">Overall Participation</h4>
                <Progress value={currentUser.participation} className="h-1.5 bg-white/10" />
                <p className="text-right text-[10px] mt-2">{currentUser.participation}% of semester goal</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-600/30 backdrop-blur-md border-amber-500/40 text-white">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <DollarSign /> Finances
              </h3>
              <p className="text-[10px] text-amber-100/80 mb-4">
                Send all contributions to <span className="font-bold text-white">+254 715 788764</span>.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Monthly Due</span>
                  <span className="font-bold">Ksh 100</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Semester Due</span>
                  <span className="font-bold">Ksh 300</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between">
                  <span className="text-xs text-amber-200">My Current Balance</span>
                  <span className="font-bold">Ksh {currentUser.monthlyContribution}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showWishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-white/20 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4 capitalize">Send {showWishModal.type}</h3>
            <textarea 
              value={wishContent} 
              onChange={e => setWishContent(e.target.value)} 
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white mb-4 placeholder:text-white/20"
              placeholder="Write your message here..."
            />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowWishModal(null)}>Cancel</Button>
              <Button className="flex-1 bg-amber-600" onClick={handleSendWish}>Send Message</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};