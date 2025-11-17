import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import AnimatedButton from '../components/yului/AnimatedButton';
import Iridescence from '../components/reactbits/Iridescence';
import { useAppDataContext } from "../context/AppDataContext";

export default function LoginPage({ onLogin, navigateTo }) {
  const { setCurrentUser } = useAppDataContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');

    if (!username || !password) {
      toast.error("아이디와 비밀번호를 입력해주세요 ⚠️");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find(
      (u) =>
        u.username.trim().toLowerCase() === username.trim().toLowerCase() &&
        u.password === password
    );

    if (!foundUser) {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      toast.error("로그인 실패 ❌");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(foundUser));
    setCurrentUser(foundUser);     // 🔥 필수! MainApp에 로그인 전달
    toast.success(`${foundUser.username}님, 환영합니다 🎉`);
    onLogin(foundUser);
    navigateTo("home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-cyan-500 to-sky-600 flex items-center justify-center p-4">
      {/* 배경 애니메이션 */}
      <div className="absolute inset-0 overflow-hidden">
        <Iridescence
          color={[0.3, 0.7, 0.9]}
          mouseReact={true}
          amplitude={0.05}
          speed={1.0}
        />
      </div>
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

        <AnimatedButton
          label="로그인"
          icon={LogIn}
          onClick={handleLogin}
        />

        <p className="text-center mt-6 text-white/80">
          계정이 없으신가요?{" "}
          <span
            onClick={() => navigateTo("signup")}
            className="text-white font-semibold cursor-pointer hover:underline"
          >
            회원가입
          </span>
        </p>

        <motion.button
          type="button"
          onClick={() => {
            setUsername("admin");
            setPassword("123456");
          }}
          whileHover={{ scale: 1.003 }}
          className="w-full bg-white/10 mt-6 p-4 rounded-xl text-center text-white/60 cursor-pointer border border-white/20"
        >
          <div className="text-white/60 text-center mb-3">
            <Sparkles className="w-4 h-4 inline mr-2" />
            기본 계정으로 체험하기
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center hover:bg-white/20">
            <p className="text-white">ID: admin</p>
            <p className="text-white">PW: 123456</p>
          </div>
        </motion.button>
      </motion.div>
    </div >
  );
}
