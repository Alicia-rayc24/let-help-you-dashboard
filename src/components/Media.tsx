import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ImageIcon, Video, Link, Plus, Search, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const Media = () => {
  const { media, addMedia, currentUser } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [newItem, setNewItem] = useState({
    title: '',
    url: '',
    type: 'photo' as 'photo' | 'video'
  });

  if (!currentUser) return null;

  const handleAdd = () => {
    if (!newItem.title || !newItem.url) return toast.error("Please fill all fields");
    addMedia({
      id: Math.random().toString(36).substr(2, 9),
      ...newItem,
      addedBy: currentUser.name
    });
    setShowAdd(false);
    setNewItem({ title: '', url: '', type: 'photo' });
    toast.success("Media shared with the group!");
  };

  const filteredMedia = media.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Backstage Gallery</h2>
          <p className="text-amber-100/60">Photos and videos from our latest performances</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <Input 
              placeholder="Search gallery..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="pl-10 bg-white/10 border-white/20 text-white w-64"
            />
          </div>
          <Button onClick={() => setShowAdd(!showAdd)} className="bg-amber-600">
            <Plus size={18} className="mr-2" /> Share Media
          </Button>
        </div>
      </header>

      {showAdd && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
          <Card className="bg-slate-900/80 border-amber-500/30 text-white">
            <CardContent className="p-6 grid md:grid-cols-4 gap-4">
              <Input 
                placeholder="Title / Event Name" 
                value={newItem.title} 
                onChange={e => setNewItem({...newItem, title: e.target.value})} 
                className="bg-white/5 border-white/20"
              />
              <Input 
                placeholder="Image or Video Link URL" 
                value={newItem.url} 
                onChange={e => setNewItem({...newItem, url: e.target.value})} 
                className="bg-white/5 border-white/20"
              />
              <select 
                value={newItem.type} 
                onChange={e => setNewItem({...newItem, type: e.target.value as any})}
                className="h-10 px-3 rounded-md bg-slate-800 border border-white/20 text-white"
              >
                <option value="photo">Photo</option>
                <option value="video">Video / Link</option>
              </select>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowAdd(false)} className="flex-1">Cancel</Button>
                <Button onClick={handleAdd} className="bg-amber-600 flex-1">Share</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMedia.length > 0 ? filteredMedia.map((item, i) => (
          <motion.div 
            key={item.id} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.05 }}
            className="group relative aspect-video rounded-xl overflow-hidden bg-slate-800 border border-white/10"
          >
            {item.type === 'photo' ? (
              <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900">
                <Video size={40} className="text-amber-500 mb-2" />
                <p className="text-[10px] text-white/60">Video Resource</p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
              <p className="text-white font-bold text-sm">{item.title}</p>
              <p className="text-[10px] text-amber-400">By {item.addedBy}</p>
              <a href={item.url} target="_blank" rel="noreferrer" className="mt-2 text-xs flex items-center gap-1 text-white/80 hover:text-white">
                <ExternalLink size={12} /> Open Original
              </a>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full py-20 text-center">
            <ImageIcon size={48} className="mx-auto text-white/20 mb-4" />
            <p className="text-white/40 italic">The gallery is empty. Be the first to share a memory!</p>
          </div>
        )}
      </div>

      <Card className="bg-amber-600/10 border-amber-500/30 text-white">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 bg-amber-600 rounded-full">
            <Link className="text-white" />
          </div>
          <div>
            <h4 className="font-bold">Resource Sharing</h4>
            <p className="text-sm text-amber-100/60">All members can add public links to performance footage and rehearsal photos.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};