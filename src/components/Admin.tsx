import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { UserPlus, Settings, Trash2, Edit, Calendar, Gift, Trophy, Palette, Info, Camera, User, CheckCircle2 } from 'lucide-react';
import { MemberRole, SchoolState, TheatreEvent, AwardType, Member, GroupType, PaymentStatus } from '../types';

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
    inactiveReason: false,
    photo: '',
    monthlyContribution: 0,
    weeklyChallenge: 0,
    semesterContribution: 0,
    yearlyContribution: 0,
    paymentStatus: 'pending' as PaymentStatus,
    groups: [] as GroupType[]
  });

  const availableGroups: GroupType[] = ['acting', 'pr', 'writing', 'bible study leader', 'director'];

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    description: '',
    type: 'meeting' as any,
    link: ''
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (editingMember) {
          setEditingMember({ ...editingMember, photo: base64String });
        } else {
          setNewMember({ ...newMember, photo: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.admissionNumber) return toast.error("Missing fields");
    addMember({
      ...newMember,
      id: Math.random().toString(36).substr(2, 9),
      participation: 0,
      points: 0,
      attendance: []
    });
    setNewMember({
      name: '',
      admissionNumber: '',
      password: '123',
      role: 'Member',
      schoolState: 'active',
      phone: '',
      dob: '',
      year: '1.1',
      inactiveReason: false,
      photo: '',
      monthlyContribution: 0,
      weeklyChallenge: 0,
      semesterContribution: 0,
      yearlyContribution: 0,
      paymentStatus: 'pending',
      groups: []
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

  const toggleGroup = (group: GroupType) => {
    if (editingMember) {
      const groups = editingMember.groups.includes(group)
        ? editingMember.groups.filter(g => g !== group)
        : [...editingMember.groups, group];
      setEditingMember({ ...editingMember, groups });
    } else {
      const groups = newMember.groups.includes(group)
        ? newMember.groups.filter(g => g !== group)
        : [...newMember.groups, group];
      setNewMember({ ...newMember, groups });
    }
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
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 bg-[#E3D5CA] p-1.5 rounded-xl">
          {['members', 'events', 'awards', 'settings'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`
                px-4 py-2 rounded-lg transition-all capitalize font-bold whitespace-nowrap
                ${activeTab === tab 
                  ? 'bg-green-700 text-white shadow-lg shadow-green-900/40' 
                  : 'text-slate-900 hover:bg-[#D5BDAF]'}
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'members' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => setShowAddMember(true)} className="bg-red-700 hover:bg-red-800 text-white shadow-lg shadow-red-900/20">
              <UserPlus size={18} className="mr-2" /> Register Cast
            </Button>
          </div>

          {(showAddMember || editingMember) && (
            <Card className="bg-slate-900/80 border-red-500/30 text-white">
              <CardHeader><CardTitle>{editingMember ? 'Edit Member' : 'Add New Member'}</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row items-center gap-6 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-red-500/50 flex items-center justify-center overflow-hidden shadow-lg shadow-red-500/20">
                      {(editingMember?.photo || newMember.photo) ? (
                        <img 
                          src={editingMember ? editingMember.photo : newMember.photo} 
                          className="w-full h-full object-cover" 
                          alt="Preview" 
                        />
                      ) : (
                        <User size={40} className="text-red-500/30" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 p-2 bg-red-700 rounded-full cursor-pointer shadow-lg hover:bg-red-600 transition-colors border-2 border-slate-900">
                      <Camera size={14} className="text-white" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h4 className="font-bold text-red-200">Profile Picture</h4>
                    <p className="text-xs text-white/50 mt-1">Upload a clear photo for the directory.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-3 pb-2 border-b border-white/10">
                    <h5 className="text-red-400 font-bold text-sm uppercase tracking-wider">Personal Information</h5>
                  </div>
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
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-red-500/70 ml-1">Date of Birth</label>
                    <Input 
                      type="date"
                      value={editingMember ? editingMember.dob : newMember.dob} 
                      onChange={e => editingMember ? setEditingMember({...editingMember, dob: e.target.value}) : setNewMember({...newMember, dob: e.target.value})} 
                      className="bg-white/5 border-white/20"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-red-500/70 ml-1">Academic Year</label>
                    <Input 
                      placeholder="e.g. 1.1, 2.2, Graduated" 
                      value={editingMember ? editingMember.year : newMember.year} 
                      onChange={e => editingMember ? setEditingMember({...editingMember, year: e.target.value}) : setNewMember({...newMember, year: e.target.value})} 
                      className="bg-white/5 border-white/20"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-red-500/70 ml-1">Role</label>
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
                  </div>

                  <div className="md:col-span-3 pb-2 border-b border-white/10 mt-4">
                    <h5 className="text-red-400 font-bold text-sm uppercase tracking-wider">Membership Details</h5>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-red-500/70 ml-1">Status</label>
                    <select 
                      value={editingMember ? editingMember.schoolState : newMember.schoolState} 
                      onChange={e => editingMember ? setEditingMember({...editingMember, schoolState: e.target.value as SchoolState}) : setNewMember({...newMember, schoolState: e.target.value as SchoolState})}
                      className="h-10 px-3 rounded-md bg-slate-800 border border-white/20 text-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="graduate">Graduate</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 px-3 mt-auto h-10 bg-white/5 border border-white/20 rounded-md">
                    <label className="text-xs text-white/60">Has Inactive Reason?</label>
                    <input 
                      type="checkbox"
                      checked={editingMember ? editingMember.inactiveReason : newMember.inactiveReason}
                      onChange={e => editingMember ? setEditingMember({...editingMember, inactiveReason: e.target.checked}) : setNewMember({...newMember, inactiveReason: e.target.checked})}
                    />
                  </div>

                  <div className="md:col-span-3 mt-4">
                    <label className="text-[10px] uppercase font-bold text-red-500/70 mb-2 block">Groups of Participation</label>
                    <div className="flex flex-wrap gap-2">
                      {availableGroups.map((group) => {
                        const isSelected = editingMember 
                          ? editingMember.groups.includes(group)
                          : newMember.groups.includes(group);
                        return (
                          <Button
                            key={group}
                            type="button"
                            variant={isSelected ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => toggleGroup(group)}
                            className={`rounded-full capitalize ${isSelected ? 'bg-red-700' : 'border-white/10 text-white/60 hover:text-white'}`}
                          >
                            {isSelected && <CheckCircle2 size={14} className="mr-1" />}
                            {group}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="md:col-span-3 pb-2 border-b border-white/10 mt-6">
                    <h5 className="text-red-400 font-bold text-sm uppercase tracking-wider">Financial & Payment Information</h5>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-red-500/70 ml-1">Monthly Contrib.</label>
                    <Input 
                      type="number"
                      placeholder="Monthly"
                      value={editingMember ? editingMember.monthlyContribution : newMember.monthlyContribution} 
                      onChange={e => editingMember ? setEditingMember({...editingMember, monthlyContribution: Number(e.target.value)}) : setNewMember({...newMember, monthlyContribution: Number(e.target.value)})} 
                      className="bg-white/5 border-white/20"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-red-500/70 ml-1">Weekly Challenge</label>
                    <Input 
                      type="number"
                      placeholder="Weekly"
                      value={editingMember ? editingMember.weeklyChallenge : newMember.weeklyChallenge} 
                      onChange={e => editingMember ? setEditingMember({...editingMember, weeklyChallenge: Number(e.target.value)}) : setNewMember({...newMember, weeklyChallenge: Number(e.target.value)})} 
                      className="bg-white/5 border-white/20"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-red-500/70 ml-1">Semester Contrib.</label>
                    <Input 
                      type="number"
                      placeholder="Semester"
                      value={editingMember ? editingMember.semesterContribution : newMember.semesterContribution} 
                      onChange={e => editingMember ? setEditingMember({...editingMember, semesterContribution: Number(e.target.value)}) : setNewMember({...newMember, semesterContribution: Number(e.target.value)})} 
                      className="bg-white/5 border-white/20"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-red-500/70 ml-1">Yearly Contrib.</label>
                    <Input 
                      type="number"
                      placeholder="Yearly"
                      value={editingMember ? editingMember.yearlyContribution : newMember.yearlyContribution} 
                      onChange={e => editingMember ? setEditingMember({...editingMember, yearlyContribution: Number(e.target.value)}) : setNewMember({...newMember, yearlyContribution: Number(e.target.value)})} 
                      className="bg-white/5 border-white/20"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-red-500/70 ml-1">Payment Status</label>
                    <select 
                      value={editingMember ? editingMember.paymentStatus : newMember.paymentStatus} 
                      onChange={e => editingMember ? setEditingMember({...editingMember, paymentStatus: e.target.value as PaymentStatus}) : setNewMember({...newMember, paymentStatus: e.target.value as PaymentStatus})}
                      className="h-10 px-3 rounded-md bg-slate-800 border border-white/20 text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="partial">Partial</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <Button variant="outline" onClick={() => { setShowAddMember(false); setEditingMember(null); }}>Cancel</Button>
                  <Button onClick={editingMember ? handleUpdateMember : handleAddMember} className="bg-red-700 px-8 text-white shadow-lg shadow-red-900/20">
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
                    <TableHead className="text-red-200 font-bold w-12"></TableHead>
                    <TableHead className="text-red-200 font-bold">Name</TableHead>
                    <TableHead className="text-red-200 font-bold">Adm No</TableHead>
                    <TableHead className="text-red-200 font-bold">Groups</TableHead>
                    <TableHead className="text-red-200 font-bold">State</TableHead>
                    <TableHead className="text-red-200 font-bold">Payment</TableHead>
                    <TableHead className="text-right text-red-200 font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map(member => (
                    <TableRow key={member.id} className="border-white/5 hover:bg-white/5 transition-colors">
                      <TableCell>
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-white/5">
                          {member.photo ? (
                            <img src={member.photo} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-white/20">
                              <User size={12} />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>{member.name}</div>
                        <div className="text-[10px] text-white/40">Year {member.year}</div>
                      </TableCell>
                      <TableCell>{member.admissionNumber}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {member.groups.length > 0 ? member.groups.slice(0, 2).map(g => (
                            <Badge key={g} variant="secondary" className="bg-white/5 text-[9px] h-4">{g}</Badge>
                          )) : <span className="text-[10px] text-white/30">None</span>}
                          {member.groups.length > 2 && <span className="text-[10px] text-white/30">+{member.groups.length - 2}</span>}
                        </div>
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
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <Badge variant="outline" className={`text-[9px] h-4 ${
                            member.paymentStatus === 'paid' ? 'border-green-500/50 text-green-400' : 
                            member.paymentStatus === 'partial' ? 'border-amber-500/50 text-amber-400' : 
                            'border-red-500/50 text-red-400'
                          }`}>
                            {member.paymentStatus}
                          </Badge>
                          <span className="text-[10px] text-red-100/60">{getTargetDues(member)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 hover:bg-white/10 text-red-400"
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
            <Button onClick={() => setShowAddEvent(true)} className="bg-red-700 hover:bg-red-800 text-white shadow-lg shadow-red-900/20">
              <Calendar size={18} className="mr-2" /> Schedule Event
            </Button>
          </div>

          {showAddEvent && (
            <Card className="bg-slate-900/80 border-red-500/30 text-white">
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
                  <Button onClick={handleAddEvent} className="bg-red-700 hover:bg-red-800 text-white shadow-lg shadow-red-900/20">Publish Event</Button>
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
                    <p className="text-xs text-red-100/60">{new Date(event.date).toLocaleString()}</p>
                    <p className="text-sm mt-2 opacity-80">{event.description}</p>
                  </div>
                  <Badge className="bg-red-700">{event.type}</Badge>
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
              <p className="text-sm text-red-100/60 mb-6">Open voting for specific categories. Members will see these in their Awards section.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[ 
                  'best actor', 'best performer loved by audience', 
                  'most active members', 'most disciplined', 
                  'best leader', 'best director'
                ].map((type) => (
                  <Button 
                    key={type} 
                    variant="outline" 
                    className="border-red-500/20 text-red-100 h-auto py-4 flex flex-col gap-2 hover:bg-red-600/20"
                    onClick={() => handleAddAward(type as AwardType)}
                  >
                    <Trophy size={20} className="text-red-500" />
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
                <Palette size={20} className="text-red-400" /> Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-100/60 mb-4">Select a stage background for the entire application.</p>
              <div className="grid grid-cols-3 gap-3">
                {bgOptions.map((url, i) => (
                  <button 
                    key={i} 
                    onClick={() => setBackgroundUrl(url)}
                    className={`aspect-video rounded-lg border-2 transition-all overflow-hidden ${backgroundUrl === url ? 'border-red-500' : 'border-transparent opacity-50 hover:opacity-100'}`}
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
                <Settings size={20} className="text-red-400" /> System Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/30">
                <h5 className="font-bold text-red-400">End Semester Data</h5>
                <p className="text-xs opacity-70 mb-3">Reset participation and archive awards for the new semester.</p>
                <Button variant="destructive" size="sm" className="w-full">Reset All Participation</Button>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
                <Info size={16} className="text-red-400" />
                <p className="text-[10px]">Chairman/Secretary/Treasurer permissions are active.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};