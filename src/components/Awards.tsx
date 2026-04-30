import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Trophy, Timer, CheckCircle, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const Awards = () => {
  const { awards, members, vote, currentUser } = useApp();
  const [selectedAward, setSelectedAward] = useState<string | null>(null);

  if (!currentUser) return null;

  const handleVote = (awardId: string, candidateId: string) => {
    // Requirement: If you have dues you pay 200 to vote/win?
    // "If selected for awards and you have dues you will pay Kshs 200"
    // Let's assume selecting for voting is what counts.
    const dues = currentUser.monthlyContribution < 100;
    if (dues) {
      toast.info("Note: Since you have outstanding dues, a fee of Ksh 200 will be added for award participation.");
    }
    
    vote(awardId, currentUser.admissionNumber, candidateId);
  };

  const activeAwards = awards.filter(a => a.isOpen);
  const pastAwards = awards.filter(a => !a.isOpen);

  return (
    <div className="space-y-8">
      <header className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">The Oscars of Daystar</h2>
        <p className="text-amber-200/80 italic">Recognizing excellence, dedication, and the soul of performance.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Timer className="text-amber-400" /> Active Voting
          </h3>
          
          {activeAwards.length > 0 ? activeAwards.map(award => (
            <Card key={award.id} className="bg-white/10 backdrop-blur-lg border-white/20 text-white overflow-hidden">
              <CardHeader className="bg-amber-600/20">
                <div className="flex justify-between items-center">
                  <CardTitle className="capitalize">{award.title}</CardTitle>
                  <Badge variant="secondary" className="bg-amber-500 text-black font-bold">
                    OPEN
                  </Badge>
                </div>
                <p className="text-xs opacity-70">Deadline: {new Date(award.deadline).toLocaleDateString()}</p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <p className="text-sm font-bold text-amber-200 mb-4">Nominees:</p>
                  {award.candidates.map(candidateId => {
                    const candidate = members.find(m => m.id === candidateId);
                    if (!candidate) return null;
                    const hasVoted = award.votes[currentUser.admissionNumber] === candidateId;
                    const anyoneVoted = award.votes[currentUser.admissionNumber] !== undefined;

                    return (
                      <div key={candidateId} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 group hover:border-amber-500/50 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800">
                            <img src={candidate.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`} alt="" />
                          </div>
                          <div>
                            <p className="font-medium">{candidate.name}</p>
                            <p className="text-[10px] text-amber-100/50">{candidate.role}</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant={hasVoted ? "default" : "outline"}
                          disabled={anyoneVoted && !hasVoted}
                          onClick={() => handleVote(award.id, candidateId)}
                          className={hasVoted ? "bg-green-600" : "border-white/20"}
                        >
                          {hasVoted ? <CheckCircle size={16} /> : 'Vote'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )) : (
            <Card className="bg-white/5 border-dashed border-white/20 text-white">
              <CardContent className="p-12 text-center">
                <Trophy size={48} className="mx-auto text-white/20 mb-4" />
                <p className="opacity-50">No active awards for voting at this time.</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="text-amber-400" /> Recent Hall of Fame
          </h3>
          
          {pastAwards.map(award => {
            const winner = members.find(m => m.id === award.winnerId);
            return (
              <Card key={award.id} className="bg-slate-900/60 border-amber-500/20 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-lg shadow-amber-500/20">
                        <img src={winner?.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${winner?.name}`} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-amber-500 rounded-full p-1">
                        <Trophy size={14} className="text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] uppercase font-bold text-amber-500 tracking-tighter">{award.semester} Winner</p>
                      <h4 className="text-xl font-bold capitalize">{award.title}</h4>
                      <p className="text-amber-100/70">{winner?.name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Card className="bg-amber-600/10 border-amber-500/30 text-white">
            <CardHeader>
              <CardTitle className="text-sm">System Merit Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-amber-100/60 mb-4">Rating based on participation, discipline, and peer reviews.</p>
              <div className="space-y-4">
                {members.slice(0, 3).map((m, i) => (
                  <div key={m.id} className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span>{m.name}</span>
                      <span>{98 - i * 5}% Rating</span>
                    </div>
                    <Progress value={98 - i * 5} className="h-1 bg-white/5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};