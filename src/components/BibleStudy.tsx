import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { BookOpen, Calendar, User, Plus, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const BibleStudy = () => {
  const { bibleStudies, addBibleStudy, currentUser, members } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [newStudy, setNewStudy] = useState({
    topic: '',
    date: '',
    description: '',
    leaderId: ''
  });

  if (!currentUser) return null;
  const isAdmin = ['Chairperson', 'Secretary', 'Treasurer'].includes(currentUser.role);

  const handleAdd = () => {
    if (!newStudy.topic || !newStudy.date || !newStudy.leaderId) return toast.error("Fill all fields");
    addBibleStudy({
      ...newStudy,
      id: Math.random().toString(36).substr(2, 9)
    });
    setShowAdd(false);
    toast.success("Bible study session scheduled!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Weekly Bible Study</h2>
          <p className="text-amber-100/60">Spiritual growth for the creative soul</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowAdd(!showAdd)} className="bg-amber-600">
            <Plus size={18} className="mr-2" /> Schedule Study
          </Button>
        )}
      </header>

      {showAdd && (
        <Card className="bg-slate-900 border-amber-500/30 text-white">
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input placeholder="Topic" value={newStudy.topic} onChange={e => setNewStudy({...newStudy, topic: e.target.value})} className="bg-white/5 border-white/20" />
              <Input type="datetime-local" value={newStudy.date} onChange={e => setNewStudy({...newStudy, date: e.target.value})} className="bg-white/5 border-white/20" />
              <select 
                value={newStudy.leaderId} 
                onChange={e => setNewStudy({...newStudy, leaderId: e.target.value})}
                className="h-10 px-3 rounded-md bg-slate-800 border border-white/20 text-white"
              >
                <option value="">Select Member Lead</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowAdd(false)} className="flex-1">Cancel</Button>
                <Button onClick={handleAdd} className="bg-amber-600 flex-1">Schedule</Button>
              </div>
            </div>
            <textarea 
              placeholder="Short description or verse focus..."
              value={newStudy.description}
              onChange={e => setNewStudy({...newStudy, description: e.target.value})}
              className="w-full h-20 bg-white/5 border border-white/20 rounded-md p-2 text-white"
            />
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {bibleStudies.length > 0 ? bibleStudies.map(study => {
          const leader = members.find(m => m.id === study.leaderId);
          return (
            <motion.div key={study.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-48 bg-amber-600/20 p-6 flex flex-col items-center justify-center text-center">
                      <Calendar size={24} className="text-amber-500 mb-2" />
                      <p className="text-sm font-bold">{new Date(study.date).toLocaleDateString()}</p>
                      <p className="text-xs text-amber-200">{new Date(study.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-amber-100">{study.topic}</h3>
                          <div className="flex items-center gap-2 mt-1 text-sm text-amber-100/60">
                            <User size={14} />
                            <span>Led by <span className="text-amber-400 font-medium">{leader?.name}</span></span>
                          </div>
                        </div>
                        <Badge className="bg-amber-600/20 text-amber-400 border-amber-600/30">Weekly Session</Badge>
                      </div>
                      {study.description && (
                        <p className="text-sm text-white/80 italic border-l-2 border-amber-500/30 pl-4 py-1">
                          "{study.description}"
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        }) : (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/20">
            <BookOpen size={48} className="mx-auto text-white/20 mb-4" />
            <p className="text-white/40 italic">No scheduled Bible Study sessions. Stay tuned!</p>
          </div>
        )}
      </div>

      <Card className="bg-slate-900/60 border-white/10 text-white mt-10">
        <CardContent className="p-8 text-center">
          <Quote size={32} className="mx-auto text-amber-500 mb-4 opacity-50" />
          <p className="text-xl font-serif italic mb-2 text-amber-100">
            "For where two or three are gathered in my name, there am I among them."
          </p>
          <p className="text-sm text-white/40 font-bold tracking-widest">MATTHEW 18:20</p>
        </CardContent>
      </Card>
    </div>
  );
};