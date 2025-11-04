import { motion } from 'framer-motion';

export default function Confetti() {
  const confettiPieces = Array.from({ length: 30 }, (_, i) => i);
  const colors = ['#9333ea', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {confettiPieces.map((i) => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomX = Math.random() * window.innerWidth;
        const randomDelay = Math.random() * 0.5;
        const randomDuration = 2 + Math.random() * 2;
        const randomRotation = Math.random() * 720 - 360;

        return (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-sm"
            style={{
              backgroundColor: randomColor,
              left: randomX,
              top: -20,
            }}
            initial={{ y: -20, opacity: 1, rotate: 0 }}
            animate={{
              y: window.innerHeight + 20,
              opacity: [1, 1, 0],
              rotate: randomRotation,
              x: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: randomDuration,
              delay: randomDelay,
              ease: 'easeIn',
            }}
          />
        );
      })}
    </div>
  );
}
