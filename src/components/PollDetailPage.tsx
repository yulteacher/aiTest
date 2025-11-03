import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Award, Edit2, Trash2, Save, X, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';
import TeamLogo from './TeamLogo';
import TeamAvatar from './TeamAvatar';

export default function PollDetailPage({ pollId, onBack, isDarkMode, onToggleDarkMode }) {
  const [poll, setPoll] = useState(null);
  const [polls, setPolls] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editQuestion, setEditQuestion] = useState('');
  const [editOptions, setEditOptions] = useState([]);

  useEffect(() => {
    // 스크롤을 최상단으로
    window.scrollTo(0, 0);
    
    const savedPolls = localStorage.getItem('polls');
    if (savedPolls) {
      const parsedPolls = JSON.parse(savedPolls);
      setPolls(parsedPolls);
      const foundPoll = parsedPolls.find(p => p.id === pollId);
      setPoll(foundPoll);
      if (foundPoll) {
        setEditQuestion(foundPoll.question);
        setEditOptions(foundPoll.options.map(o => ({ ...o })));
      }
    }
  }, [pollId]);

  const handleVote = (optionId) => {
    const isRevote = poll.userVoted !== null;
    
    const updatedPolls = polls.map(p => {
      if (p.id === pollId) {
        const newOptions = p.options.map(option => {
          if (option.id === optionId) {
            return { ...option, votes: option.votes + 1 };
          }
          if (p.userVoted && option.id === p.userVoted) {
            return { ...option, votes: option.votes - 1 };
          }
          return option;
        });

        return {
          ...p,
          options: newOptions,
          totalVotes: p.userVoted ? p.totalVotes : p.totalVotes + 1,
          userVoted: optionId,
        };
      }
      return p;
    });

    setPolls(updatedPolls);
    localStorage.setItem('polls', JSON.stringify(updatedPolls));
    const updatedPoll = updatedPolls.find(p => p.id === pollId);
    setPoll(updatedPoll);
    
    if (isRevote) {
      toast.success('투표가 변경되었습니다!');
    } else {
      toast.success('투표가 완료되었습니다!');
    }
  };

  const handleEdit = () => {
    if (!editQuestion.trim()) {
      toast.error('질문을 입력해주세요');
      return;
    }

    const validOptions = editOptions.filter(o => o.text.trim());
    if (validOptions.length < 2) {
      toast.error('최소 2개의 선택지가 필요합니다');
      return;
    }

    const updatedPolls = polls.map(p => {
      if (p.id === pollId) {
        return {
          ...p,
          question: editQuestion,
          options: validOptions,
          timestamp: '방금 전 (수정됨)'
        };
      }
      return p;
    });

    setPolls(updatedPolls);
    localStorage.setItem('polls', JSON.stringify(updatedPolls));
    const updatedPoll = updatedPolls.find(p => p.id === pollId);
    setPoll(updatedPoll);
    setIsEditing(false);
    toast.success('투표가 수정되었습니다');
  };

  const handleDelete = () => {
    if (window.confirm('이 투표를 삭제하시겠습니까?')) {
      const updatedPolls = polls.filter(p => p.id !== pollId);
      setPolls(updatedPolls);
      localStorage.setItem('polls', JSON.stringify(updatedPolls));
      toast.success('투표가 삭제되었습니다');
      onBack();
    }
  };

  const getWinningOption = () => {
    if (!poll) return null;
    return poll.options.reduce((max, option) => 
      option.votes > max.votes ? option : max
    , poll.options[0]);
  };

  if (!poll) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">투표를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const winningOption = getWinningOption();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg"
        >
          {/* 작성자 정보 */}
          <div className="flex items-center gap-3 mb-4">
            <TeamAvatar
              team={poll.team?.name}
              src={poll.avatar}
              size="lg"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 dark:text-gray-100">{poll.author}</span>
                {poll.team && <TeamLogo team={poll.team} size="sm" />}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{poll.timestamp}</span>
            </div>
            {poll.author === '나' && !isEditing && (
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

          {isEditing ? (
            <div className="space-y-4">
              {/* 질문 수정 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  질문
                </label>
                <input
                  type="text"
                  value={editQuestion}
                  onChange={(e) => setEditQuestion(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="질문을 입력하세요"
                />
              </div>

              {/* 선택지 수정 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  선택지
                </label>
                <div className="space-y-2">
                  {editOptions.map((option, index) => (
                    <input
                      key={option.id}
                      type="text"
                      value={option.text}
                      onChange={(e) => {
                        const newOptions = [...editOptions];
                        newOptions[index].text = e.target.value;
                        setEditOptions(newOptions);
                      }}
                      className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
                      placeholder={`선택지 ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex gap-2 justify-end pt-4">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditQuestion(poll.question);
                    setEditOptions(poll.options.map(o => ({ ...o })));
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  취소
                </button>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-slate-600 text-white rounded-xl hover:bg-slate-700 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  저장
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* 질문 */}
              <h2 className="text-xl text-gray-900 dark:text-gray-100 mb-6">{poll.question}</h2>

              {/* 선택지 */}
              <div className="space-y-3 mb-6">
                {poll.options.map((option) => {
                  const percentage = poll.totalVotes > 0 
                    ? Math.round((option.votes / poll.totalVotes) * 100) 
                    : 0;
                  const isWinning = winningOption && option.id === winningOption.id && poll.totalVotes > 0;
                  const isVoted = poll.userVoted === option.id;

                  return (
                    <motion.button
                      key={option.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleVote(option.id)}
                      className={`w-full relative overflow-hidden rounded-xl p-4 transition-all ${
                        isVoted
                          ? 'ring-2 ring-slate-500 bg-slate-50 dark:bg-slate-900/50'
                          : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      {/* 진행 바 */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className={`absolute left-0 top-0 bottom-0 ${
                          isVoted
                            ? 'bg-slate-500/20'
                            : 'bg-gray-200 dark:bg-gray-600'
                        }`}
                      />

                      {/* 내용 */}
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            isVoted
                              ? 'border-slate-500 bg-slate-500'
                              : 'border-gray-300 dark:border-gray-500'
                          }`}>
                            {isVoted && <Check className="w-4 h-4 text-white" />}
                          </div>
                          <span className="text-gray-900 dark:text-gray-100 font-medium">
                            {option.text}
                          </span>
                          {isWinning && (
                            <Award className="w-5 h-5 text-yellow-500" />
                          )}
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

              {/* 총 투표 수 */}
              <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  총 <span className="font-medium text-gray-900 dark:text-gray-100">{poll.totalVotes}</span>명 참여
                </p>
              </div>
            </>
          )}
        </motion.div>

        {/* 투표 참여 안내 */}
        {!poll.userVoted && !isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4"
          >
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 원하는 항목을 선택하여 투표에 참여하세요!
            </p>
          </motion.div>
        )}

        {/* 재투표 안내 */}
        {poll.userVoted && !isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4"
          >
            <p className="text-sm text-green-800 dark:text-green-200">
              ✅ 투표 완료! 다른 항목을 선택하면 투표를 변경할 수 있습니다.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
