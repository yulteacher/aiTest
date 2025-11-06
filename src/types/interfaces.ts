// ===============================
// 🎯 KBO 팬덤 커뮤니티 인터페이스 통합
// ===============================

// ⚾ 1️⃣ 유저 정보 (회원가입 / 로그인 / 활동 기반)
export interface User {
  id: string;                // ex) "u_lg_5"
  username: string;          // 닉네임 (중복 불가)
  password: string;          // 로그인용 비밀번호 (local only)
  teamId: string;            // ex) "lg"
  avatar: string;            // ✅ 프로필 이미지 (선택 아님)
  xp: number;                // 경험치
  level: number;             // 레벨
  badges: string[];          // 배지 리스트
  joinedAt: string;          // 가입일
}

// ⚾ 2️⃣ 팀 정보 (정적 데이터)
export interface Team {
  id: string;                // ex) "lg"
  name: string;              // ex) "LG 트윈스"
  color: string;             // ex) "#C30452"
  logo: string;              // 로고 이미지 경로
}

// ⚾ 3️⃣ 게시글 (Feed)
export interface Post {
  id: string;                // ex) "p_lg_12"
  authorId: string;          // 작성자 id (User.id)
  teamId: string;            // 게시글 소속팀
  content: string;           // 본문
  image?: string;            // 첨부 이미지 (선택)
  likes: string[];           // 좋아요 누른 유저 id 배열
  comments: Comment[];       // 댓글 목록
  timestamp: string;         // "2시간 전" 등
  category: '응원' | '불만' | '감상' | '사진' | '밈' | '잡담';
}

// ⚾ 4️⃣ 댓글 (게시글 하위)
export interface Comment {
  id: string;                // ex) "c_lg_101"
  postId: string;            // 연결된 게시글 id
  authorId: string;          // 작성자 id
  content: string;           // 댓글 본문
  timestamp: string;         // "30분 전"
  emotion: '공감' | '드립' | '정보' | '비판'; // 댓글 성격
}

// ⚾ 5️⃣ 투표 (Poll)
export interface Poll {
  id: string;
  author: string;
  avatar?: string;                      // ex) "poll_lg_3"
  teamId: string | 'all';             // 팀별 or 전체
  category: '팀투표' | '리그이슈' | '이벤트';
  question: string;                   // 투표 질문
  options: { id: string; text: string; votes: number }[];
  totalVotes: number;                 // 전체 투표수
  userVotes: Record<string, string>;  // { userId: optionId }
  createdBy: string;                  // 생성자 id (모든 유저 가능)
  timestamp: string;                  // "1일 전"
}

// ⚾ 6️⃣ 배지 (BadgeGrid.tsx, MyPage.tsx 연동)
export interface Badge {
  id: string;               // ex) "first_post"
  name: string;             // ex) "첫 게시글"
  description: string;      // ex) "처음으로 글을 작성했어요!"
  icon: string;             // 아이콘 경로
  condition: string;        // 획득 조건 설명
}
