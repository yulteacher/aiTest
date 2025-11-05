import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Sparkles, UserPlus } from 'lucide-react';
import { KBO_TEAMS } from '../constants/teams';

export default function LoginPage({ onLogin, navigateTo }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');

    if (username === 'admin' && password === '123456') {
      onLogin({
        username: 'admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        team: KBO_TEAMS[0],
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      onLogin({ username: user.username, avatar: user.avatar, team: user.team });
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-cyan-500 to-sky-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 w-full max-w-md"
      >
        <h1 className="text-center text-white text-2xl mb-4">로그인</h1>

        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="아이디"
          className="w-full px-4 py-3 mb-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:ring-2 focus:ring-white/50 focus:outline-none"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="w-full px-4 py-3 mb-4 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:ring-2 focus:ring-white/50 focus:outline-none"
        />

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-white text-center mb-3">
            {error}
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogin}
          className="w-full bg-white text-teal-700 py-3 rounded-xl flex items-center justify-center gap-2"
        >
          <LogIn className="w-5 h-5" />
          로그인
        </motion.button>

        <p className="text-center mt-6 text-white/80">
          계정이 없으신가요?{' '}
          <span
            onClick={() => navigateTo('signup')}
            className="text-white font-semibold cursor-pointer hover:underline"
          >
            회원가입
          </span>
        </p>

        <motion.button
          type="button"
          onClick={() => {
            setUsername('admin');
            setPassword('123456');
          }}
          whileHover={{ scale: 1.03 }}
          className="w-full bg-white/10 mt-6 p-4 rounded-xl text-center text-white/80 hover:bg-white/20"
        >
          <Sparkles className="inline-block w-4 h-4 mr-2" />
          기본 계정으로 체험하기
        </motion.button>
      </motion.div>
    </div>
  );
}
