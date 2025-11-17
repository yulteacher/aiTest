// ===============================
// 🎖 FANBASE — useBadgeSystem.ts
// ===============================

import { useAppDataContext } from "../context/AppDataContext";
import { BADGES, BadgeMapByCategory } from "../data/badges";
import { Badge, BadgeCategory } from "../types/interfaces";

export const useBadgeSystem = () => {
    const { currentUser, setCurrentUser } = useAppDataContext();

    if (!currentUser) {
        return {
            userBadges: [],
            checkAllBadges: () => { },
        };
    }

    // ----------------------------------------
    // 👍 현재 유저의 배지 목록
    // ----------------------------------------
    const userBadges: string[] = currentUser.badges || [];

    // ----------------------------------------
    // 🧩 "특정 뱃지 보유 여부"
    // ----------------------------------------
    const hasBadge = (badgeId: string) => userBadges.includes(badgeId);

    // ----------------------------------------
    // 🏅 뱃지 추가 함수
    // ----------------------------------------
    const awardBadge = (badge: Badge) => {
        if (hasBadge(badge.id)) return; // 중복 방지

        const updated = {
            ...currentUser,
            badges: [...userBadges, badge.id],
        };

        setCurrentUser(updated);
        localStorage.setItem("currentUser", JSON.stringify(updated));

        // 전체 users 동기화
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const updatedUsers = users.map((u: any) =>
            u.id === updated.id ? updated : u
        );
        localStorage.setItem("users", JSON.stringify(updatedUsers));

        console.log("🎉 배지 획득:", badge.id);
    };

    // -----------------------------------------------------
    // 🎯 조건 검사 유틸 — tier 단계별 매칭
    // -----------------------------------------------------
    const getBadgeByTier = (category: BadgeCategory, tier: number) => {
        return BadgeMapByCategory[category].find((b) => b.tier === tier);
    };

    // ----------------------------------------------------
    // 📌 1) JOIN 배지 (무조건 1회)
    // ----------------------------------------------------
    const checkJoinBadge = () => {
        const badge = getBadgeByTier(BadgeCategory.Join, 1);
        if (badge) awardBadge(badge);
    };

    // ----------------------------------------------------
    // 📌 2) LEVEL 배지
    // 레벨 1~5 → 각각 level_1 ~ level_5
    // ----------------------------------------------------
    const checkLevelBadges = () => {
        const level = Math.min(currentUser.level, 5); // 5단계까지만
        for (let t = 1; t <= level; t++) {
            const badge = getBadgeByTier(BadgeCategory.Level, t);
            if (badge) awardBadge(badge);
        }
    };

    // ----------------------------------------------------
    // 📌 3) COMMENT 배지
    // 5, 10, 15, 20, 25개 기준
    // ----------------------------------------------------
    const checkCommentBadges = () => {
        const count = currentUser.commentCount || 0;
        const tier = Math.min(Math.floor(count / 5), 5);

        for (let t = 1; t <= tier; t++) {
            const badge = getBadgeByTier(BadgeCategory.Comment, t);
            if (badge) awardBadge(badge);
        }
    };

    // ----------------------------------------------------
    // 📌 4) VOTE 배지
    // 3, 6, 9, 12, 15회
    // ----------------------------------------------------
    const checkVoteBadges = () => {
        const count = currentUser.voteCount || 0;
        const tier = Math.min(Math.floor(count / 3), 5);

        for (let t = 1; t <= tier; t++) {
            const badge = getBadgeByTier(BadgeCategory.Vote, t);
            if (badge) awardBadge(badge);
        }
    };

    // ----------------------------------------------------
    // 📌 5) FEED (피드 작성수) — 아직 안만듦
    // → feedCount 기반으로 만들 준비 완료
    // ----------------------------------------------------
    const checkFeedBadges = () => {
        const count = currentUser.feedCount || 0;
        const tier = Math.min(Math.floor(count / 3), 5);

        for (let t = 1; t <= tier; t++) {
            const badge = getBadgeByTier(BadgeCategory.Feed, t);
            if (badge) awardBadge(badge);
        }
    };

    const checkLoginBadges = () => {
        const days = currentUser.loginDays || 0;
        const tier = Math.min(Math.floor(days / 2), 5);

        for (let t = 1; t <= tier; t++) {
            const badge = getBadgeByTier(BadgeCategory.Login, t);
            if (badge) awardBadge(badge);
        }
    };


    // ----------------------------------------------------
    // 🎯 전체 검사 — MyPage 입장 시 / 액션 후 호출
    // ----------------------------------------------------
    const checkAllBadges = () => {
        checkJoinBadge();
        checkLevelBadges();
        checkCommentBadges();
        checkVoteBadges();
        checkFeedBadges();
        checkLoginBadges();
    };

    return {
        userBadges,
        hasBadge,
        checkAllBadges,
    };
};
