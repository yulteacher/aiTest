import { motion } from 'framer-motion';

export default function TeamLogo({ team, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-xl',
  };

  const emojiSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-5xl',
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${team.gradient} flex items-center justify-center relative overflow-hidden shadow-lg`}>
      <div className="absolute inset-0 bg-white/10" />
      <span className={`relative z-10 ${emojiSizes[size]}`}>
        {team.emoji}
      </span>
    </div>
  );
}
