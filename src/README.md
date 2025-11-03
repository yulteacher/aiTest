# KBO 팬덤 커뮤니티

AI 챗봇 지원 KBO 팬덤 커뮤니티 앱

## 주요 기능

- 🏟️ **KBO 10개 구단 지원**: 두산, 삼성, LG, KT, SSG, 롯데, 한화, NC, 키움, KIA
- 📱 **SNS 기능**: 게시글 작성, 수정, 삭제, 좋아요, 댓글
- 🗳️ **투표 기능**: 팬 투표 생성 및 참여
- 🤖 **AI 챗봇**: 야구 관련 질문 지원
- 🌓 **다크모드**: 화이트/다크 모드 지원
- 📲 **반응형**: 모바일/데스크톱 최적화

## 기술 스택

- React 18
- Vite
- Tailwind CSS 4
- Motion (Framer Motion)
- Lucide React Icons
- LocalStorage (데이터 저장)

## 로컬 개발

\`\`\`bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 빌드
npm run build

# 프리뷰
npm run preview
\`\`\`

## Vercel 배포

1. GitHub에 푸시
2. Vercel에서 프로젝트 Import
3. Framework Preset: **Vite** 선택
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Deploy 클릭

## 구조

- `/components` - React 컴포넌트
- `/constants` - 구단 정보 등 상수
- `/styles` - 전역 CSS
- `/utils` - 유틸리티 함수

## 라이센스

MIT
