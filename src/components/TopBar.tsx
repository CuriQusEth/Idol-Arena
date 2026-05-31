import { Wallet, Bell, Settings, Zap, LogOut } from 'lucide-react';
import { useAccount, useConnect, useDisconnect, useBalance, useReadContract } from 'wagmi';
import { ViewState } from '../types';
import { IDOL_ARENA_NFT_ADDRESS, IDOL_ARENA_NFT_ABI } from '../contracts';

interface TopBarProps {
  playerLevel: number;
  expS: number;
  expMax: number;
  starTokens: number;
  creditTokens: number;
  onViewChange?: (view: ViewState) => void;
}

export function TopBar({ playerLevel, expS, expMax, starTokens, creditTokens, onViewChange }: TopBarProps) {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  const { data: balanceData } = useBalance({ 
    address, 
    chainId: 91342,
    query: { enabled: !!address }
  });

  const { data: nftBalance } = useReadContract({
    address: IDOL_ARENA_NFT_ADDRESS as `0x${string}`,
    abi: IDOL_ARENA_NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const handleConnect = () => {
    const rabbyConnector = connectors.find(c => c.name.toLowerCase().includes('rabby'));
    if (rabbyConnector) {
      connect({ connector: rabbyConnector });
    } else {
      connect({ connector: connectors[0] });
    }
  };

  const currentGiwa = balanceData ? (Number(balanceData.value) / 1e18) : 0;
  const showCredit = isConnected ? currentGiwa.toLocaleString(undefined, { maximumFractionDigits: 2 }) : creditTokens.toLocaleString();
  const showStars = isConnected && nftBalance !== undefined ? Number(nftBalance).toLocaleString() : starTokens.toLocaleString();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-6 bg-black/40 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => onViewChange?.('MainMenu')}>
        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-400 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(219,39,119,0.5)]">
          <span className="font-black text-xl italic text-white leading-none">IA</span>
        </div>
        <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 hidden sm:block">Idol Arena</h1>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-4 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
          <div className="flex flex-col items-end">
             <span className="text-[10px] text-gray-400 uppercase tracking-widest leading-none">Giwa</span>
             <span className="text-sm font-mono font-bold text-cyan-400">{showCredit} $</span>
          </div>
          <div className="w-px h-6 bg-white/20"></div>
          <div className="flex flex-col items-end cursor-pointer hover:bg-white/5 rounded px-2" onClick={() => onViewChange?.('Collection')}>
             <span className="text-[10px] text-gray-400 uppercase tracking-widest leading-none">Cards</span>
             <span className="text-sm font-mono font-bold text-pink-400">{showStars} <Zap size={12} className="inline ml-1 mb-0.5" /></span>
          </div>
          <div className="w-px h-6 bg-white/20"></div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest leading-none">Wallet</span>
            {isConnected && address ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-cyan-400 cursor-pointer hover:text-white" onClick={() => onViewChange?.('Wallet')}>
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
                <button onClick={() => disconnect()} className="text-red-400 hover:text-red-500 mt-0.5">
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
               <button 
                 onClick={handleConnect}
                 className="flex items-center gap-2 px-5 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-[10px] sm:text-xs font-bold hover:brightness-110 transition-all text-white uppercase tracking-widest"
               >
                 <Wallet size={14} />
                 Connect Rabby
               </button>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end hidden sm:flex">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest leading-none mb-1">Rank LVL {playerLevel}</span>
          <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
             <div className="h-full bg-gradient-to-r from-cyan-400 to-pink-500" style={{ width: `${(expS / expMax) * 100}%` }}></div>
          </div>
        </div>

        <div className="w-10 h-10 rounded-full border-2 border-pink-500 p-0.5 ml-2 cursor-pointer hover:scale-110 transition-transform" onClick={() => onViewChange?.('Profile')}>
          <div className="w-full h-full bg-gray-800 rounded-full overflow-hidden flex items-center justify-center">
            <span className="font-bold text-xs">U</span>
          </div>
        </div>
      </div>
      
      {/* Mobile Wallet Connect */}
      <div className="md:hidden flex items-center ml-4">
        {isConnected && address ? (
          <button onClick={() => disconnect()} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 text-cyan-400">
            <Wallet size={16} />
          </button>
        ) : (
          <button onClick={handleConnect} className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center border border-transparent text-white hover:brightness-110">
            <Wallet size={16} />
          </button>
        )}
      </div>
    </header>
  );
}
