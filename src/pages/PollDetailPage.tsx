// ===============================
// PollDetailPage.tsx (정식 패치본)
// ===============================
import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Check, Award, Trash2 } from "lucide-react";
import { toast } from "sonner";
import TeamAvatar from "../components/yului/TeamAvatar";
import { useAppDataContext } from "../context/AppDataContext";
import { useXPSystem } from "../hooks/useXPSystem";

/* ===============================
   AnimatedCount
================================ */
function AnimatedCount({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [color, setColor] = useState("#6b7280");

  useEffect(() => {
    const controls = animate(count, value, { duration: 0.6, ease: "easeOut" });

    setColor(value > count.get() ? "#14b8a6" : "#ef4444");
    const timeout = setTimeout(() => setColor("#6b7280"), 500);

    return () => {
      controls.stop();
      clearTimeout(timeout);
    };
  }, [value]);

  return (
    <motion.span animate={{ color }} className="font-medium">
      {rounded}
    </motion.span>
  );
}

/* ===============================
   PollDetailPage Props 타입
================================ */
interface PollDetailPageProps {
  pollId: string | null;
  onBack: () => void;
  isDarkMode?: boolean;
}

/* ===============================
   PollDetailPage Component
================================ */
export default function PollDetailPage({ pollId, onBack, isDarkMode }: PollDetailPageProps) {
  const { polls, updatePoll, deletePoll, currentUser } = useAppDataContext();
  const { addXP } = useXPSystem();

  const [poll, setPoll] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const found = polls.find((p) => String(p.id) === String(pollId));
    if (found) setPoll(found);
  }, [pollId, polls]);

  /* ===============================
     투표 기능
  =============================== */
  const handleVote = (optionId: string) => {
    if (!currentUser) {
      toast.error("로그인 후 투표할 수 있습니다.");
      return;
    }
    if (!poll) return;

    // 🔥 유저 고유 ID 사용 (username 금지)
    const userId = currentUser.id;

    const previousVote = poll.userVotes?.[userId] || null;
    const isCancelling = previousVote === optionId;

    let newUserVotes = { ...poll.userVotes };
    let newOptions = poll.options.map((opt: any) => ({ ...opt }));

    // =========================
    // case 1: 투표 취소
    // =========================
    if (isCancelling) {
      newUserVotes = { ...newUserVotes };
      delete newUserVotes[userId];

      newOptions = newOptions.map((opt) =>
        opt.id === optionId ? { ...opt, votes: Math.max(0, opt.votes - 1) } : opt
      );

      toast.info("투표가 취소되었습니다.");
    }

    // =========================
    // case 2: 새 투표 또는 변경
    // =========================
    else {
      newUserVotes[userId] = optionId;

      newOptions = newOptions.map((opt) => {
        if (opt.id === optionId) return { ...opt, votes: opt.votes + 1 };
        if (opt.id === previousVote) return { ...opt, votes: Math.max(0, opt.votes - 1) };
        return opt;
      });

      toast.success(previousVote ? "투표가 변경되었습니다!" : "투표 완료!");
      addXP("pollVoted");
    }

    // ⭐ 항상 전체 표 다시 계산
    const totalVotes = newOptions.reduce((sum, opt) => sum + opt.votes, 0);

    const updatedPoll = {
      ...poll,
      options: newOptions,
      userVotes: newUserVotes,
      totalVotes,
    };

    updatePoll(updatedPoll);
    setPoll(updatedPoll);
  };


  /* ===============================
     투표 삭제
  =============================== */
  const handleDelete = () => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    deletePoll(String(pollId));
    toast.success("투표가 삭제되었습니다.");
    onBack();
  };

  if (!poll)
    return (
      <div className="min-h-screen flex items-center justify-center">
        투표를 찾을 수 없습니다.
      </div>
    );

  const winningOption = poll.options.reduce(
    (max: any, o: any) => (o.votes > max.votes ? o : max),
    poll.options[0]
  );

  const userVote = poll.userVotes?.[currentUser?.username];

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
              <span className="font-medium">{poll.author}</span>
              <p className="text-sm text-gray-500">{poll.timestamp}</p>
            </div>

            {poll.author === currentUser?.username && (
              <button
                onClick={handleDelete}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            )}
          </div>

          {/* 질문 */}
          <h2 className="text-xl mb-6">{poll.question}</h2>

          {/* 선택지 */}
          <div className="space-y-3 mb-6">
            {poll.options.map((opt: any) => {
              const pct =
                poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;

              const isVoted = userVote === opt.id;

              return (
                <motion.button
                  key={opt.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleVote(opt.id)}
                  className={`w-full relative rounded-xl p-4 transition-all ${isVoted ? "ring-2 ring-teal-600 bg-teal-50" : "bg-gray-50 dark:bg-gray-700"
                    }`}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    className={`absolute inset-0 ${isVoted ? "bg-teal-300/20" : "bg-gray-200 dark:bg-gray-600"
                      }`}
                  />

                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isVoted ? "border-teal-500 bg-teal-500" : "border-gray-300"
                          }`}
                      >
                        {isVoted && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <span className="font-medium">{opt.text}</span>
                      {winningOption.id === opt.id && (
                        <Award className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>

                    <span className="text-sm font-medium">{pct}%</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* 총 투표 수 */}
          <div className="text-center pt-4 border-t">
            총 <AnimatedCount value={poll.totalVotes} />명 참여
          </div>
        </motion.div>
      </div>
    </div>
  );
}
