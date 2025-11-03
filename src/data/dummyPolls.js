export const dummyPollsData = [
  {
    id: '1',
    author: '야구팬',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    question: '올 시즌 우승 예상 팀은?',
    options: [
      { id: '1', text: 'SSG 랜더스', votes: 145 },
      { id: '2', text: 'LG 트윈스', votes: 123 },
      { id: '3', text: 'KIA 타이거즈', votes: 98 },
      { id: '4', text: '삼성 라이온즈', votes: 87 }
    ],
    totalVotes: 453,
    timestamp: '1일 전',
    userVoted: null
  },
  {
    id: '2',
    author: 'KBO마니아',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop',
    question: '가장 보고 싶은 포지션은?',
    options: [
      { id: '1', text: '투수', votes: 167 },
      { id: '2', text: '타자', votes: 234 },
      { id: '3', text: '내야수', votes: 89 },
      { id: '4', text: '외야수', votes: 76 }
    ],
    totalVotes: 566,
    timestamp: '2일 전',
    userVoted: '2'
  },
  {
    id: '3',
    author: '야구사랑',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    question: '다음 주말 직관 가실 분?',
    options: [
      { id: '1', text: '토요일', votes: 256 },
      { id: '2', text: '일요일', votes: 198 },
      { id: '3', text: '둘 다!', votes: 145 }
    ],
    totalVotes: 599,
    timestamp: '3일 전',
    userVoted: null
  }
];
