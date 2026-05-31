import { motion } from 'motion/react';
import { IdolCard } from '../types';
import { NFTCard } from './Card';
import { Loader2, Plus, Download } from 'lucide-react';
import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import { IDOL_ARENA_NFT_ADDRESS, IDOL_ARENA_NFT_ABI } from '../contracts';
import { useState } from 'react';

export function Deck() {
  const { address, isConnected } = useAccount();
  const [deck, setDeck] = useState<IdolCard[]>([]);

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

  // Format live cards
  let availableCards: IdolCard[] = [];
  if (isConnected && cardInfos && tokenIds) {
    availableCards = cardInfos.map((info: any, index) => {
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
  }

  const handleCardClick = (card: IdolCard) => {
    if (deck.find(c => c.id === card.id)) {
      setDeck(deck.filter(c => c.id !== card.id));
    } else if (deck.length < 5) {
      setDeck([...deck, card]);
    }
  };

  const handleSaveDeck = () => {
    if (deck.length > 0) {
      alert("Deck saved successfully!");
      // Logic to save deck would go here
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full h-full flex flex-col md:flex-row p-4 md:p-8 gap-8 overflow-hidden relative z-10"
    >
      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
        <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none text-white mb-6">Available Cards</h2>
        
        {!isConnected ? (
          <div className="text-gray-400 font-mono bg-white/5 p-8 rounded-2xl border border-white/10 text-center">
            Connect your wallet to view your cards and build a deck.
          </div>
        ) : isLoading ? (
          <div className="flex items-center gap-2 text-cyan-400 font-mono">
            <Loader2 className="animate-spin" /> Fetching collection...
          </div>
        ) : availableCards.length === 0 ? (
          <div className="text-gray-400 font-mono">No cards found. Go to Shop to mint first!</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {availableCards.map(card => {
              const inDeck = deck.some(c => c.id === card.id);
              return (
                <div key={card.id} className="relative cursor-pointer transition-transform hover:scale-105" onClick={() => handleCardClick(card)}>
                  <NFTCard card={card} isInteractive={false} />
                  {inDeck && (
                    <div className="absolute inset-0 bg-pink-500/20 backdrop-blur-[2px] rounded-2xl border-2 border-pink-500 flex items-center justify-center uppercase font-black text-xl text-white">
                      In Deck
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="w-full md:w-96 flex flex-col shrink-0 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-glow-cyan text-cyan-400">Active Deck</h2>
           <span className="font-mono text-sm text-gray-400">{deck.length}/5</span>
        </div>

        <div className="flex flex-col gap-4 flex-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const card = deck[i];
            return (
              <div 
                key={i} 
                className={`h-24 rounded-xl border flex items-center justify-center transition-all ${
                  card ? 'bg-white/10 border-white/20 p-2 cursor-pointer hover:border-pink-500' : 'bg-black/20 border-white/5 border-dashed text-white/20'
                }`}
                onClick={() => card && handleCardClick(card)}
              >
                {card ? (
                  <div className="flex w-full h-full items-center gap-4">
                    <img src={card.imageUrl} className="h-full w-16 object-cover rounded-md" />
                    <div className="flex-1">
                      <div className="font-black italic uppercase text-white truncate">{card.name}</div>
                      <div className="text-[10px] text-cyan-400 uppercase font-bold">{card.rarity}</div>
                    </div>
                  </div>
                ) : (
                  <Plus size={24} />
                )}
              </div>
            );
          })}
        </div>

        <button 
          onClick={handleSaveDeck}
          disabled={deck.length === 0}
          className={`mt-6 py-4 rounded-xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-2 border transition-all ${
            deck.length > 0 
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 border-white/20 text-white hover:opacity-90 shadow-[0_0_20px_rgba(219,39,119,0.4)]' 
              : 'bg-white/5 border-white/5 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Download size={18} /> Save Deck
        </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
      `}</style>
    </motion.div>
  );
}
