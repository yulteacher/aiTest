import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Camera } from 'lucide-react';
import { KBO_TEAMS } from '../constants/teams';
import TeamAvatar from './TeamAvatar';

export default function SignUpPage({ onSignup, navigateTo }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [error, setError] = useState('');

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfileImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSignup = () => {
        setError('');

        if (!username || !password || !confirmPassword) {
            setError('모든 필드를 입력해주세요.');
            return;
        }

        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!selectedTeam) {
            setError('응원 구단을 선택해주세요.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(u => u.username === username)) {
            setError('이미 사용중인 아이디입니다.');
            return;
        }

        const newUser = {
            username,
            password,
            avatar: profileImage || null,
            team: selectedTeam,
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        onSignup(newUser);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-600 via-cyan-500 to-sky-600 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 w-full max-w-md"
            >
                <h1 className="text-center text-white text-2xl mb-4">회원가입</h1>

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
                    className="w-full px-4 py-3 mb-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:ring-2 focus:ring-white/50 focus:outline-none"
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="비밀번호 확인"
                    className="w-full px-4 py-3 mb-4 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:ring-2 focus:ring-white/50 focus:outline-none"
                />

                {/* 이미지 업로드 */}
                <label className="block text-white mb-3">프로필 이미지</label>
                <div className="flex items-center gap-4 mb-4">
                    <TeamAvatar team={selectedTeam?.name} src={profileImage} size="xl" />
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl border border-white/30 transition-colors">
                        <Camera className="w-5 h-5" />
                        <span>이미지 선택</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                </div>

                {/* 구단 선택 */}
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2 scrollbar-liquid-glass">
                    {KBO_TEAMS.map(team => (
                        <motion.button
                            key={team.id}
                            type="button"
                            onClick={() => setSelectedTeam(team)}
                            whileTap={{ scale: 0.95 }}
                            className={`p-3 rounded-xl border-2 transition-all ${selectedTeam?.id === team.id
                                    ? 'border-white bg-white/30'
                                    : 'border-white/30 bg-white/10 hover:bg-white/20'
                                }`}
                        >
                            <div className="text-3xl mb-1">{team.emoji}</div>
                            <div className="text-white text-sm">{team.name}</div>
                        </motion.button>
                    ))}
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-white text-center my-3">
                        {error}
                    </div>
                )}

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSignup}
                    className="w-full bg-white text-teal-700 py-3 rounded-xl flex items-center justify-center gap-2"
                >
                    <UserPlus className="w-5 h-5" />
                    회원가입
                </motion.button>

                <p className="text-center mt-6 text-white/80">
                    이미 계정이 있으신가요?{' '}
                    <span
                        onClick={() => navigateTo('login')}
                        className="text-white font-semibold cursor-pointer hover:underline"
                    >
                        로그인
                    </span>
                </p>
            </motion.div>
        </div>
    );
}
