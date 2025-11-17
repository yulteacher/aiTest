// ==========================================
// 🎖 FANBASE — Badge Data (badges.ts)
// ==========================================

import { Badge, BadgeCategory, BadgeTier } from "../types/interfaces";

// -------------------------------------------
// 🏆 전체 뱃지 정의
// -------------------------------------------

export const BADGES: Badge[] = [
    // 🎉 가입 (1단계만)
    {
        id: "join_1",
        category: BadgeCategory.Join,
        tier: BadgeTier.Tier1,
        name: "첫 출발!",
        description: "회원가입 완료",
        icon: "/badges/join_1.svg",
    },

    // 🏅 레벨 (1~5)
    ...[1, 2, 3, 4, 5].map((n) => ({
        id: `level_${n}`,
        category: BadgeCategory.Level,
        tier: n as BadgeTier,
        name: `레벨 ${n}`,
        description: `레벨 ${n} 달성`,
        icon: `/badges/level_${n}.svg`,
    })),

    // 💬 댓글 뱃지 — 5, 10, 15, 20, 25개
    ...[1, 2, 3, 4, 5].map((n) => ({
        id: `comment_${n}`,
        category: BadgeCategory.Comment,
        tier: n as BadgeTier,
        name: `댓글왕 ${n}단계`,
        description: `댓글 ${n * 5}개 작성`,
        icon: `/badges/comment_${n}.svg`,
    })),

    // 📊 투표 뱃지 — 3, 6, 9, 12, 15회
    ...[1, 2, 3, 4, 5].map((n) => ({
        id: `vote_${n}`,
        category: BadgeCategory.Vote,
        tier: n as BadgeTier,
        name: `투표왕 ${n}단계`,
        description: `투표 ${n * 3}회 참여`,
        icon: `/badges/vote_${n}.svg`,
    })),

    // 📝 피드 뱃지 — 3, 6, 9, 12, 15개 (핑크 톤)
    ...[1, 2, 3, 4, 5].map((n) => ({
        id: `feed_${n}`,
        category: BadgeCategory.Feed,
        tier: n as BadgeTier,
        name: `피드챔프 ${n}단계`,
        description: `피드 ${n * 3}개 작성`,
        icon: `/badges/feed_${n}.svg`,
    })),

    // 🔐 로그인 뱃지 — 2, 4, 6, 8, 10일 (퍼플 톤)
    ...[1, 2, 3, 4, 5].map((n) => ({
        id: `login_${n}`,
        category: BadgeCategory.Login,
        tier: n as BadgeTier,
        name: `출석왕 ${n}단계`,
        description: `로그인 ${n * 2}일`,
        icon: `/badges/login_${n}.svg`,
    })),
];

// -------------------------------------------
// 🧩 카테고리별 그룹핑 (빠른 검색용)
// -------------------------------------------

export const BadgeMapByCategory: Record<BadgeCategory, Badge[]> = {
    [BadgeCategory.Join]: BADGES.filter((b) => b.category === BadgeCategory.Join),
    [BadgeCategory.Level]: BADGES.filter((b) => b.category === BadgeCategory.Level),
    [BadgeCategory.Comment]: BADGES.filter((b) => b.category === BadgeCategory.Comment),
    [BadgeCategory.Vote]: BADGES.filter((b) => b.category === BadgeCategory.Vote),
    [BadgeCategory.Feed]: BADGES.filter((b) => b.category === BadgeCategory.Feed),
    [BadgeCategory.Login]: BADGES.filter((b) => b.category === BadgeCategory.Login),
};
