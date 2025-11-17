// ===============================
// ⚾ FANBASE — 인터페이스 통합 구조 (확정본)
// ===============================

// -----------------------------------------------------
// 1) Badge ENUM
// -----------------------------------------------------
export enum BadgeCategory {
  Join = "join",
  Level = "level",
  Vote = "vote",
  Comment = "comment",
  Feed = "feed",
  Login = "login",
}

export enum BadgeTier {
  Tier1 = 1,
  Tier2 = 2,
  Tier3 = 3,
  Tier4 = 4,
  Tier5 = 5,
}

// -----------------------------------------------------
// 2) Badge
// -----------------------------------------------------
export interface Badge {
  id: string;
  category: BadgeCategory;
  tier: BadgeTier;
  name: string;
  description: string;
  icon: string;
}

// -----------------------------------------------------
// 3) Team
// -----------------------------------------------------
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

// -----------------------------------------------------
// 4) User
// -----------------------------------------------------
export interface User {
  id: string;
  username: string;
  password: string;

  teamId: string;
  team?: Team;

  avatar: string;

  xp: number;
  level: number;

  // 활동 통계
  feedCount: number;
  commentCount: number;
  voteCount: number;
  loginCount: number;
  loginDays: number;

  joinedAt: string;

  bio?: string;
  badges?: string[];
}

// -----------------------------------------------------
// 5) Comment (PostDetailPage 기준 통합)
// -----------------------------------------------------
export interface Comment {
  id: string;
  authorId: string | null;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
  emotion?: "공감" | "드립" | "정보" | "비판";
}

// -----------------------------------------------------
// 6) Post
// -----------------------------------------------------
export interface Post {
  id: string;

  // 작성자 정보
  author: string;
  authorId?: string;
  authorName?: string;      // ⭐ FeedPage 필수
  avatar?: string;

  // 내용
  content: string;
  image?: string;

  // 좋아요
  likes: number;
  liked?: boolean;          // ⭐ FeedPage 필수
  isLiked?: boolean;        // 다른 페이지 호환

  // 댓글
  comments?: number;        // ⭐ FeedPage 필수 (갯수만)
  commentsList?: Comment[]; // 상세 페이지 용

  // 공통
  timestamp: string;

  // 선택
  team?: {
    id: string;
    name: string;
    color?: string;
  };
  user?: {
    id: string;
    username: string;
    avatar?: string;
    team?: { id: string; name: string; color?: string };
  };
  isMine?: boolean;
}


// -----------------------------------------------------
// 7) Poll
// -----------------------------------------------------
export interface Poll {
  id: string;

  author: string;
  avatar?: string;

  question: string;

  team?: Team | null;

  options: {
    id: string;
    text: string;
    votes: number;
  }[];

  totalVotes: number;

  userVotes: Record<string, string>;

  timestamp: string;

  category?: "팀투표" | "리그이슈" | "이벤트";
  createdBy?: string;
}
