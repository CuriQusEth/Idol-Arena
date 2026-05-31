import { motion } from 'motion/react';
import { IdolCard } from '../types';
import { NFTCard } from './Card';
import { Search, Filter, Loader2 } from 'lucide-react';
import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import { IDOL_ARENA_NFT_ADDRESS, IDOL_ARENA_NFT_ABI } from '../contracts';

interface CollectionProps {
  cards: IdolCard[];
}

export function Collection({ cards }: CollectionProps) {
  const { address, isConnected } = useAccount();

  // 1. Get balance
  const { data: balance, isLoading: isBalanceLoading } = useReadContract({
    address: IDOL_ARENA_NFT_ADDRESS as `0x${string}`,
    abi: IDOL_ARENA_NFT_ABI,
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: !!address },
  });

  // 2. Get token IDs
  const tokenIndexes = balance ? Array.from({ length: Number(balance) }, (_, i) => BigInt(i)) : [];
  const tokenIdCalls = tokenIndexes.map(index => ({
    address: IDOL_ARENA_NFT_ADDRESS as `0x${string}`,
    abi: IDOL_ARENA_NFT_ABI,
    functionName: 'tokenOfOwnerByIndex',
    args: [address!, index],
  }));
  const { data: tokenIds, isLoading: isTokenLoading } = useReadContracts({ 
    contracts: tokenIdCalls as any, 
    query: { enabled: tokenIndexes.length > 0 } 
  });

  // 3. Get card info for each token
  const cardInfoCalls = (tokenIds ?? []).map((result: any) => ({
    address: IDOL_ARENA_NFT_ADDRESS as `0x${string}`,
    abi: IDOL_ARENA_NFT_ABI,
    functionName: 'cardInfo',
    args: [result?.result as bigint],
  }));
  const { data: cardInfos, isLoading: isCardLoading } = useReadContracts({ 
    contracts: cardInfoCalls as any, 
    query: { enabled: cardInfoCalls.length > 0 } 
  });

  const isLoading = isBalanceLoading || isTokenLoading || isCardLoading;

  // 4. Format live cards or fallback
  let displayCards = cards;
  if (isConnected && cardInfos && tokenIds) {
    displayCards = cardInfos.map((info: any, index) => {
      const tokenResult = tokenIds[index] as any;
      const tokenId = tokenResult?.result?.toString();
      const cardData = info?.result;
      if (!cardData) return null;
      
      const rarities = ['Common', 'Rare', 'Epic', 'Legendary', 'Special Edition'];
      return {
        id: `token_${tokenId}`,
        name: cardData.name || 'Unknown',
        groupName: cardData.groupName || 'Soloist',
        rarity: rarities[cardData.rarity] || 'Common',
        element: cardData.element || 'Neutral',
        level: cardData.level || 1,
        maxLevel: 50,
        imageUrl: `https://ui-avatars.com/api/?name=${cardData.name}&background=random&size=512`,
        stats: { attack: 50 + (cardData.level * 2), defense: 40 + (cardData.level * 2), charm: 60 + cardData.level, stagePresence: 55, fanPower: 45 }
      } as IdolCard;
    }).filter(Boolean) as IdolCard[];
  } else {
    displayCards = [
      ...cards,
      ...cards.map(c => ({...c, id: c.id + '_2', level: 1})),
      ...cards.map(c => ({...c, id: c.id + '_3', level: 10})),
    ];
  }

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
            {isLoading ? 'Loading...' : `${displayCards.length} / 250 CARDS`}
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
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4">
             <Loader2 size={48} className="text-cyan-400 animate-spin" />
             <span className="text-gray-400 font-mono text-sm">Fetching on-chain data...</span>
          </div>
        ) : !isConnected ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4">
             <div className="text-gray-400 font-mono bg-white/5 p-8 rounded-2xl border border-white/10 text-center">
               Connect your wallet to view your actual collection.<br/><br/>
               <span className="text-pink-400 text-xs mt-2 block">Showing mock data below.</span>
             </div>
             <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 w-full opacity-50 mt-8">
               {displayCards.map((card, idx) => (
                  <NFTCard key={card.id + idx} card={card} isInteractive={false} />
               ))}
             </div>
          </div>
        ) : displayCards.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 font-mono text-sm">
             No cards found in this wallet. Go to Shop to mint some!
          </div>
        ) : (
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
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.3); }
      `}</style>
    </motion.div>
  );
}
