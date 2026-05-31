import { Wallet, Bell, Settings, Zap, LogOut } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { config } from '../wagmi';

interface TopBarProps {
  playerLevel: number;
  expS: number;
  expMax: number;
  starTokens: number; // premium currency
  creditTokens: number; // standard game currency
}

export function TopBar({ playerLevel, expS, expMax, starTokens, creditTokens }: TopBarProps) {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    connect({ connector: config.connectors[0] });
  };
  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-6 bg-black/40 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-400 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(219,39,119,0.5)]">
          <span className="font-black text-xl italic text-white leading-none">IA</span>
        </div>
        <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 hidden sm:block">Idol Arena</h1>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-4 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest leading-none">C-Tokens</span>
            <span className="text-sm font-mono font-bold text-gray-200">{creditTokens.toLocaleString()} C</span>
          </div>
          <div className="w-px h-6 bg-white/20"></div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest leading-none">S-Tokens</span>
            <span className="text-sm font-mono font-bold text-yellow-400">{starTokens.toLocaleString()} <Zap size={12} className="inline ml-1 mb-0.5" /></span>
          </div>
          <div className="w-px h-6 bg-white/20"></div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest leading-none">Wallet</span>
            {isConnected && address ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-cyan-400">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
                <button onClick={() => disconnect()} className="text-red-400 hover:text-red-500 mt-0.5">
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
               <button onClick={handleConnect} className="text-[10px] uppercase font-bold tracking-widest text-pink-500 hover:text-pink-400 hover:underline mt-0.5">
                  Connect
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

        <div className="w-10 h-10 rounded-full border-2 border-pink-500 p-0.5 ml-2">
          <div className="w-full h-full bg-gray-800 rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-b from-purple-400 to-purple-800 pt-2 flex items-start justify-center">
               <Settings size={16} className="text-white/50" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
