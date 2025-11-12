// src/components/yului/TeamAvatar.tsx
import React from "react";

interface TeamAvatarProps {
  team?: string; // ex) "lg", "doosan"
  src?: string; // 직접 지정된 이미지가 있을 경우
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

/**
 * 🎯 TeamAvatar 확장버전
 * - teamId 기반 자동 컬러 / 로고 / 이니셜 표시
 * - src 직접 전달 시 우선 표시
 * - 로고 이미지 자동 매칭 (ex. /logos/lg.png)
 */
export default function TeamAvatar({
  team,
  src,
  alt = "avatar",
  size = "md",
  className = "",
}: TeamAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
    xl: "w-32 h-32",
  };

  const teamColors: Record<string, { primary: string; secondary: string }> = {
    두산: { primary: "#131230", secondary: "#EA0029" },
    LG: { primary: "#C30452", secondary: "#000000" },
    KT: { primary: "#000000", secondary: "#E31937" },
    SSG: { primary: "#CE0E2D", secondary: "#F37321" },
    NC: { primary: "#1C4A9E", secondary: "#B0B0B0" },
    KIA: { primary: "#EA0029", secondary: "#000000" },
    롯데: { primary: "#041E42", secondary: "#D00F31" },
    삼성: { primary: "#074CA1", secondary: "#000000" },
    한화: { primary: "#FF6600", secondary: "#000000" },
    키움: { primary: "#570514", secondary: "#000000" },
  };

  const getTeamInitial = (teamName?: string) => {
    const initials: Record<string, string> = {
      두산: "두",
      LG: "LG",
      KT: "KT",
      SSG: "S",
      NC: "NC",
      KIA: "K",
      롯데: "롯",
      삼성: "삼",
      한화: "한",
      키움: "키",
    };
    return initials[teamName ?? ""] || teamName?.toUpperCase()?.[0] || "?";
  };

  // ✅ teamId → 정규화된 팀명으로 변환
  const normalizedTeam =
    team?.toUpperCase() === "LG"
      ? "LG"
      : team?.toUpperCase() === "DOOSAN"
        ? "두산"
        : team?.toUpperCase() === "KIA"
          ? "KIA"
          : team?.toUpperCase() === "LOTTE"
            ? "롯데"
            : team?.toUpperCase() === "HANWHA"
              ? "한화"
              : team?.toUpperCase() === "KIWOOM"
                ? "키움"
                : team?.toUpperCase() === "SSG"
                  ? "SSG"
                  : team?.toUpperCase() === "NC"
                    ? "NC"
                    : team?.toUpperCase() === "KT"
                      ? "KT"
                      : team?.toUpperCase() === "SAMSUNG"
                        ? "삼성"
                        : "기타";

  const colors =
    teamColors[normalizedTeam] || { primary: "#6B7280", secondary: "#9CA3AF" };

  // ✅ 로고 이미지 경로 자동 매핑 (public/logos 폴더 기준)
  const logoPaths: Record<string, string> = {
    두산: "/logos/doosan.png",
    LG: "/logos/lg.png",
    KT: "/logos/kt.png",
    SSG: "/logos/ssg.png",
    NC: "/logos/nc.png",
    KIA: "/logos/kia.png",
    롯데: "/logos/lotte.png",
    삼성: "/logos/samsung.png",
    한화: "/logos/hanwha.png",
    키움: "/logos/kiwoom.png",
  };

  const logoSrc = src || logoPaths[normalizedTeam];

  // ✅ 로고 파일이 존재하면 이미지 표시, 없으면 색상 이니셜로 대체
  return logoSrc ? (
    <img
      src={logoSrc}
      alt={alt}
      className={`${sizeClasses[size]} rounded-full object-cover border border-gray-300 dark:border-gray-700 ${className}`}
      onError={(e) => {
        // 로고가 없을 경우 fallback (회색 원 + 이니셜)
        const target = e.currentTarget as HTMLImageElement;
        target.style.display = "none";
      }}
    />
  ) : (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white ${className}`}
      style={{
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
      }}
    >
      <span
        className={
          size === "sm"
            ? "text-xs"
            : size === "md"
              ? "text-sm"
              : size === "lg"
                ? "text-xl"
                : "text-3xl"
        }
      >
        {getTeamInitial(normalizedTeam)}
      </span>
    </div>
  );
}
