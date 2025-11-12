// ✅ src/data/generateDummy.ts (안정화 버전)
import { KBO_TEAMS } from "../data/constants/teams";
import type { User, Post, Poll } from "../types/interfaces";

export function generateDummyData() {
    console.log("🎯 generateDummyData 실행됨, KBO_TEAMS 길이:", KBO_TEAMS.length);
    console.log("KBO_TEAMS 내용:", KBO_TEAMS);

    const users: User[] = [];
    const posts: Post[] = [];
    const polls: Poll[] = [];

    // ✅ 아바타와 닉네임 샘플
    const avatars = [
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    ];

    const nicknames: Record<string, string[]> = {
        doosan: ["곰돌이매직", "베어스혼", "잠실곰", "두산직관러", "곰들의행진"],
        lg: ["트윈스레전드", "엘린이", "잠실직관러", "홍창기사랑", "유광점퍼요정"],
        samsung: ["블루킹", "대구사자", "사자군단", "푸른열정", "삼성직관러"],
        kia: ["기아불펜요정", "광주직관러", "호랑이군단", "타이거즈하트", "승리호랑"],
        kt: ["수원마법사", "위즈매직", "KT에이스", "마법구단", "위즈소울"],
        ssg: ["인천랜더스", "쓱타임", "랜더스영웅", "쓱몰팬", "쓱드립러"],
        lotte: ["롯데영원하이", "부산직관러", "자이언트하트", "자갈치불펜", "롯데직관러"],
        hanwha: ["한화근성", "이글스불사조", "한화희망", "한화불사", "버티는한화"],
        nc: ["다이노킹", "창원직관러", "공룡군단", "NC레전드", "창원다이노"],
        kiwoom: ["키움영웅", "고척직관러", "히어로러버", "키움매직", "히어로즈하트"],
    };

    const postTemplates = [
        "오늘 경기 진짜 명승부였다 ⚾ 9회말 역전승!!",
        "우리 팀 에이스 투수 완봉승 👏",
        "첫 직관 다녀왔어요! 야구장 분위기 최고 🏟️",
        "오늘 홈런 3개!! 타선 폭발 💪",
        "신인 선수 데뷔전 축하합니다 🎉",
    ];

    // ✅ 관리자 계정 (두산)
    const adminTeam = KBO_TEAMS.find(t => t.id === "doosan");
    const admin: User = {
        id: "u_admin",
        username: "admin",
        password: "1234",
        teamId: adminTeam?.id || "doosan",
        team: adminTeam,
        avatar: avatars[0],
        xp: 1000,
        level: 10,
        badges: ["관리자", "초창기 멤버"],
        joinedAt: new Date().toISOString(),
        bio: "KBO 팬덤 커뮤니티 관리자 ⚾",
    };
    users.push(admin);

    // ✅ 팀별 데이터 생성
    KBO_TEAMS.forEach((team, idx) => {
        if (!team || !team.id) {
            console.warn(`⚠️ team이 undefined거나 id가 없음 (index: ${idx})`, team);
            return;
        }

        const teamNicknames = nicknames[team.id];
        if (!teamNicknames) {
            console.warn(`⚠️ 닉네임 누락된 팀: ${team.id}`);
            return;
        }

        // 🧍 유저 생성
        teamNicknames.forEach((name, i) => {
            const user: User = {
                id: `u_${team.id}_${i + 1}`,
                username: name,
                password: "1234",
                teamId: team.id,
                team,
                avatar: avatars[i % avatars.length],
                xp: Math.floor(Math.random() * 800),
                level: Math.floor(Math.random() * 8) + 1,
                badges: [],
                joinedAt: new Date(Date.now() - Math.random() * 1e10).toISOString(),
                bio: `${team.name} 팬이에요! 오늘도 응원합니다 💪`,
            };
            users.push(user);
        });


        // 📝 포스트 생성
        for (let i = 0; i < 8; i++) {
            const teamUsers = users.filter(u => u.teamId === team.id);
            const author = teamUsers[Math.floor(Math.random() * teamUsers.length)];
            if (!author) continue;

            const localImages = [
                `/images/feed_${team.id}1.png`,
                `/images/feed_${team.id}2.png`,
            ];

            const post: Post = {
                id: `p_${team.id}_${i + 1}`,
                author: author.username,
                authorId: author.id,
                avatar: author.avatar,
                content: postTemplates[Math.floor(Math.random() * postTemplates.length)],
                image:
                    Math.random() > 0.5
                        ? localImages[Math.floor(Math.random() * localImages.length)]
                        : "",
                likes: Math.floor(Math.random() * 200), // ✅ 숫자로 변경
                liked: false,
                commentsList: [],
                timestamp: `${Math.floor(Math.random() * 12) + 1}시간 전`,
                team: { id: team.id, name: team.name },
                user: {
                    id: author.id,
                    username: author.username,
                    avatar: author.avatar,
                    team: { id: team.id, name: team.name },
                },
            };
            posts.push(post);
        }


        // 📊 투표 생성
        for (let i = 0; i < 2; i++) {
            const author = users.find(u => u.teamId === team.id);
            if (!author) continue;

            polls.push({
                id: `poll_${team.id}_${i}`,
                author: author.username,
                avatar: author.avatar,
                teamId: team.id,
                category: "팀투표",
                question: i === 0
                    ? `${team.name} 이번 주 MVP는 누구?`
                    : `올해 ${team.name} 우승 확률은 몇 %?`,
                options: [
                    { id: "opt1", text: "선수 A", votes: Math.floor(Math.random() * 100) },
                    { id: "opt2", text: "선수 B", votes: Math.floor(Math.random() * 100) },
                    { id: "opt3", text: "선수 C", votes: Math.floor(Math.random() * 100) },
                ],
                totalVotes: Math.floor(Math.random() * 300),
                userVotes: {},
                createdBy: author.id,
                timestamp: `${Math.floor(Math.random() * 6) + 1}시간 전`,
            });
        }
    });

    console.log("✅ 더미 데이터 생성 완료!");
    return { users, posts, polls };
}
