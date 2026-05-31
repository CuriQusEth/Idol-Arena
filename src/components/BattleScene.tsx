import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { NFTCard } from './Card';
import { IdolCard } from '../types';
import { Shield, Sparkles, Zap, Flame, UserCircle2 } from 'lucide-react';

interface BattleSceneProps {
  playerCard: IdolCard;
  opponentCard: IdolCard;
  onRetreat: () => void;
}

export function BattleScene({ playerCard, opponentCard, onRetreat }: BattleSceneProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 bg-black flex flex-col overflow-hidden"
    >
      {/* Background Concert Arena Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/src/assets/images/concert_arena_1780249428396.png" 
          alt="Battle Arena" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50"></div>
      </div>

      {/* Battle UI HUD */}
      <div className="relative z-10 flex-1 flex flex-col justify-between p-8">
        
        {/* Top HUD - VS and Escaping */}
        <div className="flex justify-between items-start">
          <button 
            onClick={onRetreat}
            className="px-6 py-2 bg-black/50 backdrop-blur border border-white/20 rounded-full font-mono text-sm text-gray-300 hover:text-white hover:border-white/50 transition-colors"
          >
            &lt; Retreat
          </button>
          
          <div className="flex items-center gap-8 bg-black/60 backdrop-blur-xl px-12 py-4 rounded-3xl border border-white/10 border-t-white/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
             <div className="flex flex-col items-center">
                <span className="font-mono text-xs text-blue-400 font-bold tracking-widest mb-1">PLAYER</span>
                <span className="font-display text-xl font-bold text-white">LUNA ECLIPSE</span>
             </div>
             
             <div className="mx-6 relative">
               <div className="absolute inset-0 bg-[var(--color-neon-pink)] blur-[20px] opacity-70"></div>
               <span className="font-display font-black text-4xl italic text-transparent bg-clip-text bg-gradient-to-br from-white to-[var(--color-neon-pink)] relative z-10">VS</span>
             </div>

             <div className="flex flex-col items-center">
                <span className="font-mono text-xs text-[var(--color-neon-pink)] font-bold tracking-widest mb-1">OPPONENT</span>
                <span className="font-display text-xl font-bold text-white">CELESTIAL KNIGHT</span>
             </div>
          </div>

          <div className="w-24"></div> {/* Spacer for balance */}
        </div>

        {/* Combat Area */}
        <div className="flex-1 flex items-center justify-center gap-24 relative mt-12">
           
           {/* Player Card Container */}
           <motion.div 
             initial={{ x: -200, opacity: 0, rotateY: 30 }}
             animate={{ x: 0, opacity: 1, rotateY: 0 }}
             transition={{ type: 'spring', damping: 15, delay: 0.2 }}
             className="relative flex flex-col items-center"
           >
              <div className="w-80 relative z-20">
                <NFTCard card={playerCard} isInteractive={false} />
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute inset-0 border-2 border-cyan-400 rounded-2xl glow-box-cyan z-30 pointer-events-none"
                ></motion.div>
              </div>
              <div className="absolute -bottom-16 w-64 h-16 bg-cyan-500/30 blur-[40px] rounded-[100%]"></div>
              
              {/* Player Status Card */}
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 bg-black/80 border border-cyan-500/40 p-4 rounded-xl backdrop-blur-md flex flex-col gap-3">
                 <div className="flex flex-col gap-1">
                   <span className="text-[10px] text-cyan-400 font-mono">ENERGY</span>
                   <div className="flex gap-1">
                     <div className="w-3 h-6 bg-cyan-400 rounded-sm"></div>
                     <div className="w-3 h-6 bg-cyan-400 rounded-sm"></div>
                     <div className="w-3 h-6 bg-cyan-400 rounded-sm"></div>
                     <div className="w-3 h-6 bg-gray-800 rounded-sm"></div>
                   </div>
                 </div>
              </div>
           </motion.div>

           {/* VS Indicator Center */}
           <div className="relative z-10 flex flex-col items-center mt-32">
             <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-32 h-32 rounded-full border border-pink-500/30 bg-black/50 flex items-center justify-center backdrop-blur shadow-[0_0_50px_rgba(255,42,133,0.3)]"
             >
               <Zap className="text-pink-500 w-12 h-12" />
             </motion.div>
           </div>

           {/* Opponent Card Container */}
           <motion.div 
             initial={{ x: 200, opacity: 0, rotateY: -30 }}
             animate={{ x: 0, opacity: 1, rotateY: 0 }}
             transition={{ type: 'spring', damping: 15, delay: 0.4 }}
             className="relative flex flex-col items-center"
           >
              <div className="w-80 relative z-20">
                 <NFTCard card={opponentCard} isInteractive={false} />
                 {/* Opponent defense shield effect */}
                 <div className="absolute inset-[-20px] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNTUwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMCwgMTUwLCAyNTUsIDAuMykiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWRhc2hhcnJheT0iMiAxMCIvPjwvc3ZnPg==')] opacity-50 z-30 animate-[spin_60s_linear_infinite] rounded-3xl pointer-events-none"></div>
              </div>
              <div className="absolute -bottom-16 w-64 h-16 bg-blue-500/30 blur-[40px] rounded-[100%]"></div>
           </motion.div>
        
        </div>

        {/* Action Bar Bottom */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-6 pb-4"
        >
          <BattleCommandButton icon={<Flame />} label="Vocal Burst" color="pink" />
          <BattleCommandButton icon={<Sparkles />} label="Dance Break" color="cyan" />
          <BattleCommandButton icon={<Shield />} label="Aegis Pose" color="blue" />
          <BattleCommandButton icon={<UserCircle2 />} label="Charm Charm" color="purple" />
        </motion.div>

      </div>
    </motion.div>
  );
}

function BattleCommandButton({ icon, label, color }: { icon: ReactNode; label: string; color: 'pink' | 'cyan' | 'blue' | 'purple' }) {
  
  const colors = {
    pink: 'from-[var(--color-neon-pink)] to-rose-600 shadow-[0_0_20px_rgba(255,42,133,0.4)]',
    cyan: 'from-cyan-400 to-blue-500 shadow-[0_0_20px_rgba(0,240,255,0.4)]',
    blue: 'from-blue-600 to-indigo-700 shadow-[0_0_20px_rgba(37,99,235,0.4)]',
    purple: 'from-[var(--color-neon-purple)] to-purple-800 shadow-[0_0_20px_rgba(176,38,255,0.4)]',
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className={`group relative flex flex-col items-center justify-center w-36 h-36 rounded-2xl bg-gradient-to-br ${colors[color]} border border-white/20 overflow-hidden`}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-white/0 group-hover:bg-white/10 transition-colors z-10"></div>
      {/* Glare line */}
      <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 transform bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
      
      <div className="relative z-20 text-white mb-3 bg-black/20 p-3 rounded-full backdrop-blur-sm group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="relative z-20 font-display font-bold text-white text-sm tracking-wide">{label}</span>
      <span className="relative z-20 font-mono text-[10px] bg-black/40 px-2 py-0.5 rounded mt-2 text-gray-200">2 ENERGY</span>
    </motion.button>
  );
}
