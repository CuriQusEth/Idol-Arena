import { createConfig, http } from 'wagmi';
import { metaMask, walletConnect, injected } from 'wagmi/connectors';

export const giwaSepolia = {
  id: 91342,
  name: 'Giwa Sepolia',
  nativeCurrency: { name: 'Giwa', symbol: 'GIWA', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://sepolia-rpc.giwa.io'] },
  },
  blockExplorers: {
    default: { name: 'Giwa Explorer', url: 'https://sepolia-explorer.giwa.io' },
  },
  testnet: true,
} as const;

export const config = createConfig({
  chains: [giwaSepolia as any],
  connectors: [
    injected({ target: 'rabby' }),
    metaMask({
      dappMetadata: {
        name: 'Idol Arena',
        url: 'https://idolarena.gg',
      },
    }),
    walletConnect({
      projectId: 'f36f7f706a5807add395701e67c824c0', // Placeholder project ID
    }),
  ],
  transports: {
    [giwaSepolia.id]: http(),
  },
});
