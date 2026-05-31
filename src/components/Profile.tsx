import { motion } from 'motion/react';
import { useAccount, useReadContract, useConnect } from 'wagmi';
import { IDOL_ARENA_NFT_ADDRESS, IDOL_ARENA_NFT_ABI } from '../contracts';
import { Trophy, Star, Target, ScrollText, User } from 'lucide-react';
import { config } from '../wagmi';

export function Profile() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();

  const { data: nftBalance } = useReadContract({
    address: IDOL_ARENA_NFT_ADDRESS as `0x${string}`,
    abi: IDOL_ARENA_NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const handleConnect = () => {
    const rabbyConnector = config.connectors.find(c => c.name.toLowerCase().includes('rabby'));
    if (rabbyConnector) {
      connect({ connector: rabbyConnector });
    } else {
      const fallback = config.connectors.find(c => c.name === 'MetaMask') ?? config.connectors[0];
      if (fallback) connect({ connector: fallback });
    }
  };

  const battleHistory = [
    { id: 1, opponent: 'Neon Samurai', result: 'WIN', score: '+45 Rank Points', date: '2 Mins Ago', color: 'text-green-400' },
    { id: 2, opponent: 'Cyber Diva', result: 'LOSS', score: '-12 Rank Points', date: '1 Hour Ago', color: 'text-red-400' },
    { id: 3, opponent: 'Void Walker', result: 'WIN', score: '+50 Rank Points', date: '3 Hours Ago', color: 'text-green-400' },
    { id: 4, opponent: 'Stellar Unit', result: 'WIN', score: '+35 Rank Points', date: 'Yesterday', color: 'text-green-400' },
    { id: 5, opponent: 'Alpha Centauri', result: 'LOSS', score: '-10 Rank Points', date: 'Yesterday', color: 'text-red-400' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-4xl mx-auto h-full flex flex-col p-4 md:p-8 overflow-y-auto custom-scrollbar relative z-10"
    >
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Profile Card */}
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 w-full md:w-1/3 flex flex-col items-center shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 w-full h-32 bg-gradient-to-br from-pink-500/20 to-purple-600/20"></div>
           
           <div className="relative z-10 mt-8 w-32 h-32 rounded-full border-4 border-black bg-gradient-to-br from-cyan-400 to-pink-500 p-1 mb-6 shadow-xl">
             <div className="w-full h-full bg-gray-900 rounded-full overflow-hidden flex items-center justify-center">
                {isConnected ? (
                  <img src={`https://ui-avatars.com/api/?name=${address}&background=random&size=200`} alt="Avatar" />
                ) : (
                  <User size={48} className="text-gray-500" />
                )}
             </div>
           </div>

           <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-2 leading-none">
             {isConnected ? `Player_${address?.slice(-4)}` : 'Guest User'}
           </h2>
           
           {isConnected ? (
             <div className="bg-white/10 rounded-full px-4 py-1 text-xs font-mono text-cyan-400 border border-cyan-500/30 mb-8">
               {address?.slice(0, 6)}...{address?.slice(-4)}
             </div>
           ) : (
             <button onClick={handleConnect} className="mb-8 mt-2 text-xs uppercase font-bold tracking-widest text-pink-500 bg-pink-500/10 px-4 py-2 rounded-full hover:bg-pink-500/20 transition-colors">
               Connect Rabby
             </button>
           )}

           <div className="w-full grid grid-cols-2 gap-4 mt-auto">
             <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
               <div className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">Level</div>
               <div className="text-xl font-black font-mono text-white">42</div>
             </div>
             <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
               <div className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">Collection</div>
               <div className="text-xl font-black font-mono text-pink-400">{nftBalance !== undefined ? Number(nftBalance) : '0'}</div>
             </div>
           </div>
        </div>

        {/* Stats & History Area */}
        <div className="w-full md:w-2/3 flex flex-col gap-8">
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
             <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-[24px]">
               <Trophy className="text-yellow-400 mb-3" size={24} />
               <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Battles</div>
               <div className="text-3xl font-black font-mono text-white">128</div>
             </div>
             <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-[24px]">
               <Target className="text-cyan-400 mb-3" size={24} />
               <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Win Rate</div>
               <div className="text-3xl font-black font-mono text-white">67%</div>
             </div>
             <div className="bg-gradient-to-br from-pink-600 to-purple-800 border border-pink-500/50 p-6 rounded-[24px] lg:col-span-1 col-span-2 relative overflow-hidden">
               <Star className="text-white/20 absolute -right-2 -bottom-2 w-24 h-24" />
               <div className="relative z-10">
                 <div className="text-white mb-2"><Star size={20} fill="currentColor" /></div>
                 <div className="text-[10px] font-bold text-pink-200 uppercase tracking-widest mb-1">Best Idol Card</div>
                 <div className="text-xl font-black italic uppercase text-white truncate">STELLAR UNIT</div>
               </div>
             </div>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 flex-1 flex flex-col">
             <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                <ScrollText className="text-purple-400" size={20} />
                <h3 className="font-bold text-lg text-white uppercase tracking-widest italic">Recent Battles</h3>
             </div>
             
             {!isConnected ? (
               <div className="flex-1 flex items-center justify-center text-sm font-mono text-gray-500 border border-dashed border-white/10 rounded-xl">
                 No battle history. Connect wallet to sync data.
               </div>
             ) : (
               <div className="flex flex-col gap-4">
                 {battleHistory.map(match => (
                   <div key={match.id} className="bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-4 flex items-center justify-between border border-white/5">
                     <div>
                       <div className="text-xs text-gray-500 font-mono mb-1">{match.date}</div>
                       <div className="text-sm font-bold text-white uppercase tracking-widest">{match.opponent}</div>
                     </div>
                     <div className="text-right">
                       <span className={`text-sm font-black tracking-widest uppercase ${match.color}`}>{match.result}</span>
                       <div className="text-xs font-mono text-gray-400 mt-1">{match.score}</div>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>

        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
      `}</style>
    </motion.div>
  );
}
