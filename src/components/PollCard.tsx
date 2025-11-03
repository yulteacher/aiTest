import { Check } from 'lucide-react';
import type { Poll } from '../App';

interface PollCardProps {
  poll: Poll;
  onVote: (pollId: string, optionId: string) => void;
}

export function PollCard({ poll, onVote }: PollCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <img
          src={poll.avatar}
          alt={poll.author}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <div className="text-gray-900">{poll.author}</div>
          <p className="text-gray-500">{poll.timestamp}</p>
        </div>
      </div>

      <h3 className="text-gray-900 mb-4">{poll.question}</h3>

      <div className="space-y-3 mb-4">
        {poll.options.map(option => {
          const percentage = poll.totalVotes > 0
            ? Math.round((option.votes / poll.totalVotes) * 100)
            : 0;
          const isSelected = poll.userVoted === option.id;

          return (
            <button
              key={option.id}
              onClick={() => onVote(poll.id, option.id)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all relative overflow-hidden ${
                isSelected
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div
                className="absolute inset-0 bg-purple-100 transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
              <div className="relative flex items-center justify-between">
                <span className="text-gray-900 flex items-center gap-2">
                  {option.text}
                  {isSelected && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </span>
                <span className="text-gray-600">
                  {percentage}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-gray-500 text-center">
        총 {poll.totalVotes}명 참여
      </p>
    </div>
  );
}
