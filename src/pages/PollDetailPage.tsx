import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { ArrowLeft, Check, Award, Edit2, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import TeamLogo from '../components/yului/TeamLogo';
import TeamAvatar from '../components/yului/TeamAvatar';

/* ===============================
   🧮 AnimatedCount - 부드러운 카운트 + 색상 강조
================================ */
function AnimatedCount({ value }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [color, setColor] = useState('#6b7280'); // 기본 회색

  useEffect(() => {
    const controls = animate(count, value, { duration: 0.6, ease: 'easeOut' });

    // 값이 변할 때 색 잠깐 바뀌기
    setColor(value > count.get() ? '#14b8a6' : '#ef4444'); // 증가=teal, 감소=red
    const timeout = setTimeout(() => setColor('#6b7280'), 500);

    return () => {
      controls.stop();
      clearTimeout(timeout);
    };
  }, [value]);

  return (
    <motion.span
      animate={{ color }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="font-medium"
    >
      {rounded}
    </motion.span>
  );
}
interface PollDetailPageProps {
  pollId: string | null;
  onBack: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}
export default function PollDetailPage({ pollId, onBack, isDarkMode, onToggleDarkMode }: PollDetailPageProps) {
  const [poll, setPoll] = useState(null);
  const [polls, setPolls] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editQuestion, setEditQuestion] = useState('');
  const [editOptions, setEditOptions] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const savedPolls = localStorage.getItem('polls');
    if (savedPolls) {
      const parsed = JSON.parse(savedPolls);
      setPolls(parsed);
      const found = parsed.find(p => p.id === pollId);
      setPoll(found);
      if (found) {
        setEditQuestion(found.question);
        setEditOptions(found.options.map(o => ({ ...o })));
      }
    }
  }, [pollId]);

  /* ✅ 투표/취소/변경 모두 가능하도록 개선 */
  const handleVote = (optionId) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!currentUser) {
      toast.error("로그인 후 투표할 수 있습니다.");
      return;
    }

    const userId = currentUser.username;
    const storedPolls = JSON.parse(localStorage.getItem("polls") || "[]");

    const updatedPolls = storedPolls.map((p) => {
      if (p.id !== pollId) return p;

      const userVotes = p.userVotes || {};
      const previousVote = userVotes[userId] || null;
      let newOptions = [...p.options];
      let updatedUserVotes = { ...userVotes };
      let totalVotes = p.totalVotes;

      if (previousVote === optionId) {
        // 🔹 같은 항목 클릭 → 투표 취소
        newOptions = newOptions.map(opt =>
          opt.id === optionId ? { ...opt, votes: Math.max(0, opt.votes - 1) } : opt
        );
        delete updatedUserVotes[userId];
        totalVotes = newOptions.reduce((sum, opt) => sum + opt.votes, 0);
        toast.info("투표가 취소되었습니다.");
      } else {
        // 🔹 새 항목 선택 or 변경
        newOptions = newOptions.map(opt => {
          if (opt.id === optionId) return { ...opt, votes: opt.votes + 1 };
          if (opt.id === previousVote) return { ...opt, votes: Math.max(0, opt.votes - 1) };
          return opt;
        });
        updatedUserVotes[userId] = optionId;
        totalVotes = newOptions.reduce((sum, opt) => sum + opt.votes, 0);
        toast.success(previousVote ? "투표가 변경되었습니다!" : "투표가 완료되었습니다!");
      }

      return { ...p, options: newOptions, userVotes: updatedUserVotes, totalVotes };
    });

    localStorage.setItem("polls", JSON.stringify(updatedPolls));

    const updatedPoll = JSON.parse(JSON.stringify(updatedPolls.find(p => p.id === pollId)));
    setPoll(updatedPoll);
    setPolls([...updatedPolls]);
  };

  const handleEdit = () => {
    if (!editQuestion.trim()) return toast.error("질문을 입력해주세요");
    const validOptions = editOptions.filter(o => o.text.trim());
    if (validOptions.length < 2) return toast.error("최소 2개의 선택지가 필요합니다");

    const updatedPolls = polls.map(p =>
      p.id === pollId
        ? { ...p, question: editQuestion, options: validOptions, timestamp: "방금 전 (수정됨)" }
        : p
    );

    setPolls(updatedPolls);
    localStorage.setItem("polls", JSON.stringify(updatedPolls));
    setPoll(updatedPolls.find(p => p.id === pollId));
    setIsEditing(false);
    toast.success("투표가 수정되었습니다");
  };

  const handleDelete = () => {
    if (window.confirm("이 투표를 삭제하시겠습니까?")) {
      const updated = polls.filter(p => p.id !== pollId);
      localStorage.setItem("polls", JSON.stringify(updated));
      toast.success("투표가 삭제되었습니다");
      onBack();
    }
  };

  if (!poll)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-400">
        투표를 찾을 수 없습니다.
      </div>
    );

  const winningOption = poll.options.reduce(
    (max, opt) => (opt.votes > max.votes ? opt : max),
    poll.options[0]
  );
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const userId = currentUser?.username;
  const userVote = poll.userVotes?.[userId];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg"
        >
          {/* 작성자 */}
          <div className="flex items-center gap-3 mb-4">
            <TeamAvatar team={poll.team?.name} src={poll.avatar} size="lg" />
            <div className="flex-1">
              <span className="font-medium text-gray-900 dark:text-gray-100">{poll.author}</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">{poll.timestamp}</p>
            </div>
            {poll.author === "나" && !isEditing && (
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDelete}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </motion.button>
              </div>
            )}
          </div>

          {/* 질문 */}
          <h2 className="text-xl text-gray-900 dark:text-gray-100 mb-6">{poll.question}</h2>

          {/* 선택지 */}
          <div className="space-y-3 mb-6">
            {poll.options.map((option) => {
              const percentage =
                poll.totalVotes > 0
                  ? Math.round((option.votes / poll.totalVotes) * 100)
                  : 0;
              const isWinning = option.id === winningOption.id && poll.totalVotes > 0;
              const isVoted = userVote === option.id;

              return (
                <motion.button
                  key={option.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleVote(option.id)}
                  className={`w-full relative overflow-hidden rounded-xl p-4 transition-all ${isVoted
                    ? "ring-2 ring-slate-500 bg-slate-50 dark:bg-slate-900/50"
                    : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                    }`}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`absolute left-0 top-0 bottom-0 ${isVoted ? "bg-slate-500/20" : "bg-gray-200 dark:bg-gray-600"
                      }`}
                  />
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isVoted
                          ? "border-slate-500 bg-slate-500"
                          : "border-gray-300 dark:border-gray-500"
                          }`}
                      >
                        {isVoted && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">
                        {option.text}
                      </span>
                      {isWinning && <Award className="w-5 h-5 text-yellow-500" />}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {option.votes}표
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 min-w-[3rem] text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* ✅ 총 투표 수 애니메이션 */}
          <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              총 <AnimatedCount value={poll.totalVotes ?? 0} />명 참여
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
