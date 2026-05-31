import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Shield, Sword, Star, Sparkles, Heart } from 'lucide-react';
import { IdolCard } from '../types';

interface IdolCardProps {
  card: IdolCard;
  isInteractive?: boolean;
  className?: string;
  onClick?: () => void;
}

export function NFTCard({ card, isInteractive = true, className = '', onClick }: IdolCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  
  // Mouse position values for 3D tilt effect
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [0, 1], [15, -15]);
  const rotateY = useTransform(springX, [0, 1], [-15, 15]);
  
  // Holographic glare effect follow mouse
  const glareX = useTransform(springX, [0, 1], [-20, 120]);
  const glareY = useTransform(springY, [0, 1], [-20, 120]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isInteractive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    if (isInteractive) setHovered(true);
  };

  const handleMouseLeave = () => {
    if (isInteractive) {
      setHovered(false);
      mouseX.set(0.5);
      mouseY.set(0.5);
    }
  };

  const getRarityColors = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'from-pink-500 via-cyan-400 to-yellow-500';
      case 'Epic': return 'from-purple-600 to-pink-500';
      case 'Rare': return 'from-blue-500 to-cyan-400';
      case 'Special Edition': return 'from-rose-500 via-pink-400 to-orange-400';
      default: return 'from-gray-500 to-slate-400';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'shadow-[0_0_40px_rgba(219,39,119,0.3)]';
      case 'Special Edition': return 'shadow-[0_0_30px_rgba(255,42,133,0.6)]';
      default: return 'shadow-xl';
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative rounded-2xl cursor-pointer perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        width: '100%',
        aspectRatio: '63/88', // Standard trading card ratio
        transformStyle: 'preserve-3d',
        rotateX: isInteractive ? rotateX : 0,
        rotateY: isInteractive ? rotateY : 0,
      }}
      whileHover={isInteractive ? { scale: 1.05, zIndex: 50 } : {}}
      transition={{ duration: 0.3 }}
    >
      {/* Card Border/Frame */}
      <div className={`absolute inset-0 rounded-[28px] p-[2px] bg-gradient-to-br ${getRarityColors(card.rarity)} ${getRarityGlow(card.rarity)} z-0 overflow-hidden`}>
        {/* Holographic shifting border background */}
        <div className="absolute inset-0 opacity-50 holo-foil mix-blend-overlay pointer-events-none"></div>
      </div>
      
      {/* Inner Card Content */}
      <div className="absolute inset-[2px] rounded-[26px] bg-[#121218] overflow-hidden z-10 flex flex-col group border border-white/10">
        
        {/* Idol Art */}
        <div className="relative h-[60%] w-full overflow-hidden bg-gray-900 border-b border-white/5">
          <img 
            src={card.imageUrl} 
            alt={card.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121218] via-transparent to-transparent z-10"></div>
          {/* Rarity Tag */}
          <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-yellow-500/50">
            <span className="text-[10px] font-black tracking-widest text-yellow-500 uppercase">{card.rarity}</span>
          </div>
        </div>

        {/* Glare effect */}
        {isInteractive && hovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-20 mix-blend-color-dodge mix-blend-overlay opacity-40 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.8) 0%, transparent 40%)`,
            }}
          />
        )}

        {/* Diagonal Holo Sheen for Rare+ cards */}
        {(card.rarity === 'Legendary' || card.rarity === 'Special Edition') && (
            <div className="absolute inset-0 pointer-events-none z-20 holo-foil opacity-30 mix-blend-screen mix-blend-overlay"></div>
        )}

        {/* Card Data UI */}
        <div className="relative z-30 p-4 sm:p-5 flex flex-col h-[40%] flex-1">
          
          <div className="mb-4">
             <h3 className="text-xl sm:text-2xl font-black italic tracking-tighter uppercase leading-none text-white">{card.name}</h3>
             <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">The Starlight Vanguard</span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-5 gap-2 mt-auto pb-2">
            <StatBox icon={<Sword size={12} />} value={card.stats.attack} label="ATK" />
            <StatBox icon={<Shield size={12} />} value={card.stats.defense} label="DEF" />
            <StatBox icon={<Heart size={12} />} value={card.stats.charm} label="CHR" />
            <StatBox icon={<Sparkles size={12} />} value={card.stats.stagePresence} label="PRS" />
            <StatBox icon={<Star size={12} />} value={card.stats.fanPower} label="FAN" />
          </div>
        </div>

      </div>
    </motion.div>
  );
}

function StatBox({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  const colorClass = label === 'ATK' ? 'text-pink-400' : label === 'CHR' ? 'text-cyan-400' : label === 'FAN' ? 'text-yellow-400' : 'text-white';
  
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1 mb-1">
        <span className="opacity-70 scale-75 hidden sm:block text-gray-500">{icon}</span>
        <span className="text-[8px] uppercase text-gray-500 font-bold">{label}</span>
      </div>
      <div className={`w-full h-8 flex items-center justify-center bg-white/5 rounded border border-white/5 font-mono text-xs sm:text-sm font-bold ${colorClass}`}>
        {value}
      </div>
    </div>
  );
}
