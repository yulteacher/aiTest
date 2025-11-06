import { Check } from "lucide-react";
import type { Poll, User } from "../types/interfaces";
import { useLocalData } from "../hooks/useLocalData";

interface PollCardProps {
  poll: Poll;
  onVote: (pollId: string, optionId: string) => void;
}

export function PollCard({ poll, onVote }: PollCardProps) {
  const { currentUser } = useLocalData();

  // ✅ 현재 로그인한 유저가 이미 투표했는지
  const userVote = currentUser ? poll.userVotes[currentUser.id] : null;

  // ✅ 전체 투표수 계산
  const totalVotes =
    poll.totalVotes ||
    poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      {/* 작성자 정보 */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={poll.avatar || "https://placehold.co/40x40?text=?"}
          alt={poll.author}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="text-gray-900 font-semibold">{poll.author}</div>
          <p className="text-gray-500 text-sm">{poll.timestamp}</p>
        </div>
      </div>

      {/* 질문 */}
      <h3 className="text-gray-900 mb-4 font-medium">{poll.question}</h3>

      {/* 투표 옵션 */}
      <div className="space-y-3 mb-4">
        {poll.options.map((option) => {
          const percentage =
            totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
          const isSelected = userVote === option.id;

          return (
            <button
              key={option.id}
              onClick={() => onVote(poll.id, option.id)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all relative overflow-hidden ${isSelected
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:border-purple-300"
                }`}
            >
              <div
                className="absolute inset-0 bg-purple-100 transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
              <div className="relative flex items-center justify-between">
                <span className="text-gray-900 flex items-center gap-2">
                  {option.text}
                  {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                </span>
                <span className="text-gray-600">{percentage}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 투표 수 */}
      <p className="text-gray-500 text-center text-sm">
        총 {totalVotes}명 참여
      </p>
    </div>
  );
}
