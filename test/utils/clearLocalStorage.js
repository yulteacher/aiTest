// 로컬스토리지 초기화 함수
export const clearAllKBOData = () => {
  localStorage.removeItem('posts');
  localStorage.removeItem('polls');
  localStorage.removeItem('chatMessages');
  localStorage.removeItem('notifications');
  console.log('✅ KBO 앱 데이터가 초기화되었습니다. 페이지를 새로고침하세요!');
};

// 브라우저 콘솔에서 사용:
// clearAllKBOData()
