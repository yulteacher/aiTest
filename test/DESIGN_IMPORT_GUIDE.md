# 🎨 Figma 디자인 임포트 가이드

## Figma Make에서 디자인 가져오기

Figma Make는 Figma 디자인을 직접 가져와서 React 코드로 변환할 수 있는 기능을 제공합니다!

### 📋 임포트 방법

1. **Figma 파일 준비**
   - Figma에서 원하는 디자인 프레임을 선택합니다
   - 디자인이 Auto Layout을 사용하면 더 정확한 코드가 생성됩니다

2. **Figma Make에서 임포트**
   - Figma Make 인터페이스에서 "Import from Figma" 버튼을 클릭
   - Figma 파일 URL을 붙여넣거나 파일을 선택
   - 가져올 프레임을 선택

3. **코드 생성**
   - Figma Make가 자동으로 React + Tailwind CSS 코드로 변환
   - SVG 아이콘과 이미지도 함께 임포트됩니다
   - `/imports` 폴더에 필요한 에셋이 저장됩니다

### 🔄 임포트된 코드 사용하기

임포트된 코드는 다음과 같이 사용할 수 있습니다:

```jsx
// 임포트된 컴포넌트 불러오기
import ImportedDesign from './components/ImportedDesign';

function App() {
  return (
    <div>
      <ImportedDesign />
    </div>
  );
}
```

### ⚠️ 주의사항

- **레이아웃 보존**: 임포트된 코드의 구조와 Tailwind 클래스를 최대한 유지해야 합니다
- **이미지/SVG**: `figma:asset` 경로나 `/imports` 폴더의 SVG를 그대로 사용하세요
- **수정 시**: 기능을 추가할 때는 원본 디자인의 레이아웃이 깨지지 않도록 주의하세요

### 💡 활용 팁

1. **컴포넌트 재사용**
   - 임포트한 디자인을 재사용 가능한 컴포넌트로 분리
   - props를 추가하여 동적으로 만들기

2. **인터랙션 추가**
   - 임포트된 정적 디자인에 onClick, hover 등의 이벤트 추가
   - Motion/React로 애니메이션 효과 추가

3. **데이터 연결**
   - 하드코딩된 텍스트를 state나 props로 교체
   - API 데이터와 연결

### 🎯 현재 프로젝트 적용

KBO 팬덤 앱에 새로운 디자인을 적용하려면:

1. Figma에서 디자인한 페이지/컴포넌트를 임포트
2. 구단 컬러와 로고를 적용하여 커스터마이징
3. 기존 기능(좋아요, 투표 등)과 통합

예를 들어, 새로운 경기 일정 카드를 디자인했다면:
- Figma에서 임포트
- KBO 구단 데이터와 연결
- Motion으로 인터랙션 추가
- 기존 앱에 통합

### 📚 더 알아보기

- Figma Auto Layout: 더 정확한 코드 생성을 위해 사용
- Component Variants: 상태별 디자인을 자동으로 코드화
- Design Tokens: 색상, 폰트 등을 일관되게 관리

---

**질문이 있으시면 언제든 AI 어시스턴트에게 물어보세요!** ⚾
