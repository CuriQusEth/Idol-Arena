import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { IdolCard, ViewState } from './types';
import { TopBar } from './components/TopBar';
import { MainMenu } from './components/MainMenu';
import { FeaturedDeck } from './components/FeaturedDeck';
import { BattleScene } from './components/BattleScene';
import { Collection } from './components/Collection';
import { Shop } from './components/Shop';
import { Events } from './components/Events';
import { Deck } from './components/Deck';
import { WalletView } from './components/WalletView';
import { Settings } from './components/Settings';
import { Profile } from './components/Profile';

// Mock Data Configuration
const LUNA_CARD: IdolCard = {
  id: 'card_001',
  name: 'Luna Eclipse',
  groupName: 'STELLAR',
  rarity: 'Legendary',
  imageUrl: '/src/assets/images/luna_eclipse_1780249409922.png',
  element: 'Light',
  stats: { attack: 95, defense: 80, charm: 99, stagePresence: 100, fanPower: 92 },
  level: 45,
  maxLevel: 50,
};

const OPPONENT_CARD: IdolCard = {
  id: 'card_002',
  name: 'Orion Vanguard',
  groupName: 'AEGIS',
  rarity: 'Epic',
  imageUrl: '/src/assets/images/male_idol_card_1780249445355.png',
  element: 'Electric',
  stats: { attack: 88, defense: 95, charm: 80, stagePresence: 85, fanPower: 75 },
  level: 40,
  maxLevel: 40,
};

const FEATURED_DECK: IdolCard[] = [
  OPPONENT_CARD, 
  LUNA_CARD, // Center
  {
    ...LUNA_CARD,
    id: 'card_003',
    name: 'Seraphina',
    rarity: 'Common',
    element: 'Water',
    stats: { attack: 60, defense: 50, charm: 70, stagePresence: 65, fanPower: 55 },
    level: 12,
    maxLevel: 20
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('MainMenu');

  // Floating particles gen
  const [particles, setParticles] = useState<{id: number, x: number, y: number, size: number, speed: number, color: string}[]>([]);
  
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 20 + 10,
      color: Math.random() > 0.5 ? 'var(--color-neon-pink)' : 'var(--color-neon-cyan)'
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="w-full h-screen bg-[var(--color-cyber-dark)] text-white overflow-hidden relative font-sans selection:bg-[var(--color-neon-pink)] selection:text-white">
      
      {/* Atmospheric Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-pink-900/20 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[100px] opacity-30"></div>
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px]"></div>
      </div>

      {/* Global Particles */}
      <div className="particle-container">
        {particles.map(p => (
          <div 
            key={p.id}
            className="absolute rounded-full opacity-30 shadow-[0_0_10px_currentColor]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              color: p.color,
              animation: `floatUp ${p.speed}s infinite linear`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(100vh); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-20vh); opacity: 0; }
        }
      `}</style>
      
      <TopBar 
        playerLevel={42} 
        expS={1540} 
        expMax={3000} 
        creditTokens={1240500} 
        starTokens={5800} 
        onViewChange={setCurrentView}
      />
      
      <main className="relative z-10 w-full h-full pt-16 flex">
        
        {/* Sidebar Menu Layer */}
        <MainMenu currentView={currentView} onViewChange={setCurrentView} />

        {/* Dynamic Content Area Layer */}
        <div className="flex-1 relative h-full flex flex-col items-center justify-center p-4 md:p-10">
            
            <AnimatePresence mode="wait">
              {currentView === 'MainMenu' && (
                <FeaturedDeck key="main" cards={FEATURED_DECK} />
              )}
              
              {currentView === 'Battle' && (
                 <BattleScene 
                   key="battle" 
                   playerCard={LUNA_CARD} 
                   opponentCard={OPPONENT_CARD} 
                   onRetreat={() => setCurrentView('MainMenu')}
                 />
              )}

              {currentView === 'Collection' && <Collection key="collection" cards={[LUNA_CARD, OPPONENT_CARD]} />}
              {currentView === 'Shop' && <Shop key="shop" />}
              {currentView === 'Events' && <Events key="events" />}
              
              {currentView === 'Deck' && <Deck key="deck" />}
              {currentView === 'Wallet' && <WalletView key="wallet" />}
              {currentView === 'Settings' && <Settings key="settings" />}
              {currentView === 'Profile' && <Profile key="profile" />}
            </AnimatePresence>

        </div>
      </main>

    </div>
  );
}
