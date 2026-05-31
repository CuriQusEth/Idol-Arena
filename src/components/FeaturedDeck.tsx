import { motion } from 'motion/react';
import { NFTCard } from './Card';
import { IdolCard } from '../types';

interface FeaturedDeckProps {
  cards: IdolCard[];
}

export function FeaturedDeck({ cards }: FeaturedDeckProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center -ml-16">
      
      <div className="relative w-[340px] h-[500px]">
        {/* Background ambient glow behind cards */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-neon-pink)]/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-[40%] left-[60%] -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[var(--color-neon-cyan)]/20 rounded-full blur-[80px] pointer-events-none"></div>

        {cards.map((card, idx) => {
          // Calculate fan spread positioning
          const isCenter = idx === 1;
          const isLeft = idx === 0;
          const isRight = idx === 2;
          
          let rotate = 0;
          let x = 0;
          let y = 0;
          let zIndex = 10;
          let scale = 1;

          if (isLeft) {
            rotate = -12;
            x = -180;
            y = 40;
            zIndex = 5;
            scale = 0.85;
          } else if (isRight) {
            rotate = 12;
            x = 180;
            y = 40;
            zIndex = 5;
            scale = 0.85;
          } else {
            // center card
            zIndex = 20;
            scale = 1.1;
          }

          return (
             <motion.div
               key={card.id}
               className="absolute top-0 left-0"
               initial={{ opacity: 0, y: 100 }}
               animate={{ 
                 opacity: 1, 
                 y, 
                 x, 
                 rotateZ: rotate,
                 scale
               }}
               transition={{ 
                 type: 'spring', 
                 stiffness: 200, 
                 damping: 20, 
                 delay: 0.1 * idx 
               }}
               style={{ zIndex }}
             >
                <div className="w-[340px]">
                  <NFTCard card={card} isInteractive={isCenter} />
                </div>
             </motion.div>
          )
        })}
      </div>

    </div>
  );
}
