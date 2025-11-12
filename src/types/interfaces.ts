// ===============================
// 🎯 KBO 팬덤 커뮤니티 인터페이스 통합 (MyPage 호환 완전 버전)
// ===============================

// ⚾ 1️⃣ 유저 정보 (회원가입 / 로그인 / 활동 기반)
export interface User {
  id: string;                // ex) "u_lg_5"
  username: string;          // 닉네임 (중복 불가)
  password: string;          // 로그인용 비밀번호 (local only)
  teamId: string;            // ex) "lg"
  avatar: string;            // ✅ 프로필 이미지
  xp: number;                // 경험치
  level: number;             // 레벨
  badges: string[];          // 배지 리스트
  joinedAt: string;          // 가입일

  // ✅ 추가 필드 (MyPage 등에서 사용)
  bio?: string;              // 자기소개 (선택)
  team?: Team;
}

// ⚾ 2️⃣ 팀 정보 (정적 데이터)
export interface Team {
  id: string;
  name: string;
  shortName: string;
  emoji: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  gradient: string;
  lightGradient: string;
}

// ⚾ 3️⃣ 게시글 (Feed)
export interface Post {
  id: string;
  author: string;
  authorId?: string;
  avatar?: string;
  content: string;
  image?: string;
  likes: number;
  liked?: boolean;
  commentsList?: any[];
  timestamp: string;
  team?: {
    id: string;
    name: string;
    color?: string;
  };
  // ✅ 추가: user 객체 (닉네임, 팀, 아바타 표시용)
  user?: {
    id: string;
    username: string;
    avatar?: string;
    team?: {
      id: string;
      name: string;
      color?: string;
    };
  };
  isMine?: boolean;
}



// ⚾ 4️⃣ 댓글 (게시글 하위)
export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  timestamp: string;
  emotion: '공감' | '드립' | '정보' | '비판';
}
/* export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  avatar?: string;
  content: string;
  timestamp: string;
} */
// ⚾ 5️⃣ 투표 (Poll)
export interface Poll {
  id: string;
  author: string;
  avatar?: string;
  teamId: string | 'all';
  category: '팀투표' | '리그이슈' | '이벤트';
  question: string;
  options: { id: string; text: string; votes: number }[];
  totalVotes: number;
  userVotes: Record<string, string>;
  createdBy: string;
  timestamp: string;
}

// ⚾ 6️⃣ 배지 (BadgeGrid.tsx, MyPage.tsx 연동)
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
}
