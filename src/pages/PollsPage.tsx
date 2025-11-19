import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Check, Plus, Award, Zap, Trash2 } from 'lucide-react';
import TeamSelector from '../components/TeamSelector';
import TeamLogo from '../components/yului/TeamLogo';
import { toast } from 'sonner';
import { useAppDataContext } from "../context/AppDataContext";
import { useXPSystem } from "../hooks/useXPSystem";

function AnimatedCount({ value }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [color, setColor] = useState('#6b7280');

  useEffect(() => {
    const controls = animate(count, value, { duration: 0.6, ease: 'easeOut' });
    setColor(value > count.get() ? '#14b8a6' : '#ef4444');
    const timeout = setTimeout(() => setColor('#6b7280'), 500);
    return () => {
      controls.stop();
      clearTimeout(timeout);
    };
  }, [value]);

  return (
    <motion.span animate={{ color }} transition={{ duration: 0.4 }}>
      {rounded}
    </motion.span>
  );
}

export default function PollsPage({ onPollClick }) {
  const [polls, setPolls] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOptions, setNewPollOptions] = useState(['', '']);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedPollId, setSelectedPollId] = useState(null);
  const { currentUser } = useAppDataContext(); // ✅ Context에서 최신 사용자 정보
  const { addXP } = useXPSystem();

  // ✅ 데이터 불러오기
  useEffect(() => {
    const savedPolls = localStorage.getItem('polls');
    const storedTeam = localStorage.getItem("selectedTeamForPolls");
    if (savedPolls) setPolls(JSON.parse(savedPolls));
    if (storedTeam) {
      const team = JSON.parse(storedTeam);
      setSelectedTeam(team);
      toast.success(`${team.name} 투표만 표시합니다 ⚾`);
      localStorage.removeItem("selectedTeamForPolls");
    }
  }, []);

  // ✅ 투표하기
  const handleVote = (pollId, optionId) => {
    if (!currentUser) {
      toast.error('로그인 후 투표할 수 있습니다.');
      return;
    }

    const userId = currentUser.username;
    const storedPolls = JSON.parse(localStorage.getItem('polls') || '[]');

    const updatedPolls = storedPolls.map((p) => {
      if (p.id !== pollId) return p;

      const userVotes = p.userVotes || {};
      const previousVote = userVotes[userId] || null;

      let newOptions = [...p.options];
      let updatedUserVotes = { ...userVotes };
      let totalVotes = p.totalVotes;

      if (previousVote === optionId) {
        newOptions = newOptions.map(opt =>
          opt.id === optionId ? { ...opt, votes: Math.max(0, opt.votes - 1) } : opt
        );
        delete updatedUserVotes[userId];
        toast.info('투표가 취소되었습니다.');
      } else {
        newOptions = newOptions.map(opt => {
          if (opt.id === optionId) return { ...opt, votes: opt.votes + 1 };
          if (opt.id === previousVote) return { ...opt, votes: Math.max(0, opt.votes - 1) };
          return opt;
        });
        updatedUserVotes[userId] = optionId;

        // ⭐ 처음 투표한 경우에만 XP 지급
        if (!previousVote) {
          addXP("pollVoted");
        }

        toast.success(previousVote ? '투표가 변경되었습니다!' : '투표가 완료되었습니다!');
      }

      totalVotes = newOptions.reduce((sum, opt) => sum + opt.votes, 0);
      return { ...p, options: newOptions, userVotes: updatedUserVotes, totalVotes };
    });

    localStorage.setItem('polls', JSON.stringify(updatedPolls));
    setPolls([...updatedPolls]);
  };

  // ✅ 투표 생성 (Context 기반)
  const handleCreatePoll = () => {
    if (!newPollQuestion.trim() || newPollOptions.filter(o => o.trim()).length < 2) {
      toast.error('질문과 최소 2개의 선택지를 입력하세요!');
      return;
    }

    const poll = {
      id: Date.now().toString(),
      author: currentUser?.username || '익명',
      avatar: currentUser?.avatar ||
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
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
      userVotes: {},
      team: selectedTeam || null,
    };

    const updatedPolls = [poll, ...polls];
    setPolls(updatedPolls);
    localStorage.setItem('polls', JSON.stringify(updatedPolls));

    setNewPollQuestion('');
    setNewPollOptions(['', '']);
    setShowCreate(false);
    toast.success(`${selectedTeam ? selectedTeam.name + ' 구단' : '전체'} 투표가 생성되었습니다!`);
  };

  const handleDeletePoll = (pollId) => {
    const updatedPolls = polls.filter((p) => p.id !== pollId);
    setPolls(updatedPolls);
    localStorage.setItem('polls', JSON.stringify(updatedPolls));
    toast.success('투표가 삭제되었습니다.');
  };

  const filteredPolls = selectedTeam
    ? polls.filter((poll) => poll.team && poll.team.id === selectedTeam.id)
    : polls;

  return (
    <div className="p-4 space-y-4">
      <TeamSelector selectedTeam={selectedTeam} onSelectTeam={setSelectedTeam} showAll={true} />

      {selectedTeam && (
        <div className="text-center text-sm text-teal-600 dark:text-[#00d5be] mb-2">
          현재 {selectedTeam.emoji} {selectedTeam.name} 투표만 표시 중입니다 ⚾
          <button
            onClick={() => setSelectedTeam(null)}
            className="ml-2 text-gray-500 underline hover:text-gray-700 dark:hover:text-gray-300"
          >
            전체 보기
          </button>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="  bg-gradient-to-br
                from-teal-500 via-cyan-500 to-sky-500
                dark:bg-gradient-to-br
                dark:from-teal-400/70
                dark:via-cyan-400/70
                dark:to-sky-400/70
                dark:backdrop-blur-md                      
                  shadow-inner
                 rounded-2xl p-4 shadow-lg 
                  transition-all
                  text-white"
      >
        {!showCreate ? (
          <button
            onClick={() => setShowCreate(true)}
            className="w-full flex items-center justify-center gap-2 py-2 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            새 투표 만들기
          </button>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <TeamSelector selectedTeam={selectedTeam} onSelectTeam={setSelectedTeam} showAll={false} />
            <input
              value={newPollQuestion}
              onChange={(e) => setNewPollQuestion(e.target.value)}
              placeholder="질문을 입력하세요"
              className="w-full bg-white/20 text-white placeholder-white/70 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            {newPollOptions.map((option, idx) => (
              <motion.input
                key={idx}
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

            <button
              onClick={() => setNewPollOptions([...newPollOptions, ''])}
              className="w-full bg-white/10 text-white/80 rounded-lg px-4 py-2 mt-1 hover:bg-white/20 transition"
            >
              + 옵션 추가
            </button>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 bg-white/20 rounded-full"
              >
                취소
              </button>
              <button
                onClick={handleCreatePoll}
                disabled={!newPollQuestion.trim() || newPollOptions.filter((o) => o.trim()).length < 2}
                className="px-4 py-2 bg-white text-teal-600 rounded-full disabled:opacity-50"
              >
                만들기
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {
        filteredPolls.length > 0 ? (
          filteredPolls.map((poll, index) => (
            <PollCard
              key={poll.id}
              poll={poll}
              index={index}
              onVote={handleVote}
              onDelete={handleDeletePoll}
              isSelected={selectedPollId === poll.id}
              onPollClick={onPollClick}
              currentUser={currentUser} // ✅ context 전달
            />
          ))
        ) : (
          <p className="text-gray-500 text-center py-10">해당 구단의 투표가 없습니다 ⚾</p>
        )
      }
    </div >
  );
}

/* ===============================
   📦 PollCard
================================ */
function PollCard({ poll, index, onVote, onDelete, isSelected, onPollClick, currentUser }) {
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
  const deleteOpacity = useTransform(x, [-150, -50, 0], [1, 0.5, 0]);
  const isMyPoll = poll.author === currentUser?.username;
  const isDeletingRef = useRef(false);

  const userId = currentUser?.username;
  const userVote = poll.userVotes?.[userId];

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    if (Math.abs(info.offset.x) > 100 && isMyPoll) {
      if (isDeletingRef.current) return;

      if (window.confirm('이 투표를 삭제하시겠습니까?')) {
        isDeletingRef.current = true;
        onDelete(poll.id);
      } else {
        x.set(0);
      }
    } else {
      x.set(0);
    }
  };

  const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);
  const winningOption = poll.options.reduce((max, o) => (o.votes > max.votes ? o : max), poll.options[0]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0, scale: isSelected ? 1.02 : 1 }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      {isMyPoll && (
        <motion.div
          className="absolute inset-0 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-end px-6"
          style={{ opacity: deleteOpacity }}
        >
          <Trash2 className="w-6 h-6 text-rose-600 dark:text-rose-400" />
        </motion.div>
      )}

      <motion.div
        drag={isMyPoll ? 'x' : false}
        dragConstraints={{ left: -150, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x, opacity }}
        className={`glass-card rounded-2xl p-4 border transition-all ${isMyPoll ? 'cursor-grab' : ''}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <img
            src={poll.avatar}
            alt={poll.author}
            className="w-10 h-10 rounded-full ring-2 ring-teal-200"
          />
          <div className="flex-1">
            <div className="text-gray-900 dark:text-gray-100">{poll.author}</div>
            <p className="text-gray-500 dark:text-gray-400 text-xs">{poll.timestamp}</p>
          </div>
          {isMyPoll && <Award className="w-6 h-6 text-yellow-500" />}
        </div>

        {poll.team && (
          <div className="flex items-center gap-3 mb-4">
            <TeamLogo team={poll.team} size="md" />
            <span className="text-gray-800 dark:text-gray-100 font-semibold">{poll.team.name}</span>
          </div>
        )}

        <h3 className="text-gray-900 dark:text-gray-100 mb-4">{poll.question}</h3>

        <div className="space-y-2 mb-4">
          {poll.options.map((option, idx) => {
            const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
            const isSelected = userVote === option.id;
            const isWinning = option.id === winningOption.id && poll.totalVotes > 0;
            return (
              <motion.button
                key={option.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onVote(poll.id, option.id)}
                className={`w-full text-left p-3 rounded-xl border-2 relative overflow-hidden ${isSelected
                  ? 'border-teal-600 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700'
                  }`}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1 }}
                  className={`absolute inset-0 ${isWinning
                    ? 'bg-gradient-to-r from-teal-200 to-cyan-200 dark:from-teal-900/50 dark:to-cyan-900/50'
                    : 'bg-teal-100 dark:bg-teal-900/30'
                    }`}
                />
                <div className="relative flex items-center justify-between">
                  <span className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    {option.text}
                    {isSelected && <Check className="w-4 h-4 text-teal-600" />}
                    {isWinning && poll.totalVotes > 0 && <Zap className="w-4 h-4 text-yellow-500" />}
                  </span>
                  <motion.span
                    className="text-gray-600 dark:text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    {percentage}%
                  </motion.span>
                </div>
              </motion.button>
            );
          })}
        </div>

        <p className="text-gray-500 dark:text-gray-400 text-center mt-2">
          총 <AnimatedCount value={poll.totalVotes ?? 0} />명 참여
        </p>
      </motion.div>
    </motion.div>
  );
}
