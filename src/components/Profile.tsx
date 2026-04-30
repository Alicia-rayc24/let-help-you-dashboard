import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { User, Phone, IdCard, Calendar, Briefcase, Lock, Camera } from 'lucide-react';

export const Profile = () => {
  const { currentUser, updateMember } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(currentUser);
  const [newPassword, setNewPassword] = useState('');

  if (!currentUser || !formData) return null;

  // Specific profile picture for Christine Musimbi as requested
  const christineImageUrl = "https://storage.googleapis.com/dala-prod-public-storage/attachments/5eeb9a57-97f5-428d-8fd5-806060585e2e/1777526381353_IMG_4022.jpg";
  const profileBannerUrl = "https://storage.googleapis.com/dala-prod-public-storage/generated-images/a74bbf3b-8735-48f0-9c68-95390a794e32/profile-banner-theatre-40c44d9e-1777526472219.webp";

  const displayPhoto = currentUser.name === 'Christine Musimbi' 
    ? christineImageUrl 
    : (currentUser.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`);

  const handleSave = () => {
    const updated = { ...formData };
    if (newPassword) updated.password = newPassword;
    updateMember(updated);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white overflow-hidden shadow-2xl">
        <div 
          className="h-40 bg-cover bg-center transition-all duration-700 hover:scale-105" 
          style={{ backgroundImage: `url('${profileBannerUrl}')` }}
        >
          <div className="w-full h-full bg-gradient-to-r from-amber-600/40 to-red-900/40 backdrop-blur-[1px]" />
        </div>
        <CardContent className="relative px-6 pb-6">
          <div className="flex flex-col md:flex-row gap-6 -mt-16">
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-amber-500 border-4 border-white/30 overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]">
                <img 
                  src={displayPhoto} 
                  alt={currentUser.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <button className="absolute bottom-2 right-2 p-2.5 bg-white rounded-full text-amber-900 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl transform translate-y-2 group-hover:translate-y-0">
                <Camera size={18} />
              </button>
            </div>
            <div className="flex-1 pt-4 md:pt-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-md">{currentUser.name}</h2>
                  <p className="text-amber-400 font-bold uppercase tracking-wider text-xs mt-1">{currentUser.role} • Year {currentUser.year}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setIsEditing(!isEditing)}
                    variant={isEditing ? "destructive" : "outline"} 
                    className={`border-white/20 transition-all ${!isEditing ? 'bg-white/10 hover:bg-white/20' : ''}`}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <IdCard size={22} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest">Admission Number</p>
                  <p className="font-bold text-lg">{currentUser.admissionNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Phone size={22} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest">Phone Number</p>
                  {isEditing ? (
                    <Input 
                      value={formData.phone} 
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="bg-black/20 border-white/20 h-9 text-white mt-1"
                    />
                  ) : (
                    <p className="font-bold text-lg">{currentUser.phone}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Calendar size={22} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest">Date of Birth</p>
                  <p className="font-bold text-lg">{new Date(currentUser.dob).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Briefcase size={22} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest">Participation Groups</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {currentUser.groups.map(g => (
                      <span key={g} className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500 text-black font-black uppercase tracking-tighter shadow-sm">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <User size={22} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest">School State</p>
                  <p className="font-bold text-lg capitalize">{currentUser.schoolState}</p>
                </div>
              </div>
              {isEditing && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <Lock size={22} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest">Change Password</p>
                    <Input 
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="bg-black/20 border-white/20 h-9 text-white mt-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <Button onClick={handleSave} className="w-full mt-6 bg-amber-600 hover:bg-amber-700 text-white font-bold h-12 text-lg shadow-lg shadow-amber-600/30">
              Save Changes
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-black uppercase tracking-wider text-amber-500">Financial Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-black/40 border border-white/5 text-center transition-transform hover:scale-105">
            <p className="text-[10px] text-amber-100/60 font-black uppercase tracking-widest mb-1">Monthly Contribution</p>
            <p className="text-2xl font-black text-white">Ksh {currentUser.monthlyContribution}</p>
          </div>
          <div className="p-5 rounded-2xl bg-black/40 border border-white/5 text-center transition-transform hover:scale-105">
            <p className="text-[10px] text-amber-100/60 font-black uppercase tracking-widest mb-1">Weekly Challenge</p>
            <p className="text-2xl font-black text-white">Ksh {currentUser.weeklyChallenge}</p>
          </div>
          <div className="p-5 rounded-2xl bg-amber-600 border border-amber-400/50 text-center transition-transform hover:scale-105 shadow-lg shadow-amber-600/20">
            <p className="text-[10px] text-black/60 font-black uppercase tracking-widest mb-1">Reward Points</p>
            <p className="text-2xl font-black text-black">{currentUser.points} pts</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};