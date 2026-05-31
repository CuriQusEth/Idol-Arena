import { motion } from 'motion/react';
import { useAccount, useBalance, useConnect, useDisconnect, useSwitchChain, useChainId, useReadContract } from 'wagmi';
import { Copy, LogOut, Wallet as WalletIcon, Zap, Activity } from 'lucide-react';
import { IDOL_ARENA_NFT_ADDRESS, IDOL_ARENA_NFT_ABI } from '../contracts';
import { config } from '../wagmi';

export function WalletView() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  
  const targetChainId = 91342; // GIWA Sepolia
  
  const { data: balanceData } = useBalance({ 
    address, 
    chainId: targetChainId,
    query: { enabled: !!address }
  });

  const { data: nftBalance } = useReadContract({
    address: IDOL_ARENA_NFT_ADDRESS as `0x${string}`,
    abi: IDOL_ARENA_NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const { data: totalSupply } = useReadContract({
    address: IDOL_ARENA_NFT_ADDRESS as `0x${string}`,
    abi: IDOL_ARENA_NFT_ABI,
    functionName: 'totalSupply',
  });

  const { data: maxSupply } = useReadContract({
    address: IDOL_ARENA_NFT_ADDRESS as `0x${string}`,
    abi: IDOL_ARENA_NFT_ABI,
    functionName: 'MAX_SUPPLY',
  });

  const handleConnect = () => {
    const metaMaskConnector = config.connectors.find(c => c.name === 'MetaMask') ?? config.connectors[0];
    if (metaMaskConnector) {
      connect({ connector: metaMaskConnector });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-4xl mx-auto h-full flex flex-col items-center justify-center p-8 z-10"
    >
      <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 md:p-12 w-full shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500/50 flex flex-col items-center justify-center text-green-400">
             <WalletIcon size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white">Wallet Connection</h2>
            <p className="text-gray-400 text-sm">Manage your web3 identity and un-chain assets.</p>
          </div>
        </div>

        {!isConnected ? (
          <div className="flex flex-col items-center bg-white/5 rounded-2xl p-8 border border-white/5 text-center">
             <Zap size={48} className="text-cyan-400 mb-4" />
             <h3 className="text-xl font-bold uppercase tracking-wider text-white mb-2">Not Connected</h3>
             <p className="text-gray-400 text-sm mb-6 max-w-sm">Connect your wallet to access your cards, mint new idols, and interact with the Giwa network.</p>
             <button 
               onClick={handleConnect}
               className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black uppercase tracking-widest px-8 py-4 rounded-full shadow-[0_0_20px_rgba(219,39,119,0.4)] hover:opacity-90 transition-opacity"
             >
               Connect Wallet
             </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            
            {/* Address panel */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
               <div className="flex flex-col">
                 <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Connected Address</span>
                 <div className="flex items-center gap-3">
                   <span className="font-mono text-lg text-cyan-400">{address}</span>
                   <button 
                      onClick={() => navigator.clipboard.writeText(address || '')} 
                      className="text-gray-400 hover:text-white"
                   >
                     <Copy size={16} />
                   </button>
                 </div>
               </div>
               <button 
                  onClick={() => disconnect()}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                >
                  <LogOut size={16} />
               </button>
            </div>

            {/* Network Panel */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                 <Activity size={24} className={chainId === targetChainId ? "text-green-400" : "text-yellow-400"} />
                 <div className="flex flex-col">
                   <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Network Status</span>
                   <span className={`font-black uppercase tracking-tight text-white`}>
                     {chainId === targetChainId ? 'Giwa Sepolia' : 'Wrong Network'}
                   </span>
                 </div>
              </div>
              {chainId !== targetChainId && (
                <button 
                  onClick={() => switchChain({ chainId: targetChainId })}
                  className="bg-yellow-500 text-black font-black uppercase text-xs tracking-widest px-6 py-2.5 rounded-full"
                >
                  Switch Network
                </button>
              )}
            </div>

            {/* Balances */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden">
                 <span className="text-[10px] uppercase tracking-widest text-cyan-300 font-bold mb-1 block relative z-10">GIWA Balance</span>
                 <span className="text-3xl font-black font-mono text-white relative z-10">
                   {balanceData ? (Number(balanceData.value) / 1e18).toLocaleString(undefined, { maximumFractionDigits: 4 }) : '---'} <span className="text-cyan-400 text-lg">GIWA</span>
                 </span>
                 <Zap className="absolute -right-4 -bottom-4 text-cyan-500/20 w-32 h-32" />
              </div>
              <div className="bg-gradient-to-br from-pink-900/40 to-purple-900/40 border border-pink-500/30 rounded-2xl p-6 relative overflow-hidden">
                 <span className="text-[10px] uppercase tracking-widest text-pink-300 font-bold mb-1 block relative z-10">Cards Owned</span>
                 <span className="text-3xl font-black font-mono text-white relative z-10">
                   {nftBalance !== undefined ? Number(nftBalance).toLocaleString() : '---'} <span className="text-pink-400 text-lg">NFTs</span>
                 </span>
                 <WalletIcon className="absolute -right-4 -bottom-4 text-pink-500/20 w-32 h-32" />
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex justify-between text-xs font-mono text-gray-400">
               <span>Contract: {IDOL_ARENA_NFT_ADDRESS.slice(0, 6)}...{IDOL_ARENA_NFT_ADDRESS.slice(-4)}</span>
               <span>Supply: {totalSupply !== undefined ? Number(totalSupply) : '0'} / {maxSupply !== undefined ? Number(maxSupply) : '10000'}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
