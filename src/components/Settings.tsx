import { motion } from 'motion/react';
import { Settings as SettingsIcon, Monitor, Volume2, Globe, ExternalLink } from 'lucide-react';
import { useAccount, useChainId, useSwitchChain, useConnect } from 'wagmi';
import { useState } from 'react';
import { config } from '../wagmi';

export function Settings() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { connect } = useConnect();
  const targetChainId = 91342;

  const [particlesEnabled, setParticles] = useState(true);
  const [sfxEnabled, setSfx] = useState(true);
  const [musicVolume, setMusicVolume] = useState(50);

  const handleConnect = () => {
    const metaMaskConnector = config.connectors.find(c => c.name === 'MetaMask') ?? config.connectors[0];
    if (metaMaskConnector) {
      connect({ connector: metaMaskConnector });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-3xl mx-auto h-full flex flex-col p-8 overflow-y-auto custom-scrollbar relative z-10"
    >
      <div className="flex items-center gap-4 mb-8">
        <SettingsIcon size={32} className="text-gray-400" />
        <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none text-white mt-1">Settings</h2>
      </div>

      <div className="flex flex-col gap-8 pb-12">
        {/* Network & Wallet */}
        <section className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
             <Globe size={20} className="text-cyan-400" />
             <h3 className="font-bold uppercase tracking-widest text-cyan-400">Network & Wallet</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-white uppercase text-sm">Server Identity</div>
                <div className="text-xs text-gray-400 mt-1">{isConnected ? address : 'Not connected'}</div>
              </div>
              {!isConnected && (
                <button onClick={handleConnect} className="bg-pink-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
                  Connect
                </button>
              )}
            </div>

            <div className="h-px bg-white/5 w-full -my-2"></div>

            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-white uppercase text-sm">Target Chain Node</div>
                <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${chainId === targetChainId ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  ID: {chainId} — {chainId === targetChainId ? 'Connected to Giwa Sepolia' : 'Disconnected'}
                </div>
              </div>
              {chainId !== targetChainId && isConnected && (
                <button onClick={() => switchChain({ chainId: targetChainId })} className="bg-yellow-500 text-black text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
                  Switch to Giwa
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Display */}
        <section className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
             <Monitor size={20} className="text-pink-400" />
             <h3 className="font-bold uppercase tracking-widest text-pink-400">Display</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-white uppercase text-sm">Particle Effects</div>
                <div className="text-xs text-gray-400 mt-1">Enable floating atmospheric particles in the background.</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={particlesEnabled} onChange={() => setParticles(!particlesEnabled)} className="sr-only peer" />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Audio */}
        <section className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
             <Volume2 size={20} className="text-purple-400" />
             <h3 className="font-bold uppercase tracking-widest text-purple-400">Audio</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-white uppercase text-sm">Sound Effects</div>
                <div className="text-xs text-gray-400 mt-1">UI clicks, battle sounds, and notifications.</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={sfxEnabled} onChange={() => setSfx(!sfxEnabled)} className="sr-only peer" />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>

            <div className="h-px bg-white/5 w-full -my-2"></div>

            <div className="flex flex-col gap-4">
               <div className="flex justify-between items-center">
                  <span className="font-bold text-white uppercase text-sm">Music Volume</span>
                  <span className="text-xs font-mono text-purple-400 font-bold">{musicVolume}%</span>
               </div>
               <input 
                  type="range" min="0" max="100" 
                  value={musicVolume} 
                  onChange={(e) => setMusicVolume(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-purple-500"
               />
            </div>
          </div>
        </section>

        {/* System Information */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
           <div className="font-black italic text-xl uppercase tracking-tighter mb-2">Idol Arena</div>
           <div className="font-mono text-xs text-gray-500 mb-6">v1.2.0-rc</div>

           <div className="flex justify-center gap-6">
              <a href="https://docs.giwa.io" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors">
                Giwa Docs <ExternalLink size={10} />
              </a>
              <a href="https://sepolia-explorer.giwa.io" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-pink-400 hover:text-pink-300 transition-colors">
                Explorer <ExternalLink size={10} />
              </a>
           </div>
        </section>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
      `}</style>
    </motion.div>
  );
}
