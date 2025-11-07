// src/utils/initLocalData.ts
export const initLocalData = () => {
    if (localStorage.getItem("users")) return; // 이미 초기화되어 있으면 스킵

    const admin = {
        id: "admin",
        username: "admin",
        password: "0000",
        team: "두산",
        role: "admin",
        xp: 250,
        level: 3,
        badges: ["🔥", "🎤", "👑"],
        posts: [1, 2, 3],
        polls: [1, 2, 3],
        votedPolls: [4, 5, 6, 7, 8, 9, 10],
    };

    const dummyUsers = [
        { id: "user1", username: "롯데팬", team: "롯데", xp: 50, level: 1, badges: [] },
        { id: "user2", username: "기아사랑", team: "기아", xp: 20, level: 1, badges: [] },
        { id: "user3", username: "한화혼", team: "한화", xp: 10, level: 1, badges: [] },
    ];

    const dummyPosts = [
        { id: 1, author: "admin", title: "두산 2025 시즌 예상", content: "투수진이 기대됩니다!", likes: 25 },
        { id: 2, author: "admin", title: "팬들과 함께한 인터뷰", content: "감사합니다!", likes: 12 },
        { id: 3, author: "admin", title: "새 유니폼 공개 후기", content: "멋지네요!", likes: 18 },
    ];

    const dummyPolls = [
        {
            id: 1, author: "admin", question: "올해 MVP는?", totalVotes: 50, options: [
                { id: 1, text: "양의지", votes: 20 },
                { id: 2, text: "정철원", votes: 15 },
                { id: 3, text: "김재환", votes: 15 },
            ]
        },
        {
            id: 2, author: "admin", question: "가장 기대되는 신인은?", totalVotes: 30, options: [
                { id: 1, text: "박준영", votes: 10 },
                { id: 2, text: "이승엽", votes: 20 },
            ]
        },
    ];

    localStorage.setItem("users", JSON.stringify([admin, ...dummyUsers]));
    localStorage.setItem("posts", JSON.stringify(dummyPosts));
    localStorage.setItem("polls", JSON.stringify(dummyPolls));
    localStorage.setItem("currentUser", JSON.stringify(null));
};
