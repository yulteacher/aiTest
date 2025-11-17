// src/utils/initLocalData.ts
import { generateDummyData } from "./generateDummy";
import { KBO_TEAMS } from "./constants/teams";

export const initLocalData = () => {
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    let posts = JSON.parse(localStorage.getItem("posts") || "[]");
    let polls = JSON.parse(localStorage.getItem("polls") || "[]");

    console.log("🧭 initLocalData.ts 실행됨 (data 버전)");

    if (users.length === 0 || posts.length === 0 || polls.length === 0) {
        console.log("⚙️ 더미 데이터 새로 생성 중...");
        const dummy = generateDummyData();

        users = dummy.users;
        posts = dummy.posts;
        polls = dummy.polls;

        // =========================================================
        // 🧑‍💼 1) 관리자 계정 생성
        // =========================================================
        const adminTeam = KBO_TEAMS.find((t) => t.id === "doosan");
        const adminUser = {
            id: "u_doosan_admin",
            username: "admin",
            password: "123456",
            teamId: adminTeam?.id,
            team: adminTeam,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Admin`,
            xp: 3500,
            level: 5,
            badges: [],
            joinedAt: new Date().toISOString(),

            // ⭐ 새 추가된 활동 통계
            feedCount: 0,
            commentCount: 0,
            voteCount: 0,
            loginDays: 3,

            bio: "시스템 관리자 ⚾",
        };

        users.push(adminUser);

        // =========================================================
        // ⭐ 2) 관리자 활동 더미 만들기
        // =========================================================

        // 2-1) 피드 10개 작성
        for (let i = 0; i < 10; i++) {
            posts.push({
                id: `admin_post_${i}`,
                author: adminUser.username,
                authorId: adminUser.id,
                avatar: adminUser.avatar,
                content: `관리자 테스트 게시글 #${i + 1}`,
                image: "",
                likes: Math.floor(Math.random() * 20),
                commentsList: [],
                timestamp: new Date(Date.now() - i * 86400000).toISOString(),
                team: {
                    id: adminUser.teamId,
                    name: adminUser.team?.name,
                    color: adminUser.team?.primaryColor,
                },
                user: {
                    id: adminUser.id,
                    username: adminUser.username,
                    avatar: adminUser.avatar,
                    team: adminUser.team,
                },
                isMine: true,
            });
        }
        adminUser.feedCount = 10;

        // 2-2) 댓글 20개 작성
        for (let i = 0; i < 20; i++) {
            const postIndex = Math.floor(Math.random() * posts.length);
            const post = posts[postIndex];

            if (!post.commentsList) post.commentsList = [];

            post.commentsList.push({
                id: `admin_comment_${i}`,
                postId: post.id,
                authorId: adminUser.id,
                content: `관리자 댓글 ${i + 1}`,
                timestamp: new Date(Date.now() - i * 7200000).toISOString(),
                emotion: "공감",
            });
        }
        adminUser.commentCount = 20;

        // 2-3) 투표 8개 참여
        for (let i = 0; i < 8; i++) {
            const pollIndex = Math.floor(Math.random() * polls.length);
            const poll = polls[pollIndex];
            const option = poll.options[Math.floor(Math.random() * poll.options.length)];

            poll.userVotes[adminUser.id] = option.id;
            option.votes++;
            poll.totalVotes++;
        }
        adminUser.voteCount = 8;

        // ⭐ users 배열 업데이트
        users = users.map((u) => (u.id === adminUser.id ? adminUser : u));

        // 저장
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("posts", JSON.stringify(posts));
        localStorage.setItem("polls", JSON.stringify(polls));

        console.log("✨ 관리자 활동 포함 더미 데이터 생성 완료!");
    } else {
        console.log("✅ 기존 로컬스토리지 유지됨 (생성 생략)");
    }

    return { users, posts, polls };
};
