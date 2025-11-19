// AppDataContext.tsx — FINAL PATCH
import { createContext, useContext, ReactNode } from "react";
import { useLocalDataEngine } from "../hooks/useLocalDataEngine";
import { KBO_TEAMS } from "../data/constants/teams";
import { BADGES } from "../data/badges";

const AppDataContext = createContext<ReturnType<typeof useLocalDataEngine> | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
    const data = useLocalDataEngine();
    return (
        <AppDataContext.Provider value={data}>
            {children}
        </AppDataContext.Provider>
    );
}

export const useAppDataContext = () => {
    const context = useContext(AppDataContext);
    if (!context) throw new Error("useAppDataContext must be used inside provider");
    return context;
};

import { User } from "../types/interfaces";
import { getTop5Badges } from "../utils/badgeUtils";

/* ---------------------------------------------
 🧩 핵심! 전체 유저 데이터 구조 통일
----------------------------------------------*/
export function loadUser(u: any): User {
    let fixedBadges = u.badges ?? [];

    // 문자열/이중배열 → flatten
    if (fixedBadges.length === 1 && typeof fixedBadges[0] === "string") {
        try {
            const parsed = JSON.parse(fixedBadges[0]);
            if (Array.isArray(parsed)) fixedBadges = parsed;
        } catch (e) { }
    }
    if (Array.isArray(fixedBadges[0])) {
        fixedBadges = fixedBadges.flat();
    }

    // 2) Set으로 중복 제거
    fixedBadges = [...new Set(fixedBadges)];

    // 3) 유효하지 않은 ID 제거
    fixedBadges = fixedBadges.filter((id: string) =>
        BADGES.some(b => b.id === id)
    );

    // 🔥 top5 계산 (New Logic)
    const top5 = getTop5Badges(fixedBadges);

    let equipped = u.equippedBadges;

    // 만약 equippedBadges가 있지만 비어있다면(모두 null), 그리고 뱃지가 있다면 -> 자동 채우기
    const isEmptyEquipped = equipped && !equipped.main && equipped.slots.every((s: any) => !s);

    if (!equipped || (isEmptyEquipped && fixedBadges.length > 0)) {
        equipped = {
            main: top5[0],
            slots: [
                top5[1],
                top5[2],
                top5[3],
                top5[4],
            ],
        };
    }

    return {
        ...u,
        badges: fixedBadges,

        // 🔥 top5가 있다면 장착 상태도 top5 기준으로 생성
        equippedBadges: equipped,

        xp: u.xp ?? 0,
        level: u.level ?? 1,

        // 필수 필드 기본값 보장
        feedCount: u.feedCount ?? 0,
        commentCount: u.commentCount ?? 0,
        voteCount: u.voteCount ?? 0,
        loginCount: u.loginCount ?? 0,
        loginDays: u.loginDays ?? 0,
        joinedAt: u.joinedAt ?? new Date().toISOString(),
        teamId: u.teamId ?? "",
        avatar: u.avatar ?? "",
        username: u.username ?? "Unknown",
        password: u.password ?? "",
    };
}



