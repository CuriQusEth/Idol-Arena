import { motion } from 'motion/react';
import { Package, Zap, Sparkles } from 'lucide-react';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { IDOL_ARENA_NFT_ADDRESS, IDOL_ARENA_NFT_ABI } from '../contracts';

export function Shop() {
  const { address } = useAccount();
  const { data: totalSupply } = useReadContract({
    address: IDOL_ARENA_NFT_ADDRESS as any,
    abi: IDOL_ARENA_NFT_ABI,
    functionName: 'totalSupply',
  });

  const { data: maxSupply } = useReadContract({
    address: IDOL_ARENA_NFT_ADDRESS as any,
    abi: IDOL_ARENA_NFT_ABI,
    functionName: 'MAX_SUPPLY',
  });

  const { writeContractAsync } = useWriteContract();

  const handleMint = async () => {
    if (!address) return alert("Please connect wallet first");
    try {
      await writeContractAsync({
        address: IDOL_ARENA_NFT_ADDRESS as any,
        abi: IDOL_ARENA_NFT_ABI,
        functionName: 'mintIdolCard',
        args: [
          address,
          "New Idol",
          "STELLAR",
          0, // Common
          "Light",
          1, // Level
          "ipfs://example"
        ]
      });
      alert("Mint successful!");
    } catch(e: any) {
      alert("Mint failed: " + e.message);
    }
  };

  const packs = [
    {
      id: 1,
      name: "Stellar Debut Pack",
      desc: "Contains 3 Idol Cards. Guaranteed 1 Rare or higher.",
      price: 500,
      currency: "C",
      color: "from-blue-600 to-cyan-400",
      icon: <Package size={32} className="text-cyan-200" />
    },
    {
      id: 2,
      name: "Neon Nights Edition",
      desc: "Contains 5 Idol Cards. Guaranteed 1 Epic or higher.",
      price: 1500,
      currency: "C",
      color: "from-purple-600 to-pink-500",
      icon: <Sparkles size={32} className="text-pink-200" />,
      popular: true
    },
    {
      id: 3,
      name: "Legendary Comeback",
      desc: "Contains 10 Idol Cards. Guaranteed 1 Legendary.",
      price: 500,
      currency: "S",
      color: "from-[var(--color-neon-purple)] via-pink-500 to-yellow-500",
      icon: <Zap size={32} className="text-yellow-200" />
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-6xl mx-auto h-full flex flex-col p-8 z-10"
    >
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none text-glow-cyan text-white mb-2">Card Shop</h2>
          <p className="text-gray-400 max-w-xl text-sm leading-relaxed">Spend your earned Credits or premium Star Tokens to acquire new Idols and build your ultimate Arena Deck.</p>
        </div>
        <div className="flex flex-col items-end gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
           <span className="text-[10px] text-gray-400 uppercase tracking-widest leading-none">Total Supply Minted</span>
           <span className="text-lg font-mono font-bold text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">
             {totalSupply !== undefined ? Number(totalSupply).toLocaleString() : '---'} / {maxSupply !== undefined ? Number(maxSupply).toLocaleString() : '10,000'}
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packs.map((pack) => (
          <motion.div 
            key={pack.id}
            whileHover={{ y: -10, scale: 1.02 }}
            className={`relative rounded-[32px] p-[2px] bg-gradient-to-br ${pack.color} shadow-2xl overflow-hidden`}
          >
            {pack.popular && (
              <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-pink-500/50">
                 <span className="text-[10px] font-black tracking-widest text-[var(--color-neon-pink)] uppercase">Best Value</span>
              </div>
            )}
            <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
            
            <div className="h-full bg-black/80 backdrop-blur-xl rounded-[30px] p-8 flex flex-col border border-white/10 text-center relative z-10">
               <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${pack.color} flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)] mb-8`}>
                  <div className="w-[88px] h-[88px] bg-black/50 rounded-full flex items-center justify-center">
                    {pack.icon}
                  </div>
               </div>
               
               <h3 className="text-xl font-bold italic tracking-tighter uppercase mb-2">{pack.name}</h3>
               <p className="text-xs text-gray-300 font-mono mb-8 opacity-80 min-h-[40px]">{pack.desc}</p>
               
               <button 
                  onClick={handleMint}
                  className="mt-auto group bg-white/10 hover:bg-white/20 border border-white/20 rounded-full py-4 px-6 flex items-center justify-center gap-2 transition-all"
               >
                  <span className="text-xs uppercase font-bold tracking-widest">Buy for</span>
                  <span className={`text-xl font-black ${pack.currency === 'S' ? 'text-yellow-400' : 'text-white'}`}>
                    {pack.price.toLocaleString()}
                  </span>
                  {pack.currency === 'S' ? (
                     <Zap size={16} className="text-yellow-400" />
                  ) : (
                     <span className="font-mono font-bold text-gray-400 text-sm">C</span>
                  )}
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
