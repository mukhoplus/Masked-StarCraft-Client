# 🎭 복면스타왕 (Masked StarCraft)

StarCraft 토너먼트 관리 시스템의 프론트엔드 애플리케이션입니다. 참가자들이 익명으로 참여하여 실력만으로 경쟁하는 토너먼트를 운영할 수 있습니다.

## ✨ 주요 기능

### 🏆 토너먼트 관리

- 실시간 토너먼트 진행 상황 확인
- 매치 결과 입력 및 관리
- 자동화된 토너먼트 브라켓 생성

### 👥 참가자 시스템

- 간편한 참가 신청 (이름, 닉네임, 종족, 4자리 비밀번호)
- 종족별 통계 및 참가자 현황
- **참가자 본인 참가 취소**: 로그인한 참가자가 자신의 참가를 취소 가능
- **자동 로그아웃**: 참가 취소 시 자동으로 시스템에서 로그아웃
- 관리자를 위한 참가자 관리 기능
- RESTful API (`/me` 엔드포인트) 기반 안전한 본인 정보 관리

### 🗺️ 맵 관리

- 토너먼트용 맵 추가/삭제
- 관리자 전용 맵 설정 기능

### 🔐 인증 시스템

- JWT 기반 인증
- 역할 기반 접근 제어 (PLAYER/ADMIN)
- 안전한 비밀번호 관리

### ⚡ 실시간 업데이트

- WebSocket을 통한 실시간 토너먼트 상황 전달
- 자동 새로고침으로 최신 정보 유지 (대회 현황 페이지)
- SockJS + STOMP 기반 실시간 통신

### 📋 로그 관리

- 대회 진행 로그 실시간 확인
- 로그 파일 다운로드 기능 (.log 형식)
- 관리자 전용 로그 관리 시스템

### 🛡️ 스마트 접근 제어 시스템

- **대회 시작 전**: 참가 신청 ✅, 참가 취소 ✅
- **대회 진행 중** (`IN_PROGRESS`): 참가 신청 ❌, 참가 취소 ❌
- **대회 종료 후** (`FINISHED`): 참가 신청 ✅ (다음 대회용), 참가 취소 ✅
- 실시간 대회 상태 확인 및 UI 자동 업데이트
- 토너먼트 무결성 보장을 위한 동적 권한 관리

## 🚀 기술 스택

### Frontend

- **Next.js 15** - 최신 React 프레임워크 with Turbopack
- **TypeScript** - 타입 안전성 보장
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크
- **React Query** - 서버 상태 관리
- **React Hook Form** + **Yup** - 폼 관리 및 검증

### 상태 관리 및 통신

- **TanStack Query (React Query)** - 서버 상태 관리 및 캐싱
- **Axios** - HTTP 클라이언트
- **SockJS** + **STOMP** - WebSocket 통신 및 실시간 업데이트
- **React Hot Toast** - 사용자 알림 메시지
- **JWT** - 안전한 인증 토큰 관리

### 개발 도구

- **ESLint** - 코드 품질 검사
- **TypeScript Strict Mode** - 엄격한 타입 검사

## 📁 프로젝트 구조

```
src/
├── api/              # API 클라이언트 함수들
│   ├── auth.ts       # 인증 관련 API
│   ├── players.ts    # 참가자 관련 API (본인 참가 취소 /me 엔드포인트 포함)
│   ├── tournaments.ts # 토너먼트 관련 API
│   ├── maps.ts       # 맵 관리 API
│   └── logs.ts       # 로그 관리 API
├── app/              # Next.js App Router 페이지들
│   ├── page.tsx      # 메인 페이지
│   ├── apply/        # 참가 신청 페이지
│   ├── login/        # 로그인 페이지
│   ├── tournament/   # 토너먼트 페이지
│   ├── players/      # 참가자 관리 페이지
│   ├── maps/         # 맵 관리 페이지
│   └── logs/         # 로그 관리 페이지
├── components/       # 재사용 가능한 컴포넌트들
│   ├── Header.tsx    # 네비게이션 헤더 (WebSocket 연결 상태 표시)
│   ├── Footer.tsx    # 푸터
│   ├── LoadingSpinner.tsx # 로딩 인디케이터
│   └── RaceBadge.tsx # 종족 배지
├── contexts/         # React Context들
│   ├── AuthContext.tsx    # 인증 상태 관리
│   └── WebSocketContext.tsx # WebSocket 연결 및 자동 새로고침 관리
├── hooks/            # 커스텀 훅들
│   ├── useAuth.ts    # 인증 훅
│   ├── useTournaments.ts # 토너먼트 데이터 훅 (자동 새로고침 포함)
│   └── usePlayers.ts # 참가자 데이터 훅
├── types/            # TypeScript 타입 정의
│   └── index.ts      # 통합 타입 정의 (Tournament, Player, Log 등)
└── utils/            # 유틸리티 함수들
```

## 🛠️ 설치 및 실행

### 필수 요구사항

- Node.js 18.0.0 이상
- npm, yarn, 또는 pnpm

### 설치

```bash
# 저장소 클론
git clone https://github.com/mukhoplus/Masked-StarCraft-Client.git
cd Masked-StarCraft-Client

# 의존성 설치
npm install
# 또는
yarn install
# 또는
pnpm install
```

### 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

### 프로덕션 빌드

```bash
npm run build
npm start
```

## 🔧 환경 설정

환경 변수를 설정하기 위해 `.env.local` 파일을 생성하세요:

```env
# 백엔드 API URL
NEXT_PUBLIC_API_URL=http://localhost:8080

# WebSocket URL
NEXT_PUBLIC_WS_URL=http://localhost:8080/ws
```

## 📋 사용법

### 참가자로 사용하기

1. **참가 신청**: 메인 페이지에서 "참가 신청하기" 클릭 (대회 진행 중에는 불가)
2. **정보 입력**: 이름, 닉네임, 종족, 4자리 숫자 비밀번호 입력
3. **토너먼트 참여**: 로그인 후 토너먼트 페이지에서 실시간 진행 상황 확인
4. **참가 관리**:
   - 참가자 목록(`/players`)에서 본인 정보 확인
   - 필요시 "❌ 참가 취소" 버튼으로 참가 철회 (대회 진행 중에는 불가)
   - 참가 취소 시 자동 로그아웃 및 메인 페이지로 이동

### 관리자로 사용하기

1. **관리자 로그인**: 관리자 계정으로 로그인
2. **참가자 관리**: 참가자 목록 확인 및 관리
3. **맵 관리**: 토너먼트용 맵 추가/삭제
4. **토너먼트 관리**: 경기 결과 입력 및 대회 진행
5. **로그 관리**: 대회 진행 상황 로그 확인 및 다운로드

## 🎯 핵심 특징

### 🔄 실시간 자동 업데이트

- **대회 현황 페이지**: WebSocket을 통한 실시간 데이터 자동 새로고침
- **서버 메시지 수신**: `/topic/tournament`, `/topic/refresh`, `/topic/game-result` 구독
- **자동화된 UI 업데이트**: 사용자 수동 새로고침 불필요

### 🛡️ 스마트한 접근 제어

- **대회 상태별 참가 관리**:
  - ✅ **대회 시작 전**: 참가 신청 ✅, 참가 취소 ✅
  - ❌ **대회 진행 중** (`IN_PROGRESS`): 참가 신청 ❌, 참가 취소 ❌
  - ✅ **대회 종료 후** (`FINISHED`): 참가 신청 ✅ (다음 대회용), 참가 취소 ✅
- **동적 UI 제어**: 대회 상태에 따른 버튼 활성화/비활성화 및 안내 메시지
- **데이터 무결성 보장**: 토너먼트 진행 중 참가자 변동 방지

### 👤 개인 정보 관리

- **본인 참가 취소**: JWT 토큰 기반 본인 인증으로 안전한 참가 취소
- **자동 로그아웃**: 참가 취소 완료 시 자동 로그아웃 및 메인 페이지 이동
- **RESTful API**: `/me` 엔드포인트를 통한 표준적인 본인 정보 관리

### 📊 통합 관리 시스템

- **로그 시스템**: 모든 대회 진행 상황을 실시간 로그로 기록
- **파일 다운로드**: 대회 종료 후 완전한 로그 파일 다운로드 가능
- **관리자 권한**: 역할 기반 UI 요소 표시/숨김

## 🎯 주요 페이지

### 🏠 메인 페이지 (`/`)

- 토너먼트 소개 및 특징 안내
- 참가 신청 및 대회 현황 확인 버튼
- 반응형 디자인으로 모든 기기에서 최적화

### 📝 참가 신청 (`/apply`)

- 실시간 폼 검증
- 종족 선택 (프로토스/테란/저그)
- 4자리 숫자 비밀번호 제한
- 대회 진행 중 참가 신청 제한 (대회 종료 후 재개)

### 🔐 로그인 (`/login`)

- 참가자/관리자 통합 로그인
- JWT 토큰 기반 인증
- 자동 리다이렉션

### 🏆 토너먼트 (`/tournament`)

- 실시간 토너먼트 상황 표시
- WebSocket 기반 자동 새로고침 (대회 현황만)
- 관리자용 경기 결과 입력 인터페이스
- 대회 시작/진행 상태 실시간 확인
- 참가자별 경기 기록 및 통계

### 👥 참가자 관리 (`/players`)

- 전체 참가자 목록 및 종족별 통계 표시
- **참가자 본인 기능**:
  - 자신의 참가 정보에 "❌ 참가 취소" 버튼 표시
  - 참가 취소 시 자동 로그아웃 및 메인 페이지로 이동
  - 대회 진행 중에는 "🔒 대회 진행 중" 메시지로 취소 불가
- **관리자 전용 기능**:
  - 모든 참가자 삭제 기능 ("🗑️ 삭제" 버튼)
  - 전체 참가자 초기화 기능
- RESTful API (`/api/v1/players/me`) 기반 안전한 본인 정보 관리

### 🗺️ 맵 관리 (`/maps`)

- 관리자 전용 기능
- 맵 추가/삭제
- 토너먼트용 맵 설정

### 📋 로그 관리 (`/logs`)

- 관리자 전용 기능
- 실시간 대회 진행 로그 확인
- 로그 파일 다운로드 (.log 형식)
- 날짜별 로그 관리

## 🐛 문제 해결

### WebSocket 연결 문제

```bash
# 백엔드 서버 확인
curl http://localhost:8080/ws

# 환경 변수 확인
echo $NEXT_PUBLIC_WS_URL
```

### 자동 새로고침이 작동하지 않는 경우

1. 브라우저 개발자 도구에서 WebSocket 연결 상태 확인
2. 헤더의 연결 상태 표시등 확인 (녹색: 연결됨, 빨간색: 연결 끊어짐)
3. 콘솔에서 WebSocket 메시지 수신 로그 확인

### 개발 서버 실행 오류

```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# 캐시 클리어
npm run dev -- --turbo
```

### 빌드 오류

```bash
# TypeScript 검사
npm run type-check

# ESLint 검사
npm run lint
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 👨‍💻 개발자

**mukhoplus** - [GitHub](https://github.com/mukhoplus)

---

⚡ **복면스타왕에서 당신의 진정한 실력을 증명해보세요!** ⚡
