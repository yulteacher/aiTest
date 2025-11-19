// ==========================================
// ⚾ FANBASE — generateDummyData.ts (최종 안정화)
// ==========================================
import { KBO_TEAMS } from "../data/constants/teams";
import type { User, Post, Poll, Comment } from "../types/interfaces";
import { BADGES } from "./badges";
export function generateDummyData() {
    console.log("🎯 generateDummyData 실행됨");

    const users: User[] = [];
    const posts: Post[] = [];
    const polls: Poll[] = [];

    // -----------------------------
    // 샘플 데이터
    // -----------------------------
    const avatars = [
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop",
    ];

    const nicknames: Record<string, string[]> = {
        doosan: ["두산직관러", "곰매직", "두산베어", "잠실곰"],
        lg: ["엘린이", "트윈스매직", "유광점퍼"],
        samsung: ["라이온즈직관", "대구사자", "삼성블루"],
        kia: ["타이거즈혼", "광주직관러", "호랑이불펜"],
        kt: ["위즈매직", "수원직관러", "KT마법사"],
        ssg: ["쓱타임", "랜더스영웅", "인천직관"],
        lotte: ["롯데직관", "부산가을야구", "자이언트영혼"],
        hanwha: ["한화근성", "이글스불사", "한화직관"],
        nc: ["다이노포스", "NC직관", "창원공룡"],
        kiwoom: ["고척영웅", "히어로즈러버", "키움매직"],
    };

    const commentSamples = ["개추", "레전드", "정보감사", "드립 인정", "공감합니다"];
    const postTemplates = [
        "오늘 경기 미쳤다 🔥",
        "직관 다녀왔어요!",
        "우리 팀 화이팅!",
        "신인 선수 활약 대박",
        "심판 판정 뭐냐 진짜…",
    ];

    // -----------------------------
    // ⭐ ADMIN 계정 (비밀번호 123456)
    // -----------------------------
    const adminTeam = KBO_TEAMS.find(t => t.id === "doosan")!;

    const admin: User = {
        id: "u_admin",
        username: "admin",
        password: "123456",   // ⭐ 여기!!
        teamId: adminTeam.id,
        team: adminTeam,
        avatar: avatars[0],

        xp: 5000,
        level: 10,

        feedCount: 10,
        commentCount: 20,
        voteCount: 15,
        loginCount: 40,
        loginDays: 30,

        joinedAt: new Date().toISOString(),
        badges: [],
        bio: "FANBASE 시스템 관리자 ⚾",
        equippedBadges: {
            main: null,
            slots: [null, null, null, null]
        }
    };

    users.push(admin);

    // -----------------------------
    // ⭐ 팀별 일반 유저 (비밀번호 전부 1234)
    // -----------------------------
    KBO_TEAMS.forEach(team => {
        const list = nicknames[team.id] ?? [];

        list.forEach((name, i) => {
            const u: User = {
                id: `u_${team.id}_${i + 1}`,
                username: name,
                password: "1234",

                teamId: team.id,
                team,

                avatar: avatars[i % avatars.length],

                xp: Math.floor(Math.random() * 700),
                level: Math.floor(Math.random() * 8) + 1,

                feedCount: Math.floor(Math.random() * 8),
                commentCount: Math.floor(Math.random() * 25),
                voteCount: Math.floor(Math.random() * 18),
                loginCount: Math.floor(Math.random() * 30),
                loginDays: Math.floor(Math.random() * 25),

                joinedAt: new Date(Date.now() - Math.random() * 1e10).toISOString(),

                badges: [],
                bio: `${team.name} 팬입니다!`,
            };
            users.push(u);
        });
    });

    // -----------------------------
    // ⭐ POSTS 생성
    // -----------------------------
    KBO_TEAMS.forEach(team => {
        const teamUsers = users.filter(u => u.teamId === team.id);

        for (let i = 0; i < 8; i++) {
            const author = teamUsers[Math.floor(Math.random() * teamUsers.length)];

            const postId = `p_${team.id}_${i + 1}`;

            const comments: Comment[] = [];
            for (let c = 0; c < 3; c++) {
                const commenter = teamUsers[Math.floor(Math.random() * teamUsers.length)];

                comments.push({
                    id: `c_${postId}_${c}`,
                    authorId: commenter.id,
                    author: commenter.username,
                    avatar: commenter.avatar,  // ⭐ 댓글 avatar 완전 적용
                    content: commentSamples[Math.floor(Math.random() * commentSamples.length)],
                    timestamp: `${Math.floor(Math.random() * 10) + 1}분 전`,
                    emotion: "공감",
                });
            }

            const post: Post = {
                id: postId,
                author: author.username,
                authorId: author.id,
                authorName: author.username,
                avatar: author.avatar,

                content: postTemplates[Math.floor(Math.random() * postTemplates.length)],
                image: Math.random() > 0.5
                    ? `/images/feed_${team.id}1.png`
                    : `/images/feed_${team.id}2.png`,

                likes: Math.floor(Math.random() * 200),
                liked: false,

                comments: comments.length,
                commentsList: comments,

                timestamp: `${Math.floor(Math.random() * 12) + 1}시간 전`,

                team: { id: team.id, name: team.name },

                user: {
                    id: author.id,
                    username: author.username,
                    avatar: author.avatar,
                    team: { id: team.id, name: team.name },
                },

                isMine: false,
            };

            posts.push(post);
        }
    });

    // -----------------------------
    // ⭐ POLLS 생성
    // -----------------------------
    KBO_TEAMS.forEach(team => {
        const teamUsers = users.filter(u => u.teamId === team.id);
        const author = teamUsers[0]; // 각 팀 대표 유저

        for (let i = 0; i < 2; i++) {
            const poll: Poll = {
                id: `poll_${team.id}_${i}`,
                author: author.username,
                avatar: author.avatar,

                team,

                question:
                    i === 0
                        ? `${team.name} 이번 주 MVP는 누구?`
                        : `${team.name} 올 시즌 우승 확률은?`,

                options: [
                    { id: "opt1", text: "선수 A", votes: Math.floor(Math.random() * 30) },
                    { id: "opt2", text: "선수 B", votes: Math.floor(Math.random() * 30) },
                    { id: "opt3", text: "선수 C", votes: Math.floor(Math.random() * 30) },
                ],

                totalVotes: Math.floor(Math.random() * 80) + 20,
                userVotes: {},

                timestamp: `${Math.floor(Math.random() * 6) + 1}시간 전`,
                category: "팀투표",
                createdBy: author.id,
            };

            polls.push(poll);
        }
    });

    console.log("✅ generateDummyData 최종 생성 완료!");
    return { users, posts, polls };
}
