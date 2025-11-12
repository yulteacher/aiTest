import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Camera, CheckCircle2, Search } from "lucide-react";
import { KBO_TEAMS } from "../data/constants/teams";
import { toast } from "sonner";
import TeamLogo from '../components/yului/TeamLogo';
import AnimatedButton from '../components/yului/AnimatedButton';
export default function SignUpPage({ onSignup, navigateTo }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVerified, setIsVerified] = useState(false); // ✅ 중복확인 통과 여부

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;

                // ⚙️ 0.4배 품질로 압축 (캔버스 리사이즈)
                const img = new Image();
                img.src = base64;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d")!;
                    const width = img.width * 0.5;
                    const height = img.height * 0.5;
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    const compressed = canvas.toDataURL("image/jpeg", 0.6);
                    setProfileImage(compressed); // ← 압축된 이미지 저장
                };
            };
            reader.readAsDataURL(file);
        }
    };


    const handleCheckDuplicate = () => {
        const trimmedName = username.trim();
        if (!trimmedName) {
            setError("아이디를 입력해주세요.");
            toast.error("아이디를 입력해주세요 ⚠️");
            return;
        }

        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const isDuplicate = users.some(
            (u) => u.username.trim().toLowerCase() === trimmedName.toLowerCase()
        );

        if (isDuplicate) {
            setError("이미 사용 중인 닉네임입니다 ❌");
            toast.error("이미 사용 중인 닉네임입니다 ❌");
            setIsVerified(false);
        } else {
            setError("");
            toast.success("사용 가능한 닉네임입니다 ✅");
            setIsVerified(true);
        }
    };



    const handleSignup = () => {
        setError("");

        if (!isVerified) {
            toast.error("닉네임 중복 확인을 먼저 해주세요 ⚠️");
            return;
        }

        if (!username || !password || !confirmPassword) {
            setError("모든 필드를 입력해주세요.");
            return;
        }

        if (password !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        if (!selectedTeam) {
            setError("응원 구단을 선택해주세요.");
            return;
        }

        // ✅ 1️⃣ team 객체를 보장
        const teamInfo = KBO_TEAMS.find(t => t.id === selectedTeam.id);

        const newUser = {
            id: `u_${selectedTeam.id}_${Date.now()}`,
            username: username.trim(),
            password,
            teamId: selectedTeam.id,
            team: teamInfo,  // ✅ 반드시 실제 team 객체를 저장
            avatar:
                profileImage ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            xp: 0,
            level: 1,
            badges: [],
            joinedAt: new Date().toISOString(),
            bio: `${selectedTeam.name} 팬이에요! ⚾`,
        };

        // ✅ 2️⃣ localStorage 저장
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const updatedUsers = [...users, newUser];
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        localStorage.setItem("currentUser", JSON.stringify(newUser));

        // ✅ 3️⃣ 상태 업데이트 (App으로 user 전달)
        toast.success(`${newUser.username}님, 가입을 환영합니다 🎉`);
        onSignup(newUser);

        // ✅ 바로 홈으로 이동
        navigateTo("home");

        // ✅ 4️⃣ 초기화
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setSelectedTeam(null);
        setProfileImage(null);
        setIsVerified(false);
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-600 via-cyan-500 to-sky-600 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 w-full max-w-md"
            >
                <h1 className="text-center text-white text-2xl mb-4">회원가입</h1>

                {/* ✅ 아이디 + 중복확인 */}
                <div className="flex gap-2 mb-3">
                    <input
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setIsVerified(false); // 입력 변경 시 다시 확인 필요
                        }}
                        placeholder="아이디"
                        className="flex-1 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:ring-2 focus:ring-white/50 focus:outline-none"
                    />
                    <button
                        onClick={handleCheckDuplicate}
                        className="px-3 bg-white text-teal-700 rounded-xl flex items-center gap-1 hover:bg-teal-100 transition-colors"
                    >
                        <Search className="w-4 h-4" />
                        중복확인
                    </button>
                </div>

                {/* ✅ 중복확인 결과 메시지 */}
                {error && !isVerified && (
                    <div className="flex items-center gap-2 text-red-400 text-sm mb-3">
                        ❌ {error}
                    </div>
                )}

                {isVerified && (
                    <div className="flex items-center gap-2 text-green-400 text-sm mb-3">
                        <CheckCircle2 className="w-4 h-4" /> 중복 확인 완료!
                    </div>
                )}
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호"
                    className="w-full px-4 py-3 mb-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:ring-2 focus:ring-white/50 focus:outline-none"
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="비밀번호 확인"
                    className="w-full px-4 py-3 mb-4 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:ring-2 focus:ring-white/50 focus:outline-none"
                />


                {/* ✅ 이미지 업로드 */}
                <label className="block text-white mb-3">프로필 이미지</label>
                <div className="flex items-center gap-4 mb-4">
                    {/* ✅ 업로드 이미지가 있으면 우선 표시 */}
                    {profileImage ? (
                        <img
                            src={profileImage}
                            alt="프로필 미리보기"
                            className="w-16 h-16 rounded-full object-cover border-2 border-white/40"
                        />
                    ) : selectedTeam ? (
                        // ✅ 팀 선택 시 팀 로고 표시
                        <img
                            src={`/logos/${selectedTeam.id}.png`}
                            alt={selectedTeam.name}
                            className="w-16 h-16 rounded-full bg-white/90 p-2 object-contain border border-white/30"
                        />
                    ) : (
                        // ✅ 아무것도 없을 때 기본 영역
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-sm">
                            없음
                        </div>
                    )}

                    {/* ✅ 업로드 버튼 */}
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
                </div>


                {/* ✅ 구단 선택 영역 */}
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2 scrollbar-liquid-glass">
                    {KBO_TEAMS.map((team) => (
                        <motion.button
                            key={team.id}
                            type="button"
                            onClick={() => setSelectedTeam(team)}
                            whileTap={{ scale: 0.95 }}
                            className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${selectedTeam?.id === team.id
                                ? "border-white bg-white/30 scale-105 shadow-lg"
                                : "border-white/30 bg-white/10 hover:bg-white/20"
                                }`}
                        >
                            {/* ✅ 기존 emoji 대신 TeamLogo로 교체 */}
                            <TeamLogo team={team} size="lg" />
                            <div className="text-white text-sm text-center mt-1">{team.name}</div>
                        </motion.button>
                    ))}
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-white text-center my-3">
                        {error}
                    </div>
                )}

                <AnimatedButton
                    label="회원가입"
                    icon={UserPlus}
                    onClick={handleSignup}
                    disabled={isSubmitting}
                />

                <p className="text-center mt-6 text-white/80">
                    이미 계정이 있으신가요?{" "}
                    <span
                        onClick={() => navigateTo("login")}
                        className="text-white font-semibold cursor-pointer hover:underline"
                    >
                        로그인
                    </span>
                </p>
            </motion.div>
        </div>
    );
}
