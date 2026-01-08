# 칸반 보드 애플리케이션 (Kanban Board)

Next.js 16, TypeScript로 구축된 칸반 보드 프로젝트 관리 애플리케이션입니다.

## 주요 기능 (Implemented Features)

### 1. 컬럼(Column) 관리
- **조회**: 프로젝트 상태를 한눈에 파악할 수 있는 컬럼 리스트 조회 (`order` 기준 정렬)
- **생성**: 새로운 작업 상태를 정의하는 컬럼 추가 기능 (제목 필수, 유효성 검사 포함)
- **수정**: 컬럼 제목을 인라인으로 간편하게 수정 (Enter/Focus Out 저장, 낙관적 업데이트 적용)
- **삭제**: 불필요한 컬럼 및 포함된 카드 일괄 삭제 (삭제 확인 모달 제공)

### 2. 카드(Card) 관리
- **생성**: 각 컬럼 내에 새로운 작업(태스크) 추가 (제목 필수, 설명/마감일 선택)
- **상세 보기**: 카드 클릭 시 모달을 통해 상세 정보(제목, 설명, 날짜, 생성/수정일) 확인
- **수정**: 상세 보기 모달 내에서 작업 내용 실시간 수정
- **삭제**: 완료되거나 취소된 작업 삭제 기능
- **시각적 알림**: 마감일이 지난 카드는 붉은색 뱃지와 텍스트로 시각적 강조

### 3. 드래그 앤 드롭 (Drag & Drop)
- **직관적 이동**: `@dnd-kit`을 활용하여 마우스 드래그로 카드를 자유롭게 이동
- **컬럼 간 이동**: 작업 진행 상태 변경 (예: To Do -> Done)
- **순서 변경**: 동일 컬럼 내에서 작업 우선순위 조정
- **UX 강화**: 드래그 중인 항목 시각적 피드백(Overlay), 드롭 위치 가이드라인, 부드러운 애니메이션

### 4. 성능 및 UX 최적화
- **낙관적 업데이트 (Optimistic Updates)**: `React Query`를 활용하여 서버 응답 대기 없이 UI를 즉시 갱신, 에러 발생 시 자동 롤백
- **스켈레톤 UI**: 데이터 로딩 중 레이아웃 시프트를 방지하기 위한 스켈레톤 화면 제공
- **반응형 디자인**: 모바일 및 데스크탑 환경 모두 최적화 (Tailwind CSS)
- **접근성 준수**: `radix-ui` 기반의 컴포넌트를 사용하여 키보드 네비게이션 및 스크린 리더 지원

### 5. 백엔드 시뮬레이션
- **Mock API**: Next.js App Router (Route Handlers)를 활용한 RESTful API 구현
- **Mock DB**: 인메모리 데이터베이스(`mock-db.ts`)를 통해 데이터 영속성 흉내 및 CRUD 동작 구현
- **지연 시뮬레이션**: 실제 네트워크 환경을 모방하기 위한 200~500ms 인위적 지연 적용
- **Case 변환**: API(snake_case)와 프론트엔드(camelCase) 간 데이터 자동 변환 유틸리티 적용

### 6. UI/UX 편의 기능
- **다크 모드**: 시스템 설정 연동 및 수동 테마 전환(Light/Dark) 지원
- **빠른 작업 추가**: 헤더의 '작업 추가' 버튼을 통해 기본 컬럼(To Do)에 즉시 카드 생성
- **토스트 알림**: 작업 성공/실패 여부를 `sonner`를 통해 직관적인 피드백 제공

## 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **언어**: TypeScript 5.x
- **스타일링**: Tailwind CSS 4, shadcn-ui (Radix UI)
- **상태 관리**:
  - **Server State**: @tanstack/react-query (데이터 패칭, 캐싱, 낙관적 업데이트)
  - **Client State**: Zustand (전역 UI 상태, 모달 관리)
- **드래그 앤 드롭**: @dnd-kit/core, @dnd-kit/sortable
- **폼 & 검증**: react-hook-form, Zod
- **유틸리티**: date-fns (날짜 처리), lucide-react (아이콘), sonner (토스트 알림)
- **개발 환경**: Biome (Formatter), ESLint, Vitest

## 설계 및 의사결정 (Design Decisions)

### 1. 아키텍처: Feature-Based Design
기능(Feature) 단위로 코드를 응집시켜 유지보수성을 높였습니다.
- `src/features/board`: 보드 전체 레이아웃 및 드래그 컨텍스트
- `src/features/column`: 컬럼 관련 API, 훅, 컴포넌트
- `src/features/card`: 카드 관련 API, 훅, 컴포넌트
- 공통 UI 컴포넌트는 `src/components/ui`에 위치시켜 재사용성을 확보했습니다.

### 2. 상태 관리 전략: Server State vs Client State
- **Server State (React Query)**: 비동기 데이터의 상태 관리에는 React Query를 사용했습니다. 캐싱, 중복 요청 방지, 그리고 무엇보다 **낙관적 업데이트(Optimistic Updates)** 구현을 위해 필수적이었습니다. 사용자가 드래그 앤 드롭을 할 때 서버 응답을 기다리면 UX가 매우 저하되므로, UI를 먼저 업데이트하고 백그라운드에서 동기화하는 전략을 취했습니다.
  - **캐싱 전략**: `staleTime: 2분`, `gcTime: 10분`으로 설정했습니다.
    - **staleTime (2분)**: 공동 작업 환경을 고려하여 설정했습니다. 동시 접속보다는 비동기적으로 협업하는 팀원의 변경사항을 탭 복귀 시 빠르게 반영할 수 있도록 적절한 균형점을 선택했습니다. `refetchOnWindowFocus`(기본값 true)와 함께 동작하여 탭 복귀 시 자동으로 최신 데이터를 가져옵니다.
    - **gcTime (10분)**: staleTime보다 길게 설정하여 stale 상태의 데이터도 캐시에 유지합니다. 사용자가 탭을 잠시 떠났다 돌아왔을 때 캐시된 데이터를 즉시 보여주고, 백그라운드에서 최신 데이터를 가져오는 UX를 제공합니다.
- **Client State (Zustand)**: 모달의 열림/닫힘 여부, 보드 뷰 옵션 등 단순 클라이언트 UI 상태는 Context API보다 보일러플레이트가 적고 사용이 간편한 Zustand를 선택했습니다.

### 3. Mocking 전략
- 실제 백엔드 없이도 완전한 기능을 수행하기 위해 Next.js Route Handlers에 인메모리 DB를 구축했습니다.
- `setTimeout`을 이용한 랜덤 지연(Delay)을 추가하여, 로딩 상태(Skeleton)와 낙관적 업데이트가 실제로 잘 동작하는지 개발 환경에서 체감할 수 있도록 했습니다.

### 4. 테스트 전략 (Testing Strategy)
안정적인 서비스를 위해 ROI(투자 대비 효과)가 높은 영역부터 우선적으로 테스트를 작성했습니다.

- **작성 기준**:
  1. **유틸리티 (Utils)**: 앱 전반에서 사용되는 순수 함수(`formatDate`, `cn` 등)의 정확성 검증 (`src/lib/utils.test.ts`)
  2. **비즈니스 로직 (Core Logic)**: 데이터 무결성이 중요한 Mock DB의 ID 생성 및 CRUD 로직 검증 (`src/lib/mock-db.test.ts`)
  3. **데이터 검증 (Validation)**: 시스템 안정성을 위한 입력값 방어 로직(Schema) 검증 (`src/features/card/lib/schemas.test.ts`)
- **도구**: `Vitest` (Vite 기반의 빠른 실행 속도와 DX 고려)
- **테스트 실행:**
   ```bash
   npm run test
   ```

### 5. CI/CD 파이프라인 (GitHub Actions)
협업 환경에서의 코드 품질 유지를 위해 자동화된 파이프라인(`build` job)을 구축했습니다.
- **역할**: 코드가 Push되거나 PR이 생성될 때마다 자동으로 실행되어 잠재적인 문제를 사전에 차단합니다.
- **워크플로우 단계**:
  1. **Lint**: 코드 스타일 및 잠재적 에러 확인 (`eslint`)
  2. **Type Check**: TypeScript 컴파일 에러 확인 (`tsc --noEmit`)
  3. **Build**: 프로덕션 빌드 성공 여부 확인 (`next build`)
- **기대 효과**: 배포 전에 기본적인 오류를 걸러내어 안정성을 확보하고, 리뷰어의 리소스를 절약합니다.

### 6. 성능 최적화 (Performance)

드래그 앤 드롭 및 대량의 카드/컬럼 렌더링 시 불필요한 리렌더링을 방지하기 위해 React 메모이제이션을 체계적으로 적용했습니다.

#### React.memo 적용 컴포넌트

| 컴포넌트 | 경로 | 적용 이유 |
|----------|------|-----------|
| `CardItem` | `src/features/card/components/CardItem.tsx` | 카드 리스트에서 개별 카드의 불필요한 리렌더링 방지 |
| `SortableCard` | `src/features/board/components/SortableCard.tsx` | 드래그 시 다른 카드들의 리렌더링 방지 |
| `DroppableColumn` | `src/features/board/components/DroppableColumn.tsx` | 컬럼 단위 최적화, cardIds 배열 useMemo 적용 |
| `ColumnItem` | `src/features/column/components/ColumnItem.tsx` | 컬럼 리스트 리렌더링 최적화 |
| `ColumnHeader` | `src/features/column/components/ColumnHeader.tsx` | 핸들러 useCallback 적용으로 자식 컴포넌트 리렌더링 방지 |
| `CardDetailModal` | `src/features/card/components/CardDetailModal.tsx` | 모달 열림 시 폼 상태 보존, 불필요한 리셋 방지 |
| `CardDeleteDialog` | `src/features/card/components/CardDeleteDialog.tsx` | 다이얼로그 상태 안정화 |
| `ColumnDeleteDialog` | `src/features/column/components/ColumnDeleteDialog.tsx` | 다이얼로그 상태 안정화 |
| `CardAddButton` | `src/features/card/components/CardAddButton.tsx` | 입력 폼 상태 보존 |
| `ColumnAddButton` | `src/features/column/components/ColumnAddButton.tsx` | 입력 폼 상태 보존 |
| `QuickAddTaskButton` | `src/features/card/components/QuickAddTaskButton.tsx` | 컬럼 검색 useMemo 적용 |

#### 메모이제이션 전략

- **React.memo**: Props가 변경되지 않은 컴포넌트의 리렌더링 스킵
- **useMemo**: 비용이 큰 계산 결과 캐싱 (cardIds 배열, 컬럼 검색 등)
- **useCallback**: 핸들러 함수 참조 안정화로 자식 컴포넌트 최적화

#### 기대 효과

5개 컬럼 × 20개 카드 기준:
- **최적화 전**: 드래그 1회에 100회 이상 불필요한 리렌더
- **최적화 후**: 변경된 컴포넌트만 리렌더하여 10~15배 성능 개선

## 프로젝트 구조

```
src/
├── app/                      # Next.js App Router
│   ├── api/                  # Mock API Routes (columns, cards)
│   └── page.tsx              # 메인 페이지
├── components/               # 공통 컴포넌트
│   ├── ui/                   # shadcn-ui (Button, Dialog, Input 등)
│   └── providers.tsx         # QueryClientProvider, Toaster
├── features/                 # 도메인별 기능 모듈
│   ├── board/                # 보드 레이아웃, DnD Context
│   ├── column/               # 컬럼 CRUD, 컴포넌트
│   └── card/                 # 카드 CRUD, 상세 모달
├── lib/                      # 유틸리티
│   ├── api-client.ts         # Fetch wrapper
│   ├── mock-db.ts            # 인메모리 DB & 지연 시뮬레이션
│   └── schemas.ts            # Zod 유효성 검사 스키마
└── stores/                   # Zustand 스토어
```

## 실행 방법

1. **의존성 설치:**
   ```bash
   npm install
   ```

2. **개발 서버 실행:**
   ```bash
   npm run dev
   ```

3. **브라우저 접속:**
   [http://localhost:3000](http://localhost:3000)

## 과제 확인사항

- **Node.js 버전**: v18.17.0 이상 권장
- **🧪 문서를 꼼꼼히 읽었습니다**
