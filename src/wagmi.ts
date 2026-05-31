import { createConfig, http } from 'wagmi';
import { metaMask } from 'wagmi/connectors';

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
    metaMask({
      dappMetadata: {
        name: 'Idol Arena',
        url: 'https://idolarena.gg',
      },
    }),
  ],
  transports: {
    [giwaSepolia.id]: http(),
  },
});
