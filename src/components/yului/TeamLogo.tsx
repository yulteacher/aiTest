import { motion } from "framer-motion";

interface TeamLogoProps {
  team?: any; // 기존 그대로 (객체 or string 가능)
  teamId?: string; // ✅ 추가
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export default function TeamLogo({ team, teamId, size = "md" }: TeamLogoProps) {
  const sizeClasses = {
    xs: "w-4 h-4",
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
    xl: "w-24 h-24 text-xl",
  };

  const emojiSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-5xl",
  };

  const TEAM_DATA: Record<string, { name: string; gradient: string; emoji: string }> = {
    kia: { name: "KIA 타이거즈", gradient: "from-red-500 to-yellow-500", emoji: "🐯" },
    hanwha: { name: "한화 이글스", gradient: "from-orange-400 to-red-500", emoji: "🦅" },
    doosan: { name: "두산 베어스", gradient: "from-blue-500 to-gray-500", emoji: "🐻" },
    lg: { name: "LG 트윈스", gradient: "from-pink-500 to-purple-600", emoji: "💗" },
    kt: { name: "KT 위즈", gradient: "from-black to-red-500", emoji: "🌀" },
    kiwoom: { name: "키움 히어로즈", gradient: "from-purple-700 to-pink-500", emoji: "🦸" },
    ssg: { name: "SSG 랜더스", gradient: "from-red-500 to-yellow-400", emoji: "🚀" },
    lotte: { name: "롯데 자이언츠", gradient: "from-blue-600 to-red-500", emoji: "⚓" },
    samsung: { name: "삼성 라이온즈", gradient: "from-blue-400 to-cyan-400", emoji: "🦁" },
    nc: { name: "NC 다이노스", gradient: "from-teal-500 to-blue-700", emoji: "🦕" },
  };

  const LOGOS: Record<string, string> = {
    kia: "/assets/kia.png",
    hanwha: "/assets/hanwha.png",
    doosan: "/assets/doosan.png",
    lg: "/assets/lg.png",
    kt: "/assets/kt.png",
    kiwoom: "/assets/kiwoom.png",
    ssg: "/assets/ssg.png",
    lotte: "/assets/lotte.png",
    samsung: "/assets/samsung.png",
    nc: "/assets/nc.png",
  };

  // ✅ teamId 우선 → team.id → string 형태 자동 인식
  const id = team?.id || team?.teamId || team || teamId || "doosan";

  const data = TEAM_DATA[id] || TEAM_DATA["lg"];
  const logoImage = LOGOS[id];

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${data.gradient
        } flex items-center justify-center relative overflow-hidden shadow-lg`}
    >
      <div className="absolute inset-0 bg-white/10" />
      {logoImage ? (
        <img
          src={logoImage}
          alt={data.name}
          className="relative z-10 w-full h-full object-contain p-1.5"
        />
      ) : (
        <span className={`relative z-10 ${emojiSizes[size]}`}>{data.emoji}</span>
      )}
    </motion.div>
  );
}
