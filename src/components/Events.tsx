import { motion } from 'motion/react';
import { Calendar, Award, ArrowRight } from 'lucide-react';

export function Events() {
  const events = [
    {
      id: 1,
      title: "Neon Comeback Tour",
      status: "Active",
      timeLeft: "04 Days : 12 Hrs",
      desc: "Battle in the Tokyo Dome Arena to earn exclusive $IDOL rewards and unlock Limited Edition Stage Outfits for your top performers.",
      image: "https://images.unsplash.com/photo-1549213783-8284d0336c4f?q=80&w=1000",
      color: "from-pink-600 to-purple-600",
      accent: "text-pink-400"
    },
    {
      id: 2,
      title: "Summer Solstice Festival",
      status: "Upcoming",
      timeLeft: "Starts in 2 Days",
      desc: "Prepare your Summer-element cards. The Solstice Festival will feature 2x Experience and rare drops in the special event arena.",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000",
      color: "from-cyan-600 to-blue-800",
      accent: "text-cyan-400"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-5xl mx-auto h-full flex flex-col p-8 z-10"
    >
      <div className="mb-8 flex items-center gap-3">
        <Calendar size={32} className="text-purple-400" />
        <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none text-glow-purple text-white mt-1">Live Events</h2>
      </div>

      <div className="flex flex-col gap-6 overflow-y-auto pr-4 pb-12 custom-scrollbar">
        {events.map((evt) => (
          <div key={evt.id} className="relative w-full rounded-[30px] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl flex flex-col md:flex-row group">
            
            {/* Image Area */}
            <div className="w-full md:w-1/3 h-48 md:h-auto relative overflow-hidden">
               <div className={`absolute inset-0 bg-gradient-to-r ${evt.color} mix-blend-multiply opacity-60 z-10`}></div>
               <div className="absolute inset-0 bg-black/20 z-10"></div>
               <img src={evt.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={evt.title} />
               
               <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/20">
                 <span className={`text-[10px] font-black tracking-widest uppercase ${evt.accent}`}>{evt.status}</span>
               </div>
            </div>

            {/* Content Area */}
            <div className="w-full md:w-2/3 p-8 flex flex-col justify-center relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-black italic tracking-tight uppercase text-white">{evt.title}</h3>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded border border-white/5">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Time</span>
                  <span className={`text-xs font-mono font-bold ${evt.accent}`}>{evt.timeLeft}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-300 leading-relaxed max-w-lg mb-8">{evt.desc}</p>
              
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Award size={16} className="text-yellow-400" />
                   <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Rewards: SR Cards, Tokens</span>
                </div>
                
                <button className={`px-8 py-3 bg-gradient-to-r ${evt.color} rounded-full font-black uppercase text-xs tracking-widest border border-white/20 flex items-center gap-2 hover:opacity-90 transition-opacity`}>
                   Join Event <ArrowRight size={14} />
                </button>
              </div>
            </div>
            
          </div>
        ))}
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
      `}</style>
    </motion.div>
  );
}
