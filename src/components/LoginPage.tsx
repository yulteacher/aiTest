import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, Sparkles, ChevronRight, Camera } from 'lucide-react';
import { KBO_TEAMS } from '../constants/teams';
import TeamAvatar from './TeamAvatar';

export default function LoginPage({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const handleLogin = () => {
    setError('');
    
    // 기본 admin 계정 체크
    if (username === 'admin' && password === '123456') {
      onLogin({ 
        username: 'admin', 
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        team: KBO_TEAMS[0],
      });
      return;
    }

    // 로컬스토리지에서 사용자 확인
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      onLogin({ username: user.username, avatar: user.avatar, team: user.team });
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const handleSignup = () => {
    setError('');

    if (!username || !password || !confirmPassword) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    if (!selectedTeam) {
      setError('응원하는 구단을 선택해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (username === 'admin') {
      setError('이미 사용중인 아이디입니다.');
      return;
    }

    // 기존 사용자 확인
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.username === username)) {
      setError('이미 사용중인 아이디입니다.');
      return;
    }

    // 새 사용자 추가
    const newUser = {
      username,
      password,
      avatar: profileImage || null, // 이미지 없으면 null (TeamAvatar가 기본 이미지 표시)
      team: selectedTeam,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // 자동 로그인
    onLogin({ username: newUser.username, avatar: newUser.avatar, team: newUser.team });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      handleSignup();
    } else {
      handleLogin();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-cyan-500 to-sky-600 flex items-center justify-center p-4">
      {/* 배경 애니메이션 */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: -20,
              opacity: 0.3,
            }}
            animate={{
              y: window.innerHeight + 20,
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* 로고 */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-6xl mb-4"
          >
            ⚾
          </motion.div>
          <h1 className="text-white mb-2">KBO 팬덤</h1>
          <p className="text-white/80">
            {isSignup ? '10개 구단 팬들이 모이는 곳' : 'KBO 팬들의 커뮤니티'}
          </p>
        </div>

        {/* 로그인/회원가입 폼 */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white mb-2">아이디</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="아이디를 입력하세요"
                className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            <div>
              <label className="block text-white mb-2">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            {isSignup && (
              <>
                <div>
                  <label className="block text-white mb-2">비밀번호 확인</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="비밀번호를 다시 입력하세요"
                    className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>

                <div>
                  <label className="block text-white mb-3">프로필 이미지</label>
                  <div className="flex items-center gap-4">
                    <TeamAvatar
                      team={selectedTeam?.name}
                      src={profileImage}
                      size="xl"
                    />
                    <div className="flex-1">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl border border-white/30 transition-colors">
                        <Camera className="w-5 h-5" />
                        <span>이미지 선택</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      {!profileImage && selectedTeam && (
                        <p className="text-white/70 text-sm mt-2">
                          이미지를 선택하지 않으면 {selectedTeam.name} 구단 색상이 기본으로 적용됩니다.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-3">응원하는 구단</label>
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2 scrollbar-liquid-glass">
                    {KBO_TEAMS.map((team) => (
                      <motion.button
                        key={team.id}
                        type="button"
                        onClick={() => setSelectedTeam(team)}
                        whileTap={{ scale: 0.95 }}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          selectedTeam?.id === team.id
                            ? 'border-white bg-white/30'
                            : 'border-white/30 bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        <div className="text-3xl mb-1">{team.emoji}</div>
                        <div className="text-white text-sm">{team.name}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-white text-center"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white text-teal-700 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg"
            >
              {isSignup ? (
                <>
                  <UserPlus className="w-5 h-5" />
                  회원가입
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  로그인
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
                setUsername('');
                setPassword('');
                setConfirmPassword('');
                setSelectedTeam(null);
              }}
              className="text-white/80 hover:text-white transition-colors"
            >
              {isSignup ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
            </button>
          </div>

          {!isSignup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 pt-6 border-t border-white/20"
            >
              <button
                type="button"
                onClick={() => {
                  setUsername('admin');
                  setPassword('123456');
                }}
                className="w-full bg-white/10 hover:bg-white/20 rounded-xl p-4 text-center transition-colors group"
              >
                <div className="text-white/80 group-hover:text-white mb-2 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  기본 계정으로 체험하기
                </div>
                <p className="text-white/60 text-sm">ID: admin</p>
                <p className="text-white/60 text-sm">PW: 123456</p>
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
