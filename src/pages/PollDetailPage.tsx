// ===============================
// PollDetailPage.tsx (상세뷰 + PollsPage UI + 동일 로직)
// ===============================

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ArrowLeft, Check, Trash2, Zap } from "lucide-react";
import { toast } from "sonner";
import TeamLogo from "../components/yului/TeamLogo";
import { useAppDataContext } from "../context/AppDataContext";
import { useXPSystem } from "../hooks/useXPSystem";

/* ===============================
   AnimatedCount
================================ */
function AnimatedCount({ value }) {
  const count = useMotionValue(value);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  const prevRef = useRef(value);
  const [color, setColor] = useState("#6B7280");

  useEffect(() => {
    const previous = prevRef.current;

    // 숫자 증가 애니메이션
    animate(count, value, {
      duration: 0.6,
      ease: "easeOut",
    });

    // 색상 변화 로직 (진짜 previous vs 현재 비교)
    if (value > previous) {
      setColor("#16A34A"); // green
    } else if (value < previous) {
      setColor("#DC2626"); // red
    }

    // 다음 비교를 위해 저장
    prevRef.current = value;

    // 기본색 복귀
    const reset = setTimeout(() => setColor("#6B7280"), 500);

    return () => clearTimeout(reset);
  }, [value]);

  return <motion.span animate={{ color }}>{rounded}</motion.span>;
}



/* ===============================
   PollDetailPage Component
================================ */
export default function PollDetailPage({ pollId, onBack }) {
  const { currentUser } = useAppDataContext();
  const { addXP } = useXPSystem();
  const [poll, setPoll] = useState(null);

  // 로컬스토리지 기반 (PollsPage와 동일)
  useEffect(() => {
    const storedPolls = JSON.parse(localStorage.getItem("polls") || "[]");
    const found = storedPolls.find((p) => p.id === pollId);
    if (found) setPoll(found);
  }, [pollId]);

  if (!poll)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        투표를 찾을 수 없습니다.
      </div>
    );

  const userId = currentUser?.username;
  const userVote = poll.userVotes?.[userId];

  /* ===============================
     투표하기 (PollsPage와 100% 동일)
  =============================== */
  const handleVote = (optionId) => {
    if (!currentUser) {
      toast.error("로그인 후 투표할 수 있습니다.");
      return;
    }

    const storedPolls = JSON.parse(localStorage.getItem("polls") || "[]");

    const updatedPolls = storedPolls.map((p) => {
      if (p.id !== poll.id) return p;

      const userVotes = p.userVotes || {};
      const previousVote = userVotes[userId] || null;

      let newOptions = [...p.options];
      let updatedUserVotes = { ...userVotes };

      if (previousVote === optionId) {
        newOptions = newOptions.map((opt) =>
          opt.id === optionId
            ? { ...opt, votes: Math.max(0, opt.votes - 1) }
            : opt
        );
        delete updatedUserVotes[userId];
        toast.info("투표가 취소되었습니다.");
      } else {
        newOptions = newOptions.map((opt) => {
          if (opt.id === optionId) return { ...opt, votes: opt.votes + 1 };
          if (opt.id === previousVote)
            return { ...opt, votes: Math.max(0, opt.votes - 1) };
          return opt;
        });

        updatedUserVotes[userId] = optionId;

        // ⭐ 처음 투표한 경우에만 XP 지급
        if (!previousVote) {
          addXP("pollVoted");
        }

        toast.success(previousVote ? "투표가 변경되었습니다!" : "투표 완료!");
      }

      const totalVotes = newOptions.reduce((s, o) => s + o.votes, 0);

      return {
        ...p,
        options: newOptions,
        userVotes: updatedUserVotes,
        totalVotes,
      };
    });

    // 저장
    localStorage.setItem("polls", JSON.stringify(updatedPolls));

    // ⭐ 최신 poll 다시 가져와서 상세페이지에 반영
    const freshPoll = updatedPolls.find((p) => p.id === poll.id);
    setPoll(freshPoll);
  };


  /* ===============================
     삭제하기
  =============================== */
  const handleDelete = () => {
    if (!window.confirm("정말 삭제할까요?")) return;

    const storedPolls = JSON.parse(localStorage.getItem("polls") || "[]");
    const updated = storedPolls.filter((p) => p.id !== poll.id);
    localStorage.setItem("polls", JSON.stringify(updated));
    toast.success("투표가 삭제되었습니다.");
    onBack();
  };

  const totalVotes = poll.options.reduce((s, o) => s + o.votes, 0);
  const winning = poll.options.reduce(
    (max, o) => (o.votes > max.votes ? o : max),
    poll.options[0]
  );

  return (
    <div className="min-h-screen px-4 py-6 bg-gray-50 dark:bg-gray-900">
      {/* 🔹 상세 카드 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0, scale: 1.02 }}
        className="glass-card rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700"
      >
        {/* 작성자 */}
        <div className="flex items-center gap-3 mb-4">
          <img src={poll.avatar} className="w-12 h-12 rounded-full ring-2 ring-teal-300" />
          <div className="flex-1">
            <div className="font-semibold text-gray-900 dark:text-gray-100">{poll.author}</div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{poll.timestamp}</p>
          </div>

          {poll.author === currentUser?.username && (
            <button onClick={handleDelete} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full">
              <Trash2 className="w-5 h-5 text-red-500" />
            </button>
          )}
        </div>

        {/* 팀 */}
        {poll.team && (
          <div className="flex items-center gap-3 mb-4">
            <TeamLogo team={poll.team} size="md" />
            <span className="font-medium text-gray-900 dark:text-gray-100">{poll.team.name}</span>
          </div>
        )}

        {/* 질문 */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {poll.question}
        </h2>

        {/* 옵션 */}
        <div className="space-y-3 mb-6">
          {poll.options.map((opt) => {
            const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
            const isSelected = userVote === opt.id;
            const isWinning = opt.id === winning.id && poll.totalVotes > 0;

            return (
              <motion.button
                key={opt.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleVote(opt.id)}
                className={`w-full text-left p-4 rounded-xl border-2 relative overflow-hidden ${isSelected ? "border-teal-600 shadow-lg" : "border-gray-200 dark:border-gray-700"
                  }`}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  className={`absolute inset-0 ${isWinning
                    ? "bg-gradient-to-r from-teal-200 to-cyan-200 dark:from-teal-800/10 dark:to-cyan-800/10"
                    : "bg-teal-100 dark:bg-white/5"
                    }`}
                />

                <div className="relative flex items-center justify-between">
                  <span className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-300">
                    {opt.text}
                    {isSelected && <Check className="w-4 h-4 text-teal-600" />}
                    {isWinning && <Zap className="w-4 h-4 text-yellow-500" />}
                  </span>
                  <span className="text-gray-700 dark:text-gray-500">{percentage}%</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* 총 투표 수 */}
        <p className="text-center text-gray-500 dark:text-gray-400">
          총 <AnimatedCount value={totalVotes} />명 참여
        </p>
      </motion.div>
    </div>
  );
}
