import React from 'react';
import { 
  Calendar, 
  Users, 
  LogOut, 
  Home,
  LayoutDashboard,
  Settings,
  Bell,
  ArrowRight
} from 'lucide-react';

const ReceptionSidebar = ({ activeTab, setActiveTab, onLogout, adminName = "Admin" }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Panel Główny', icon: LayoutDashboard },
    { id: 'calendar', label: 'Kalendarz', icon: Calendar },
    { id: 'guests', label: 'Lista Gości', icon: Users },
    { id: 'rooms', label: 'Pokoje', icon: Home },
  ];

  return (
    <aside className="w-full md:w-72 bg-white border-r border-brand-anthracite/10 flex flex-col justify-between h-screen sticky top-0 z-50">
      <div className="p-10 flex-1 flex flex-col">
        {/* Logo Section */}
        <div className="mb-16">
          <div className="flex flex-col group cursor-pointer" onClick={() => window.location.href = '/'}>
            <span className="text-3xl font-serif tracking-[0.2em] uppercase text-brand-anthracite group-hover:text-brand-gold transition-colors duration-500">Gala</span>
            <div className="flex items-center space-x-2 mt-1">
               <div className="w-8 h-[1px] bg-brand-gold" />
               <span className="text-[8px] tracking-[0.5em] uppercase text-brand-anthracite/40 font-bold">Reception</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-12 flex-1">
          <div className="space-y-4">
            <p className="text-[9px] uppercase tracking-[0.6em] text-brand-anthracite/30 font-bold ml-1">Zarządzanie</p>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center justify-between p-4 transition-all cursor-pointer group border-l-2 ${
                    activeTab === item.id 
                    ? 'bg-brand-off-white/50 text-brand-anthracite border-brand-gold' 
                    : 'text-brand-anthracite/50 hover:bg-brand-off-white/30 border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <item.icon size={18} className={activeTab === item.id ? 'text-brand-gold' : 'group-hover:text-brand-gold transition-colors'} />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{item.label}</span>
                  </div>
                  {activeTab === item.id && <ArrowRight size={12} className="text-brand-gold" />}
                </div>
              ))}
            </div>
          </div>

        </nav>
      </div>

      {/* User & Logout */}
      <div className="p-8 border-t border-brand-anthracite/10 bg-brand-off-white/20">
        <div className="flex items-center space-x-4 mb-6">
           <div className="w-10 h-10 bg-brand-anthracite text-white flex items-center justify-center font-serif italic text-lg">
             {adminName[0]}
           </div>
           <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-anthracite">{adminName}</p>
              <p className="text-[8px] uppercase tracking-[0.3em] text-brand-gold font-bold">System Administrator</p>
           </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-3 p-4 bg-brand-anthracite text-white hover:bg-brand-gold transition-all group"
        >
          <LogOut size={16} />
          <span className="text-[9px] uppercase tracking-[0.4em] font-bold">Wyloguj Się</span>
        </button>
      </div>
    </aside>
  );
};

export default ReceptionSidebar;
