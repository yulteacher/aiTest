import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { KBO_TEAMS } from '../constants/teams';
import TeamLogo from './TeamLogo';

export default function TeamSelector({ selectedTeam, onSelectTeam, showAll = true, label = null }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700"
        whileTap={{ scale: 0.95 }}
      >
        {selectedTeam ? (
          <>
            <TeamLogo team={selectedTeam} size="sm" />
            <span className="text-gray-900 dark:text-gray-100">{selectedTeam.shortName}</span>
          </>
        ) : (
          <span className="text-gray-600 dark:text-gray-400">{label || '전체 구단'}</span>
        )}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-[60]" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full mt-2 left-0 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-2 z-[70] min-w-[200px]"
            >
              {showAll && (
                <button
                  onClick={() => {
                    onSelectTeam(null);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center">
                    <span className="text-white">⚾</span>
                  </div>
                  <span className="text-gray-900 dark:text-gray-100">전체 구단</span>
                </button>
              )}
              
              <div className="max-h-80 overflow-y-auto pr-2 scrollbar-liquid-glass">
                {KBO_TEAMS.map((team) => (
                  <motion.button
                    key={team.id}
                    onClick={() => {
                      onSelectTeam(team);
                      setIsOpen(false);
                    }}
                    whileHover={{ x: 4 }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                      selectedTeam?.id === team.id
                        ? 'bg-slate-100 dark:bg-slate-700'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <TeamLogo team={team} size="sm" />
                    <span className="text-gray-900 dark:text-gray-100">{team.name}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
