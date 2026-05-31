import { motion } from 'motion/react';
import { IdolCard } from '../types';
import { NFTCard } from './Card';
import { Search, Filter } from 'lucide-react';

interface CollectionProps {
  cards: IdolCard[];
}

export function Collection({ cards }: CollectionProps) {
  // Use more cards for the collection view
  const displayCards = [
    ...cards,
    ...cards.map(c => ({...c, id: c.id + '_2', level: 1})),
    ...cards.map(c => ({...c, id: c.id + '_3', level: 10})),
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full h-full flex flex-col p-8 overflow-hidden relative z-10"
    >
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none text-white">My Collection</h2>
          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider bg-cyan-900/40 border border-cyan-500/30 px-2 py-0.5 rounded backdrop-blur-sm mt-2 inline-block">
            {displayCards.length} / 250 CARDS
          </span>
        </div>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
            <Search size={16} className="text-gray-400" />
            <input type="text" placeholder="Search Idols..." className="bg-transparent border-none text-sm font-mono text-white placeholder-gray-500 focus:outline-none w-48" />
          </div>
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full px-4 py-2 transition-colors">
            <Filter size={16} className="text-gray-400" />
            <span className="text-xs uppercase font-bold tracking-widest text-gray-300">Filter</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 pb-12 custom-scrollbar">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {displayCards.map((card, idx) => (
            <motion.div 
              key={card.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <NFTCard card={card} isInteractive={true} />
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </motion.div>
  );
}
