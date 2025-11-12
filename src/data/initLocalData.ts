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

        // ✅ 기본 admin 계정 추가
        const adminTeam = KBO_TEAMS.find((t) => t.id === "doosan");
        const adminUser = {
            id: "u_doosan_admin",
            username: "admin",
            password: "123456",
            teamId: adminTeam?.id,
            team: adminTeam,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Admin`,
            xp: 9999,
            level: 10,
            badges: ["관리자", "개발자"],
            joinedAt: new Date().toISOString(),
            bio: "시스템 관리자 ⚾",
        };

        users.push(adminUser);

        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("posts", JSON.stringify(posts));
        localStorage.setItem("polls", JSON.stringify(polls));
        console.log("✅ 더미 데이터 생성 완료!");
    } else {
        console.log("✅ 기존 로컬스토리지 유지됨 (생성 생략)");
    }

    return { users, posts, polls };
};
