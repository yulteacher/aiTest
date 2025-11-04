import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Check, Plus, Award, Zap, Trash2 } from 'lucide-react';
import TeamSelector from './TeamSelector';
import TeamLogo from './TeamLogo';
import { toast } from 'sonner';

export default function PollsPage({ onPollClick }) {
  const [polls, setPolls] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOptions, setNewPollOptions] = useState(['', '']);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedPollId, setSelectedPollId] = useState(null);

  useEffect(() => {
    const savedPolls = localStorage.getItem('polls');
    if (savedPolls) {
      setPolls(JSON.parse(savedPolls));
    }

    // Listen for poll selection from HomePage
    const handleSelectPoll = (event) => {
      setSelectedPollId(event.detail);
    };

    window.addEventListener('selectPoll', handleSelectPoll);
    return () => window.removeEventListener('selectPoll', handleSelectPoll);
  }, []);

  useEffect(() => {
    const savedPolls = localStorage.getItem('polls');
    if (savedPolls) {
      setPolls(JSON.parse(savedPolls));
    } else {
      console.warn('⚠️ Poll 데이터가 없습니다. App.tsx initializeDummyData가 먼저 실행되어야 합니다.');
    }

    const handleSelectPoll = (event) => {
      setSelectedPollId(event.detail);
    };

    window.addEventListener('selectPoll', handleSelectPoll);
    return () => window.removeEventListener('selectPoll', handleSelectPoll);
  }, []);

  const handleVote = (pollId, optionId) => {
    const poll = polls.find(p => p.id === pollId);
    const isRevote = poll.userVoted !== null;

    const updatedPolls = polls.map((poll) => {
      if (poll.id === pollId) {
        const newOptions = poll.options.map((option) => {
          if (option.id === optionId) {
            return { ...option, votes: option.votes + 1 };
          }
          if (poll.userVoted && option.id === poll.userVoted) {
            return { ...option, votes: option.votes - 1 };
          }
          return option;
        });

        return {
          ...poll,
          options: newOptions,
          totalVotes: poll.userVoted ? poll.totalVotes : poll.totalVotes + 1,
          userVoted: optionId,
        };
      }
      return poll;
    });
    setPolls(updatedPolls);
    localStorage.setItem('polls', JSON.stringify(updatedPolls));

    if (isRevote) {
      toast.success('투표가 변경되었습니다!');
    } else {
      toast.success('투표가 완료되었습니다!');
    }
  };

  const handleCreatePoll = () => {
    if (!newPollQuestion.trim() || newPollOptions.filter(o => o.trim()).length < 2) return;

    const poll = {
      id: Date.now().toString(),
      author: '나',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      question: newPollQuestion,
      options: newPollOptions
        .filter(o => o.trim())
        .map((text, idx) => ({
          id: (idx + 1).toString(),
          text,
          votes: 0,
        })),
      totalVotes: 0,
      timestamp: '방금 전',
      userVoted: null,
    };

    const updatedPolls = [poll, ...polls];
    setPolls(updatedPolls);
    localStorage.setItem('polls', JSON.stringify(updatedPolls));
    setNewPollQuestion('');
    setNewPollOptions(['', '']);
    setShowCreate(false);
    toast.success('투표가 생성되었습니다!');
  };

  const addOption = () => {
    setNewPollOptions([...newPollOptions, '']);
  };

  const handleDeletePoll = (pollId) => {
    if (window.confirm('이 투표를 삭제하시겠습니까?')) {
      const updatedPolls = polls.filter((poll) => poll.id !== pollId);
      setPolls(updatedPolls);
      localStorage.setItem('polls', JSON.stringify(updatedPolls));
      toast.success('투표가 삭제되었습니다');
    }
  };

  const filteredPolls = selectedTeam
    ? polls.filter(poll => poll.team?.id === selectedTeam.id)
    : polls;

  return (
    <div className="p-4 space-y-4">
      {/* 구단 필터 */}
      <TeamSelector selectedTeam={selectedTeam} onSelectTeam={setSelectedTeam} showAll={true} />
      {/* 투표 생성 버튼 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-teal-500 via-cyan-500 to-sky-500 dark:from-teal-600 dark:via-cyan-600 dark:to-sky-600 rounded-2xl p-4 shadow-lg dark:shadow-teal-500/20 text-white"
      >
        {!showCreate ? (
          <button
            onClick={() => setShowCreate(true)}
            className="w-full flex items-center justify-center gap-2 py-2"
          >
            <Plus className="w-5 h-5" />
            새 투표 만들기
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <input
              value={newPollQuestion}
              onChange={(e) => setNewPollQuestion(e.target.value)}
              placeholder="질문을 입력하세요"
              className="w-full bg-white/20 text-white placeholder-white/70 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/50"
              autoFocus
            />
            {newPollOptions.map((option, idx) => (
              <motion.input
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                value={option}
                onChange={(e) => {
                  const newOptions = [...newPollOptions];
                  newOptions[idx] = e.target.value;
                  setNewPollOptions(newOptions);
                }}
                placeholder={`옵션 ${idx + 1}`}
                className="w-full bg-white/20 text-white placeholder-white/70 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addOption}
              className="text-white hover:underline"
            >
              + 옵션 추가
            </motion.button>
            <div className="flex justify-end gap-2 pt-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowCreate(false);
                  setNewPollQuestion('');
                  setNewPollOptions(['', '']);
                }}
                className="px-4 py-2 bg-white/20 rounded-full"
              >
                취소
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreatePoll}
                disabled={!newPollQuestion.trim() || newPollOptions.filter(o => o.trim()).length < 2}
                className="px-4 py-2 bg-white text-teal-600 rounded-full disabled:opacity-50"
              >
                만들기
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* 투표 목록 */}
      {filteredPolls.map((poll, index) => (
        <PollCard
          key={poll.id}
          poll={poll}
          index={index}
          onVote={handleVote}
          onDelete={handleDeletePoll}
          isSelected={selectedPollId === poll.id}
          onPollClick={onPollClick}
        />
      ))}
    </div>
  );
}

function PollCard({ poll, index, onVote, onDelete, isSelected, onPollClick }) {
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
  const deleteOpacity = useTransform(x, [-150, -50, 0], [1, 0.5, 0]);
  const isMyPoll = poll.author === '나';

  const getWinningOption = () => {
    return poll.options.reduce((max, option) =>
      option.votes > max.votes ? option : max
      , poll.options[0]);
  };

  const winningOption = getWinningOption();

  // Auto scroll to selected poll
  useEffect(() => {
    if (isSelected && cardRef.current) {
      setTimeout(() => {
        cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [isSelected]);

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    if (Math.abs(info.offset.x) > 100 && isMyPoll) {
      onDelete(poll.id);
    } else {
      x.set(0);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isSelected ? 1.02 : 1
      }}
      transition={{
        delay: index * 0.1,
        scale: { duration: 0.3 }
      }}
      className="relative"
    >
      {/* 삭제 배경 */}
      {isMyPoll && (
        <motion.div
          className="absolute inset-0 bg-red-500 rounded-2xl flex items-center justify-end px-6"
          style={{ opacity: deleteOpacity }}
        >
          <Trash2 className="w-6 h-6 text-white" />
        </motion.div>
      )}

      <motion.div
        drag={isMyPoll ? "x" : false}
        dragConstraints={{ left: -150, right: 0 }}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ x, opacity }}
        className={`glass-card rounded-2xl p-4 transition-all border border-teal-100/50 dark:border-teal-400/20 ${isMyPoll ? 'cursor-grab active:cursor-grabbing' : ''} ${isSelected ? 'ring-2 ring-teal-500' : ''}`}
      >
        {/* 작성자 */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={poll.avatar}
            alt={poll.author}
            className="w-10 h-10 rounded-full ring-2 ring-teal-200 dark:ring-teal-400/30"
          />
          <div className="flex-1">
            <div className="text-gray-900 dark:text-gray-100">{poll.author}</div>
            <p className="text-gray-500 dark:text-gray-400 text-xs">{poll.timestamp}</p>
          </div>
          {poll.totalVotes > 50 && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.5 }}
              className="ml-auto"
            >
              <Award className="w-6 h-6 text-yellow-500" />
            </motion.div>
          )}
        </div>
        {/* 🏟️ 팀 로고 & 이름 (TeamLogo 사용) */}
        {poll.team && (
          <div className="flex items-center gap-3 mb-4">
            <TeamLogo team={poll.team} size="md" />
            <span className="text-gray-800 dark:text-gray-100 font-semibold">
              {poll.team.name}
            </span>
          </div>
        )}
        {/* 질문 */}
        <h3 className="text-gray-900 dark:text-gray-100 mb-4">{poll.question}</h3>

        {/* 옵션 */}
        <div className="space-y-2 mb-4">
          {poll.options.map((option, idx) => {
            const percentage = poll.totalVotes > 0
              ? Math.round((option.votes / poll.totalVotes) * 100)
              : 0;
            const isSelected = poll.userVoted === option.id;
            const isWinning = option.id === winningOption.id && poll.totalVotes > 0;

            return (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onVote(poll.id, option.id)}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all relative overflow-hidden ${isSelected
                  ? 'border-teal-600 dark:border-teal-400 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700'
                  }`}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{
                    duration: 1,
                    delay: 0.5,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  className={`absolute inset-0 ${isWinning
                    ? 'bg-gradient-to-r from-teal-200 to-cyan-200 dark:from-teal-900/50 dark:to-cyan-900/50'
                    : 'bg-teal-100 dark:bg-teal-900/30'
                    }`}
                />
                <div className="relative flex items-center justify-between">
                  <span className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    {option.text}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring' }}
                      >
                        <Check className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      </motion.div>
                    )}
                    {isWinning && poll.totalVotes > 0 && (
                      <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </span>
                  <motion.span
                    className="text-gray-600 dark:text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    {percentage}%
                  </motion.span>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-gray-500 dark:text-gray-400 text-center"
        >
          총 {poll.totalVotes}명 참여
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
