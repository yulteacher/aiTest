// ===========================================
// ⚾ generateDummy.ts
// 10개 구단 × 팬 10명씩 → 유저/포스트 자동 생성기
// ===========================================
import { KBO_TEAMS } from "./constants/teams";
import type { User, Post, Poll } from "../types/interfaces";

const avatars = [
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
];

const nicknames = {
    lg: ["트윈스레전드", "엘린이", "잠실직관러", "홍창기사랑", "LG불펜장인", "유광점퍼요정", "엘갤드립러", "엘레전드", "엘클라쓰", "트윈스영웅"],
    doosan: ["두산영혼", "곰돌이매직", "베어스혼", "잠실곰", "곰수니짱", "곰돌이감독", "DOO파워", "두산직관러", "베어스킹", "곰들의행진"],
    samsung: ["블루킹", "대구사자", "삼성프라이드", "강민호사랑", "사자군단", "라이온즈드림", "사자팬", "푸른열정", "삼성직관러", "블루스타"],
    kia: ["기아불펜요정", "광주직관러", "타이거즈혼", "호랑이눈빛", "기아레전드", "광주사자아님", "호랑이군단", "기아에이스", "타이거즈하트", "승리호랑"],
    kt: ["수원마법사", "KT러버", "위즈매직", "수원직관러", "KT에이스", "위즈하트", "마법구단", "블랙레드", "위즈드림", "위즈소울"],
    ssg: ["인천랜더스", "정용진빠", "쓱타임", "인천직관러", "랜더스영웅", "쓱몰팬", "인천레전드", "쓱고래", "쓱드립러", "랜더스하트"],
    lotte: ["롯데영원하이", "자이언츠짱", "부산직관러", "자이언트하트", "롯데드립러", "자갈치불펜", "롯데는사랑", "부산사나이", "자이언트에이스", "롯데직관러"],
    hanwha: ["한화근성", "이글스불사조", "대전직관러", "한화희망", "독수리혼", "한화버텨", "대전하늘", "한화불사", "버티는한화", "이글스하트"],
    nc: ["다이노킹", "창원직관러", "나성범교주", "공룡군단", "NC레전드", "창원소울", "다이노드립러", "공룡불펜", "NC열정", "창원다이노"],
    kiwoom: ["키움영웅", "히어로즈드림", "고척직관러", "히어로러버", "키움매직", "영웅소녀", "키움에이스", "고척드립러", "히어로즈킹", "영웅하트"],
};

const postTemplates = [
    "오늘 경기 진짜 명승부였다 ⚾ 9회말 역전승!! 소름돋았어요",
    "우리 팀 에이스 투수 7이닝 무실점! 👏 시즌 최고의 피칭이었어요",
    "첫 직관 다녀왔어요! 야구장 분위기 너무 좋다 🏟️",
    "오늘 홈런 3개 나왔다!! 타선 폭발 💪",
    "신인 선수 데뷔전 축하합니다 🎉 앞으로가 더 기대되네요!",
    "오늘 불펜 운영 완벽 👏 감독님 센스 굿!",
    "타선이 살아나고 있다 🔥 포스트시즌 가자!",
    "비록 졌지만 우리팀 파이팅! 끝까지 간다 💯",
    "직관 인증샷 올립니다 📸 야구는 현장이지!",
    "이번 시즌 진짜 기대된다 🙌",
];

export function generateDummyData() {
    const users: User[] = [];
    const posts: Post[] = [];
    const polls: Poll[] = [];
    // ✅ admin 계정 추가
    const admin = {
        id: "u_admin",
        username: "admin",
        password: "123456",
        teamId: nicknames[1],
        avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
        xp: 1000,
        level: 10,
        badges: ["관리자", "초창기 멤버"],
        joinedAt: new Date().toISOString(),
    };
    users.push(admin);

    KBO_TEAMS.forEach((team) => {
        const teamNicknames = nicknames[team.id as keyof typeof nicknames];
        if (!teamNicknames) return;

        // 🧍 유저 생성
        teamNicknames.forEach((name, index) => {
            const user: User = {
                id: `u_${team.id}_${index + 1}`,
                username: name,
                password: "1234",
                teamId: team.id,
                avatar: avatars[index % avatars.length],
                xp: Math.floor(Math.random() * 800),
                level: Math.floor(Math.random() * 8) + 1,
                badges: [],
                joinedAt: new Date(Date.now() - Math.random() * 1e10).toISOString(),
            };
            users.push(user);
        });

        // 📝 게시글 생성 (각 팀 10개)
        for (let i = 0; i < 10; i++) {
            const author = users.filter((u) => u.teamId === team.id)[
                Math.floor(Math.random() * 10)
            ];
            const post: Post = {
                id: `p_${team.id}_${i + 1}`,
                authorId: author.id,
                teamId: team.id,
                content: postTemplates[Math.floor(Math.random() * postTemplates.length)],
                image:
                    Math.random() > 0.5
                        ? `https://source.unsplash.com/featured/800x400/?baseball,${team.name}`
                        : "",
                likes: [],
                comments: [],
                timestamp: `${Math.floor(Math.random() * 12) + 1}시간 전`,
                category: ["응원", "불만", "감상", "사진", "밈"][Math.floor(Math.random() * 5)] as any,
            };
            posts.push(post);
        }

        // 📊 투표 생성 (각 팀 2개)
        for (let i = 0; i < 2; i++) {
            const author = users.filter((u) => u.teamId === team.id)[
                Math.floor(Math.random() * 10)
            ];
            const poll: Poll = {
                id: `poll_${team.id}_${i + 1}`,
                author: author.username,
                avatar: author.avatar,
                teamId: team.id,
                category: ["응원", "불만", "감상", "사진", "밈"][Math.floor(Math.random() * 5)] as any,
                question:
                    i === 0
                        ? `${team.name} 이번 주 MVP는 누구?`
                        : `올해 ${team.name} 우승 확률은 몇 %?`,
                options: [
                    { id: "opt1", text: "선수 A", votes: Math.floor(Math.random() * 100) },
                    { id: "opt2", text: "선수 B", votes: Math.floor(Math.random() * 100) },
                    { id: "opt3", text: "선수 C", votes: Math.floor(Math.random() * 100) },
                ],
                totalVotes: Math.floor(Math.random() * 200),
                userVotes: {},
                createdBy: author.id,
                timestamp: `${Math.floor(Math.random() * 5) + 1}시간 전`,
            };
            polls.push(poll);
        }
    });

    // ✅ 저장
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("posts", JSON.stringify(posts));
    localStorage.setItem("polls", JSON.stringify(polls));

    console.log("✅ 더미 데이터 생성 완료!");
    return { users, posts, polls };
}
