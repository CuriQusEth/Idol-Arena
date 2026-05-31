import { motion } from 'motion/react';
import { Play, Grid, ShoppingCart, Calendar, Layers, ShieldAlert, ZapIcon } from 'lucide-react';
import { ViewState } from '../types';

interface MenuProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

export function MainMenu({ currentView, onViewChange }: MenuProps) {
  
  const menuItems: { id: ViewState; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'Battle', label: 'Play Battle', icon: <Play size={24} />, color: 'from-[var(--color-neon-pink)] to-rose-600' },
    { id: 'Collection', label: 'My Collection', icon: <Grid size={24} />, color: 'from-cyan-400 to-blue-600' },
    { id: 'Events', label: 'Events', icon: <Calendar size={24} />, color: 'from-[var(--color-neon-purple)] to-purple-800' },
    { id: 'MainMenu', label: 'My Deck', icon: <Layers size={24} />, color: 'from-amber-400 to-orange-600' },
    { id: 'Shop', label: 'Shop', icon: <ShoppingCart size={24} />, color: 'from-emerald-400 to-teal-600' },
  ];

  return (
    <nav className="w-20 sm:w-24 shrink-0 flex flex-col items-center py-6 sm:py-8 gap-8 border-r border-white/5 bg-black/20 z-20 overflow-y-auto">
      
      <div className="flex flex-col items-center text-center pb-4 border-b border-white/10 px-2 mt-4">
         <img src="/src/assets/images/logo_icon_1780249460111.png" alt="Icon" className="w-10 h-10 rounded-lg object-cover mb-2" />
      </div>

      <div className="flex flex-col gap-6 w-full items-center">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`group flex flex-col items-center gap-1 transition-opacity ${isActive ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
            >
              <div className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
                 isActive 
                   ? 'bg-pink-500/20 border border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.3)] text-pink-500' 
                   : 'hover:bg-white/5 text-white'
              }`}>
                {item.icon}
              </div>
              <span className={`text-[9px] uppercase font-bold tracking-tighter text-center ${isActive ? 'text-pink-500' : 'text-gray-400 group-hover:text-white'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto flex flex-col items-center gap-2 opacity-60">
         <div className="w-10 h-10 flex items-center justify-center">
            <ZapIcon size={16} className="text-purple-400" />
         </div>
         <div className="flex flex-col text-center">
           <span className="text-[8px] uppercase font-bold tracking-tighter text-gray-400">Stamina</span>
           <span className="text-[10px] font-mono font-bold text-white">45/100</span>
         </div>
      </div>
    </nav>
  );
}
