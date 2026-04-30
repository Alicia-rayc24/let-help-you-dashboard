import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login = () => {
  const { members, setCurrentUser } = useApp();
  const [admNo, setAdmNo] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = members.find(m => m.admissionNumber === admNo && m.password === password);
    if (user) {
      setCurrentUser(user);
      toast.success(`Welcome back, ${user.name}!`);
    } else {
      toast.error("Invalid Admission Number or Password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-fixed bg-cover bg-center px-4" 
         style={{ backgroundImage: `url('https://storage.googleapis.com/dala-prod-public-storage/generated-images/a74bbf3b-8735-48f0-9c68-95390a794e32/theatre-stage-background-9947acad-1777525938145.webp')` }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-md border-amber-500/20 shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mb-4">
              <LogIn className="text-white w-8 h-8" />
            </div>
            <CardTitle className="text-3xl font-bold text-amber-900">Daystar Theatre of Arts</CardTitle>
            <p className="text-amber-700/70">Enter your credentials to access the stage</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-amber-900">Admission Number</label>
                <Input 
                  value={admNo} 
                  onChange={e => setAdmNo(e.target.value)} 
                  placeholder="e.g., 24-2733"
                  className="bg-white/50 border-amber-200 focus:border-amber-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-amber-900">Password</label>
                <Input 
                  type="password"
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  className="bg-white/50 border-amber-200 focus:border-amber-500"
                />
              </div>
              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-6">
                Enter Stage
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};