import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Check, Plus, Award, Zap, Trash2 } from 'lucide-react';
import TeamSelector from '../components/TeamSelector';
import TeamLogo from '../components/yului/TeamLogo';
import { toast } from 'sonner';

function AnimatedCount({ value }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [color, setColor] = useState('#6b7280'); // 기본 회색 (tailwind gray-500)

  useEffect(() => {
    const controls = animate(count, value, { duration: 0.6, ease: 'easeOut' });

    // 💡 값이 바뀔 때 잠깐 색 강조
    setColor(value > count.get() ? '#14b8a6' : '#ef4444'); // up=teal, down=red
    const timeout = setTimeout(() => setColor('#6b7280'), 500); // 0.5초 후 원래색으로 복귀

    return () => {
      controls.stop();
      clearTimeout(timeout);
    };
  }, [value]);

  return (
    <motion.span
      animate={{ color }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="font-medium"
    >
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

  // ✅ 데이터 불러오기
  useEffect(() => {
    const savedPolls = localStorage.getItem('polls');
    const storedTeam = localStorage.getItem("selectedTeamForPolls");
    if (savedPolls) setPolls(JSON.parse(savedPolls));
    if (storedTeam) {
      const team = JSON.parse(storedTeam);
      setSelectedTeam(team);
      toast.success(`${team.name} 투표만 표시합니다 ⚾`);
      localStorage.removeItem("selectedTeamForPolls"); // 일회성 사용 후 제거
    }
    // ✅ MyPage → 내 구단 투표 보기 이벤트 수신
    const handleViewMyTeamPolls = (event) => {
      const team = event.detail;
      if (team) {
        setSelectedTeam(team);
        toast.success(`${team.name} 투표만 표시합니다 ⚾`);
      }
    };
    window.addEventListener('viewMyTeamPolls', handleViewMyTeamPolls);

    return () => {
      window.removeEventListener('viewMyTeamPolls', handleViewMyTeamPolls);
    };
  }, []);


  // ✅ 투표 기능 (중복 방지 + 변경 가능)
  const handleVote = (pollId: string, optionId: string) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) {
      toast.error('로그인 후 투표할 수 있습니다.');
      return;
    }

    const userId = currentUser.username;
    const storedPolls = JSON.parse(localStorage.getItem('polls') || '[]');

    const updatedPolls = storedPolls.map((p: any) => {
      if (p.id !== pollId) return p;

      const userVotes = p.userVotes || {};
      const previousVote = userVotes[userId] || null;

      let newOptions = [...p.options];
      let updatedUserVotes = { ...userVotes };
      let totalVotes = p.totalVotes;

      if (previousVote === optionId) {
        // 🔹 같은 항목 재클릭 → 투표 취소
        newOptions = newOptions.map(opt =>
          opt.id === optionId ? { ...opt, votes: Math.max(0, opt.votes - 1) } : opt
        );
        delete updatedUserVotes[userId];
        totalVotes = newOptions.reduce((sum, opt) => sum + opt.votes, 0);
        toast.info('투표가 취소되었습니다.');
      } else {
        // 🔹 다른 항목으로 투표 or 새 투표
        newOptions = newOptions.map(opt => {
          if (opt.id === optionId) return { ...opt, votes: opt.votes + 1 };
          if (opt.id === previousVote) return { ...opt, votes: Math.max(0, opt.votes - 1) };
          return opt;
        });
        updatedUserVotes[userId] = optionId;
        totalVotes = newOptions.reduce((sum, opt) => sum + opt.votes, 0);
        toast.success(previousVote ? '투표가 변경되었습니다!' : '투표가 완료되었습니다!');
      }

      return { ...p, options: newOptions, userVotes: updatedUserVotes, totalVotes };
    });

    localStorage.setItem('polls', JSON.stringify(updatedPolls));
    setPolls([...updatedPolls]); // 상태 강제 갱신
  };



  // ✅ 투표 생성
  // ✅ 투표 생성
  const handleCreatePoll = () => {
    if (!newPollQuestion.trim() || newPollOptions.filter(o => o.trim()).length < 2) {
      toast.error('질문과 최소 2개의 선택지를 입력하세요!');
      return;
    }

    // ✅ 현재 로그인한 사용자 정보 가져오기
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const username = currentUser ? currentUser.username : '익명';

    const poll = {
      id: Date.now().toString(),
      author: username, // ✅ '나' → 실제 아이디로 변경
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
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



  // ✅ 투표 삭제
  const handleDeletePoll = (pollId: string) => {
    if (window.confirm('이 투표를 삭제하시겠습니까?')) {
      const updatedPolls = polls.filter((p: any) => p.id !== pollId);
      setPolls(updatedPolls);
      localStorage.setItem('polls', JSON.stringify(updatedPolls));
      toast.success('투표가 삭제되었습니다.');
    }
  };

  const addOption = () => setNewPollOptions([...newPollOptions, '']);
  const filteredPolls = selectedTeam
    ? polls.filter((poll) => poll.team && poll.team.id === selectedTeam.id)
    : polls;

  return (
    <div className="p-4 space-y-4">
      {/* 구단 필터 */}
      <TeamSelector selectedTeam={selectedTeam} onSelectTeam={setSelectedTeam} showAll={true} />

      {/* ✅ 선택된 구단 안내 메시지 */}
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

      {/* 투표 생성 카드 */}
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <TeamSelector
              selectedTeam={selectedTeam}
              onSelectTeam={setSelectedTeam}
              showAll={false}
            />
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

      {/* ✅ 투표 카드 목록 */}
      {filteredPolls.length > 0 ? (
        filteredPolls.map((poll, index) => (
          <PollCard
            key={poll.id}
            poll={poll}
            index={index}
            onVote={handleVote}
            onDelete={handleDeletePoll}
            isSelected={selectedPollId === poll.id}
            onPollClick={onPollClick}
          />
        ))
      ) : (
        <p className="text-gray-500 text-center py-10">해당 구단의 투표가 없습니다 ⚾</p>
      )}
    </div>
  );
}

/* ===============================
   📦 PollCard 컴포넌트
================================ */
function PollCard({ poll, index, onVote, onDelete, isSelected, onPollClick }) {
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
  const deleteOpacity = useTransform(x, [-150, -50, 0], [1, 0.5, 0]);
  const isMyPoll = poll.author === '나';

  const getWinningOption = () =>
    poll.options.reduce((max, opt) => (opt.votes > max.votes ? opt : max), poll.options[0]);
  const winningOption = getWinningOption();

  // ✅ 현재 사용자 투표 확인
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const userId = currentUser?.username;
  const userVote = poll.userVotes?.[userId];

  // 자동 스크롤
  useEffect(() => {
    if (isSelected && cardRef.current)
      setTimeout(() => cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
  }, [isSelected]);

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    if (Math.abs(info.offset.x) > 100 && isMyPoll) onDelete(poll.id);
    else x.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0, scale: isSelected ? 1.02 : 1 }}
      transition={{ delay: index * 0.1, scale: { duration: 0.3 } }}
      className="relative"
    >
      {isMyPoll && (
        <motion.div
          className="absolute inset-0 bg-red-500 rounded-2xl flex items-center justify-end px-6"
          style={{ opacity: deleteOpacity }}
        >
          <Trash2 className="w-6 h-6 text-white" />
        </motion.div>
      )}

      <motion.div
        drag={isMyPoll ? 'x' : false}
        dragConstraints={{ left: -150, right: 0 }}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ x, opacity }}
        className={`glass-card rounded-2xl p-4 transition-all border border-teal-100/50 dark:border-teal-400/20 ${isMyPoll ? 'cursor-grab active:cursor-grabbing' : ''
          } ${isSelected ? 'ring-2 ring-teal-500' : ''}`}
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

        {poll.team && (
          <div className="flex items-center gap-3 mb-4">
            <TeamLogo team={poll.team} size="md" />
            <span className="text-gray-800 dark:text-gray-100 font-semibold">{poll.team.name}</span>
          </div>
        )}

        <h3 className="text-gray-900 dark:text-gray-100 mb-4">{poll.question}</h3>

        <div className="space-y-2 mb-4">
          {poll.options.map((option, idx) => {
            const percentage =
              poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
            const isSelected = userVote === option.id;
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
                  transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
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
