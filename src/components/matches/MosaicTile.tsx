import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { Match } from '@/types';

interface MosaicTileProps {
  match: Match;
  index: number;
  onClick: () => void;
}

export const MosaicTile = ({ match, index, onClick }: MosaicTileProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="relative aspect-square cursor-pointer overflow-hidden rounded-lg group text-left"
      onClick={onClick}
      aria-label={`View ${match.name}'s profile, ${match.compatibility}% match`}
      type="button"
    >
      <img
        src={match.avatar}
        alt=""
        aria-hidden="true"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      {/* Overlay on hover */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
        aria-hidden="true"
      />
      
      {/* Compatibility badge */}
      <div className="absolute top-1.5 right-1.5 gradient-primary px-1.5 py-0.5 rounded-full flex items-center gap-0.5" aria-hidden="true">
        <Sparkles className="w-3 h-3 text-primary-foreground" />
        <span className="text-xs font-bold text-primary-foreground">{match.compatibility}%</span>
      </div>

      {/* Name overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true">
        <p className="text-white text-sm font-semibold truncate">{match.name}, {match.age}</p>
      </div>
    </motion.button>
  );
};
