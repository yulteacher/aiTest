import { motion } from "framer-motion";
import kiaLogo from "../assets/kia.png";
import hanwhaLogo from "../assets/hanwha.png";
import doosanLogo from "../assets/doosan.png";
import lgLogo from "../assets/lg.png";
import ktLogo from "../assets/kt.png";
import kiwoomLogo from "../assets/kiwoom.png";
import ssgLogo from "../assets/ssg.png";
import lotteLogo from "../assets/lotte.png";
import samsungLogo from "../assets/samsung.png";
import ncLogo from "../assets/nc.png";

interface Team {
  id: string;
  name: string;
  gradient?: string;
  emoji?: string;
}

interface TeamLogoProps {
  team: Team;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export default function TeamLogo({ team, size = "md" }: TeamLogoProps) {
  const sizeClasses = {
    xs: "w-4 h-4", // 👈 이 줄 추가
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

  // ✅ 로고 이미지 매핑
  const logoImages: Record<string, string> = {
    kia: kiaLogo,
    hanwha: hanwhaLogo,
    doosan: doosanLogo,
    lg: lgLogo,
    kt: ktLogo,
    kiwoom: kiwoomLogo,
    ssg: ssgLogo,
    lotte: lotteLogo,
    samsung: samsungLogo,
    nc: ncLogo,
  };

  const logoImage = team?.id ? logoImages[team.id] : null;

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${team.gradient || "from-gray-100 to-gray-300"
        } flex items-center justify-center relative overflow-hidden shadow-lg`}
    >
      <div className="absolute inset-0 bg-white/10" />
      {logoImage ? (
        <img
          src={logoImage}
          alt={team.name}
          className="relative z-10 w-full h-full object-contain p-1.5"
        />
      ) : (
        <span className={`relative z-10 ${emojiSizes[size]}`}>
          {team.emoji}
        </span>
      )}
    </motion.div>
  );
}
