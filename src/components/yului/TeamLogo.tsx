import { motion } from "framer-motion";
import { KBO_TEAMS } from "../../data/constants/teams";

interface TeamLogoProps {
  team?: any; // 객체 또는 문자열 모두 가능
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export default function TeamLogo({ team, size = "md" }: TeamLogoProps) {
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

  // ✅ team이 객체일 수도 있고 문자열일 수도 있으므로 안전하게 처리
  const id =
    typeof team === "string"
      ? team
      : team?.id || "doosan";

  const data = TEAM_DATA[id] || TEAM_DATA["doosan"];
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
