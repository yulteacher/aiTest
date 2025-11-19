// ===============================
// 🎖 FANBASE — useBadgeSystem.ts (FINAL)
// ===============================

import { useAppDataContext } from "../context/AppDataContext";
import { BADGES, BadgeMapByCategory } from "../data/badges";
import { Badge, BadgeCategory } from "../types/interfaces";

export const useBadgeSystem = () => {
    const { currentUser, setCurrentUser } = useAppDataContext();

    if (!currentUser) {
        return {
            userBadges: [],
            hasBadge: () => false,
            checkAllBadges: () => { },
            checkInitialBadges: () => { },
        };
    }

    // ----------------------------------------
    // 🧩 현재 유저의 배지 목록
    // ----------------------------------------
    const userBadges: string[] = currentUser.badges ?? [];

    const hasBadge = (id: string) => userBadges.includes(id);

    // ----------------------------------------
    // 🧩 카테고리·티어 뱃지 찾기
    // ----------------------------------------

    const getBadgeByTier = (category: BadgeCategory, tier: number) => {
        const list = BadgeMapByCategory[category];
        return list?.find((b) => b.tier === tier);
    };

    // ----------------------------------------
    // 🎯 전체 검사 — MyPage 들어갈 때마다 호출
    // ----------------------------------------
    const checkAllBadges = () => {
        const newBadges = new Set<string>(userBadges);
        let changed = false;

        const add = (b?: Badge) => {
            if (b && !newBadges.has(b.id)) {
                newBadges.add(b.id);
                changed = true;
            }
        };

        // 1. Join (ONLY if already owned, or handled by checkInitialBadges)
        // checkAllBadges should NOT force join_1 on existing users who don't have it.
        if (userBadges.includes("join_1")) {
            add(getBadgeByTier(BadgeCategory.Join, 1));
        }

        // 2. Level
        const level = Math.min(currentUser.level ?? 1, 5);
        for (let t = 1; t <= level; t++) {
            add(getBadgeByTier(BadgeCategory.Level, t));
        }

        // 3. Comment
        const commentCount = currentUser.commentCount ?? 0;
        const commentTier = Math.min(Math.floor(commentCount / 5), 5);
        for (let t = 1; t <= commentTier; t++) {
            add(getBadgeByTier(BadgeCategory.Comment, t));
        }

        // 4. Vote
        const voteCount = currentUser.voteCount ?? 0;
        const voteTier = Math.min(Math.floor(voteCount / 3), 5);
        for (let t = 1; t <= voteTier; t++) {
            add(getBadgeByTier(BadgeCategory.Vote, t));
        }

        // 5. Feed
        const feedCount = currentUser.feedCount ?? 0;
        const feedTier = Math.min(Math.floor(feedCount / 3), 5);
        for (let t = 1; t <= feedTier; t++) {
            add(getBadgeByTier(BadgeCategory.Feed, t));
        }

        // 6. Login
        const loginDays = currentUser.loginDays ?? 0;
        const loginTier = Math.min(Math.floor(loginDays / 2), 5);
        for (let t = 1; t <= loginTier; t++) {
            add(getBadgeByTier(BadgeCategory.Login, t));
        }

        if (changed) {
            const updated = {
                ...currentUser,
                badges: Array.from(newBadges),
            };
            setCurrentUser(updated);
        }
    };

    const checkInitialBadges = () => {
        const joinBadge = getBadgeByTier(BadgeCategory.Join, 1);
        if (joinBadge && !userBadges.includes(joinBadge.id)) {
            const updated = {
                ...currentUser,
                badges: [...userBadges, joinBadge.id],
            };
            setCurrentUser(updated);
        }
    };

    return {
        userBadges,
        hasBadge,
        checkAllBadges,
        checkInitialBadges,
    };
};
