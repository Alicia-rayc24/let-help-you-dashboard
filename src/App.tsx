import { useState } from 'react';
import { useApp } from './context/AppContext';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import { Events } from './components/Events';
import { Media } from './components/Media';
import { Awards } from './components/Awards';
import { BibleStudy } from './components/BibleStudy';
import { Admin } from './components/Admin';
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  Image as ImageIcon, 
  Trophy, 
  BookOpen, 
  ShieldCheck, 
  LogOut,
  Menu,
  Bell
} from 'lucide-react';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

type View = 'dashboard' | 'profile' | 'events' | 'media' | 'awards' | 'biblestudy' | 'admin';

function App() {
  const { currentUser, setCurrentUser, backgroundUrl } = useApp();
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!currentUser) {
    return (
      <>
        <Login />
        <Toaster position="top-center" />
      </>
    );
  }

  const isAdmin = ['Chairperson', 'Secretary', 'Treasurer'].includes(currentUser.role);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'media', label: 'Gallery', icon: ImageIcon },
    { id: 'awards', label: 'Awards', icon: Trophy },
    { id: 'biblestudy', label: 'Bible Study', icon: BookOpen },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin Portal', icon: ShieldCheck }] : []),
  ];

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'profile': return <Profile />;
      case 'events': return <Events />;
      case 'media': return <Media />;
      case 'awards': return <Awards />;
      case 'biblestudy': return <BibleStudy />;
      case 'admin': return <Admin />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-fixed bg-cover bg-center font-sans transition-all duration-1000"
         style={{ backgroundImage: `url('${backgroundUrl}')` }}>
      <div className="min-h-screen bg-black/50 backdrop-blur-[2px] flex">
        
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside className={`
          fixed md:relative z-50 w-72 h-screen bg-black/60 backdrop-blur-xl border-r border-white/10
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-10 px-2">
              <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-amber-600/20">
                DT
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Daystar Theatre</h1>
                <p className="text-[10px] text-amber-500 uppercase font-bold tracking-[0.2em]">Arts & Drama</p>
              </div>
            </div>

            <nav className="flex-1 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id as View);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${activeView === item.id 
                      ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' 
                      : 'text-amber-100/60 hover:bg-white/5 hover:text-white'}
                  `}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="pt-6 border-t border-white/10">
              <button 
                onClick={() => setCurrentUser(null)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all font-medium"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 h-screen overflow-y-auto relative">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 bg-black/40 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg"
              >
                <Menu size={24} />
              </button>
              <h2 className="text-white font-bold hidden md:block capitalize">{activeView.replace('biblestudy', 'Bible Study')}</h2>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative text-amber-100/60 hover:text-white p-2 transition-colors">
                <Bell size={22} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full border-2 border-black/20"></span>
              </button>
              <div className="h-8 w-[1px] bg-white/10"></div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-white leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-amber-500/70 uppercase font-bold">{currentUser.role}</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden bg-amber-600/20 shadow-lg">
                  <img src={currentUser.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </header>

          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      <Toaster position="top-right" expand={true} richColors />
    </div>
  );
}

export default App;