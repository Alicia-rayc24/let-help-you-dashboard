import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Calendar, MapPin, Users, Star, MessageCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const Events = () => {
  const { events, currentUser, updateEvent } = useApp();
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  if (!currentUser) return null;

  const handleRSVP = (event: any) => {
    const alreadyGoing = event.participants.includes(currentUser.id);
    const updated = { ...event };
    if (alreadyGoing) {
      updated.participants = event.participants.filter((id: string) => id !== currentUser.id);
      toast.info("RSVP removed.");
    } else {
      updated.participants = [...event.participants, currentUser.id];
      toast.success("See you there!");
    }
    updateEvent(updated);
  };

  const handleReview = (event: any) => {
    if (!reviewText) return toast.error("Write something first!");
    const updated = { ...event };
    updated.reviews = [...(event.reviews || []), { memberId: currentUser.id, text: reviewText, rating }];
    updateEvent(updated);
    setReviewText('');
    setSelectedEventId(null);
    toast.success("Review posted!");
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-white">Theatre Calendar</h2>
        <p className="text-amber-100/60">Upcoming meetings, rehearsals, and shows</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {events.map(event => (
          <Card key={event.id} className="bg-white/10 backdrop-blur-md border-white/20 text-white overflow-hidden group">
            <div className="h-3 bg-gradient-to-r from-amber-500 to-red-600 opacity-80" />
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Badge className="bg-amber-600 mb-2 capitalize">{event.type}</Badge>
                  <h3 className="text-xl font-bold">{event.title}</h3>
                  <p className="text-sm text-amber-100/60 flex items-center gap-2 mt-1">
                    <Calendar size={14} /> {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-amber-200 font-bold mb-1">GOING</p>
                  <p className="text-2xl font-black">{event.participants.length}</p>
                </div>
              </div>

              <p className="text-sm text-white/80 mb-6">{event.description}</p>

              <div className="flex gap-3">
                <Button 
                  onClick={() => handleRSVP(event)}
                  className={`flex-1 ${event.participants.includes(currentUser.id) ? 'bg-green-600' : 'bg-amber-600'}`}
                >
                  {event.participants.includes(currentUser.id) ? <CheckCircle2 className="mr-2" /> : null}
                  {event.participants.includes(currentUser.id) ? 'Registered' : 'RSVP Going'}
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white/20 hover:bg-white/10"
                  onClick={() => setSelectedEventId(event.id === selectedEventId ? null : event.id)}
                >
                  <MessageCircle size={18} />
                </Button>
              </div>

              {selectedEventId === event.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-6 pt-6 border-t border-white/10">
                  <div className="space-y-4">
                    <h4 className="font-bold flex items-center gap-2">
                      <Star className="text-amber-400" size={16} /> Member Reviews
                    </h4>
                    <div className="space-y-3">
                      {event.reviews?.map((r, i) => (
                        <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs font-bold text-amber-400">Verified Attendee</span>
                            <div className="flex gap-0.5">
                              {[...Array(r.rating)].map((_, j) => <Star key={j} size={10} className="fill-amber-400 text-amber-400" />)}
                            </div>
                          </div>
                          <p className="text-sm italic">"{r.text}"</p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map(s => (
                          <button key={s} onClick={() => setRating(s)} className={rating >= s ? 'text-amber-400' : 'text-white/20'}>
                            <Star size={16} fill={rating >= s ? 'currentColor' : 'none'} />
                          </button>
                        ))}
                      </div>
                      <textarea 
                        value={reviewText} 
                        onChange={e => setReviewText(e.target.value)} 
                        placeholder="What did you think of the event?"
                        className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-sm text-white h-20"
                      />
                      <Button size="sm" className="w-full bg-slate-800" onClick={() => handleReview(event)}>Post Review</Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};