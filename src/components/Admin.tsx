import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { UserPlus, Settings, Trash2, Edit, Calendar, Gift, Trophy, Palette, Info } from 'lucide-react';
import { MemberRole, SchoolState, TheatreEvent, AwardType, Member } from '../types';

export const Admin = () => {
  const {
    members, addMember, removeMember, updateMember,
    events, addEvent, backgroundUrl, setBackgroundUrl, addAward
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<'members' | 'events' | 'awards' | 'settings'>('members');
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  
  const [newMember, setNewMember] = useState({
    name: '',
    admissionNumber: '',
    password: '123',
    role: 'Member' as MemberRole,
    schoolState: 'active' as SchoolState,
    phone: '',
    dob: '',
    year: '1.1',
    inactiveReason: false
  });

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    description: '',
    type: 'meeting' as any,
    link: ''
  });

  const handleAddMember = () => {
    if (!newMember.name || !newMember.admissionNumber) return toast.error("Missing fields");
    addMember({
      ...newMember,
      id: Math.random().toString(36).substr(2, 9),
      monthlyContribution: 0,
      weeklyChallenge: 0,
      participation: 0,
      groups: [],
      points: 0,
      attendance: []
    });
    setShowAddMember(false);
    toast.success("Member added successfully!");
  };

  const handleUpdateMember = () => {
    if (!editingMember) return;
    updateMember(editingMember);
    setEditingMember(null);
    toast.success("Member details updated!");
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return toast.error("Missing title or date");
    addEvent({
      ...newEvent,
      id: Math.random().toString(36).substr(2, 9),
      participants: [],
      reviews: []
    });
    setShowAddEvent(false);
    toast.success("Event added to calendar!");
  };

  const handleAddAward = (type: AwardType) => {
    addAward({
      id: Math.random().toString(36).substr(2, 9),
      title: type,
      candidates: members.slice(0, 5).map(m => m.id),
      votes: {},
      deadline: new Date(Date.now() + 86400000 * 7).toISOString(),
      isOpen: true,
      semester: 'Year'
    });
    toast.success(`Voting opened for ${type}!`);
  };

  const getTargetDues = (m: Member) => {
    if (m.schoolState === 'graduate') return "Ksh 150/year";
    if (m.schoolState === 'inactive') {
      return m.inactiveReason ? "Ksh 150/sem (Reason)" : "Ksh 250/sem (No Reason)";
    }
    return "Ksh 100/mo or 300/sem";
  };

  const bgOptions = [
    'https://storage.googleapis.com/dala-prod-public-storage/generated-images/a74bbf3b-8735-48f0-9c68-95390a794e32/theatre-bg-main-7eb5ff85-1777526302431.webp',
    'https://storage.googleapis.com/dala-prod-public-storage/generated-images/a74bbf3b-8735-48f0-9c68-95390a794e32/theatre-bg-creative-188a1fcc-1777526302041.webp',
    'https://storage.googleapis.com/dala-prod-public-storage/generated-images/a74bbf3b-8735-48f0-9c68-95390a794e32/theatre-bg-performance-5a30bfcb-1777526302208.webp',
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Backstage Control</h2>
          <p className="text-amber-100/60">Administrative tools for Daystar Theatre leaders</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {['members', 'events', 'awards', 'settings'].map((tab) => (
            <Button 
              key={tab}
              variant={activeTab === tab ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab as any)}
              className={`${activeTab === tab ? 'bg-amber-600' : 'border-white/20 text-white'} capitalize`}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>

      {activeTab === 'members' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => setShowAddMember(true)} className="bg-amber-600">
              <UserPlus size={18} className="mr-2" /> Register Cast
            </Button>
          </div>

          {(showAddMember || editingMember) && (
            <Card className="bg-slate-900/80 border-amber-500/30 text-white">
              <CardHeader><CardTitle>{editingMember ? 'Edit Member' : 'Add New Member'}</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                <Input 
                  placeholder="Full Name" 
                  value={editingMember ? editingMember.name : newMember.name} 
                  onChange={e => editingMember ? setEditingMember({...editingMember, name: e.target.value}) : setNewMember({...newMember, name: e.target.value})} 
                  className="bg-white/5 border-white/20"
                />
                <Input 
                  placeholder="Admission Number" 
                  value={editingMember ? editingMember.admissionNumber : newMember.admissionNumber} 
                  onChange={e => editingMember ? setEditingMember({...editingMember, admissionNumber: e.target.value}) : setNewMember({...newMember, admissionNumber: e.target.value})} 
                  className="bg-white/5 border-white/20"
                />
                <Input 
                  placeholder="Phone Number" 
                  value={editingMember ? editingMember.phone : newMember.phone} 
                  onChange={e => editingMember ? setEditingMember({...editingMember, phone: e.target.value}) : setNewMember({...newMember, phone: e.target.value})} 
                  className="bg-white/5 border-white/20"
                />
                <select 
                  value={editingMember ? editingMember.role : newMember.role} 
                  onChange={e => editingMember ? setEditingMember({...editingMember, role: e.target.value as MemberRole}) : setNewMember({...newMember, role: e.target.value as MemberRole})}
                  className="h-10 px-3 rounded-md bg-slate-800 border border-white/20 text-white"
                >
                  <option value="Member">Member</option>
                  <option value="Chairperson">Chairperson</option>
                  <option value="Secretary">Secretary</option>
                  <option value="Treasurer">Treasurer</option>
                </select>
                <select 
                  value={editingMember ? editingMember.schoolState : newMember.schoolState} 
                  onChange={e => editingMember ? setEditingMember({...editingMember, schoolState: e.target.value as SchoolState}) : setNewMember({...newMember, schoolState: e.target.value as SchoolState})}
                  className="h-10 px-3 rounded-md bg-slate-800 border border-white/20 text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="graduate">Graduate</option>
                </select>
                <div className="flex items-center gap-2 px-3 h-10 bg-white/5 border border-white/20 rounded-md">
                  <label className="text-xs text-white/60">Has Inactive Reason?</label>
                  <input 
                    type="checkbox"
                    checked={editingMember ? editingMember.inactiveReason : newMember.inactiveReason}
                    onChange={e => editingMember ? setEditingMember({...editingMember, inactiveReason: e.target.checked}) : setNewMember({...newMember, inactiveReason: e.target.checked})}
                  />
                </div>
                <div className="md:col-span-3 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => { setShowAddMember(false); setEditingMember(null); }}>Cancel</Button>
                  <Button onClick={editingMember ? handleUpdateMember : handleAddMember} className="bg-amber-600">
                    {editingMember ? 'Update' : 'Save'} Member
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-black/40">
                  <TableRow className="hover:bg-transparent border-white/10">
                    <TableHead className="text-amber-200 font-bold">Name</TableHead>
                    <TableHead className="text-amber-200 font-bold">Adm No</TableHead>
                    <TableHead className="text-amber-200 font-bold">Role</TableHead>
                    <TableHead className="text-amber-200 font-bold">State</TableHead>
                    <TableHead className="text-amber-200 font-bold">Expected Dues</TableHead>
                    <TableHead className="text-right text-amber-200 font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map(member => (
                    <TableRow key={member.id} className="border-white/5 hover:bg-white/5 transition-colors">
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.admissionNumber}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/5">
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          member.schoolState === 'active' ? 'bg-green-600/20 text-green-400 border-green-600/30' : 
                          member.schoolState === 'inactive' ? 'bg-red-600/20 text-red-400 border-red-600/30' : 
                          'bg-blue-600/20 text-blue-400 border-blue-600/30'
                        }>
                          {member.schoolState}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-amber-100/80">{getTargetDues(member)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 hover:bg-white/10 text-amber-400"
                            onClick={() => setEditingMember(member)}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 hover:bg-red-500/20 text-red-400"
                            onClick={() => removeMember(member.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => setShowAddEvent(true)} className="bg-amber-600">
              <Calendar size={18} className="mr-2" /> Schedule Event
            </Button>
          </div>

          {showAddEvent && (
            <Card className="bg-slate-900/80 border-amber-500/30 text-white">
              <CardHeader><CardTitle>Create New Event</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <Input placeholder="Event Title" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="bg-white/5 border-white/20" />
                <Input type="datetime-local" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="bg-white/5 border-white/20" />
                <textarea 
                  placeholder="Description"
                  value={newEvent.description}
                  onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                  className="md:col-span-2 w-full h-24 bg-white/5 border border-white/20 rounded-md p-2 text-white"
                />
                <select 
                  value={newEvent.type} 
                  onChange={e => setNewEvent({...newEvent, type: e.target.value as any})}
                  className="h-10 px-3 rounded-md bg-slate-800 border border-white/20 text-white"
                >
                  <option value="meeting">Meeting</option>
                  <option value="event">Major Event</option>
                  <option value="semester">Semester Activity</option>
                  <option value="reminder">Reminder</option>
                </select>
                <Input placeholder="Meeting Link (optional)" value={newEvent.link} onChange={e => setNewEvent({...newEvent, link: e.target.value})} className="bg-white/5 border-white/20" />
                <div className="md:col-span-2 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddEvent(false)}>Cancel</Button>
                  <Button onClick={handleAddEvent} className="bg-amber-600">Publish Event</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {events.map(event => (
              <Card key={event.id} className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardContent className="p-4 flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg">{event.title}</h4>
                    <p className="text-xs text-amber-100/60">{new Date(event.date).toLocaleString()}</p>
                    <p className="text-sm mt-2 opacity-80">{event.description}</p>
                  </div>
                  <Badge className="bg-amber-600">{event.type}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'awards' && (
        <div className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader><CardTitle>Trigger Award Voting</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-amber-100/60 mb-6">Open voting for specific categories. Members will see these in their Awards section.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[ 
                  'best actor', 'best performer loved by audience', 
                  'most active members', 'most disciplined', 
                  'best leader', 'best director'
                ].map((type) => (
                  <Button 
                    key={type} 
                    variant="outline" 
                    className="border-amber-500/20 text-amber-100 h-auto py-4 flex flex-col gap-2 hover:bg-amber-600/20"
                    onClick={() => handleAddAward(type as AwardType)}
                  >
                    <Trophy size={20} className="text-amber-500" />
                    <span className="capitalize text-xs text-center">{type}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader><CardTitle>Manual Rewards</CardTitle></CardHeader>
            <CardContent className="flex gap-4">
              <Button className="flex-1 bg-green-600/20 border border-green-600/50 text-green-400">
                <Gift className="mr-2" /> Give Birthday Gift
              </Button>
              <Button className="flex-1 bg-blue-600/20 border border-blue-600/50 text-blue-400">
                <Trophy className="mr-2" /> Award Bonus Points
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette size={20} className="text-amber-400" /> Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-amber-100/60 mb-4">Select a stage background for the entire application.</p>
              <div className="grid grid-cols-3 gap-3">
                {bgOptions.map((url, i) => (
                  <button 
                    key={i} 
                    onClick={() => setBackgroundUrl(url)}
                    className={`aspect-video rounded-lg border-2 transition-all overflow-hidden ${backgroundUrl === url ? 'border-amber-500' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  >
                    <img src={url} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings size={20} className="text-amber-400" /> System Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/30">
                <h5 className="font-bold text-red-400">End Semester Data</h5>
                <p className="text-xs opacity-70 mb-3">Reset participation and archive awards for the new semester.</p>
                <Button variant="destructive" size="sm" className="w-full">Reset All Participation</Button>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
                <Info size={16} className="text-amber-400" />
                <p className="text-[10px]">Chairman/Secretary/Treasurer permissions are active.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};