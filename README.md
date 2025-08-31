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
- 관리자를 위한 참가자 관리 기능

### 🗺️ 맵 관리

- 토너먼트용 맵 추가/삭제
- 관리자 전용 맵 설정 기능

### 🔐 인증 시스템

- JWT 기반 인증
- 역할 기반 접근 제어 (PLAYER/ADMIN)
- 안전한 비밀번호 관리

### ⚡ 실시간 업데이트

- WebSocket을 통한 실시간 토너먼트 상황 전달
- 자동 새로고침으로 최신 정보 유지

## 🚀 기술 스택

### Frontend

- **Next.js 15** - 최신 React 프레임워크 with Turbopack
- **TypeScript** - 타입 안전성 보장
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크
- **React Query** - 서버 상태 관리
- **React Hook Form** + **Yup** - 폼 관리 및 검증

### 상태 관리 및 통신

- **Axios** - HTTP 클라이언트
- **SockJS** + **STOMP** - WebSocket 통신
- **React Hot Toast** - 알림 메시지
- **JWT** - 인증 토큰 관리

### 개발 도구

- **ESLint** - 코드 품질 검사
- **TypeScript Strict Mode** - 엄격한 타입 검사

## 📁 프로젝트 구조

```
src/
├── api/              # API 클라이언트 함수들
│   ├── auth.ts       # 인증 관련 API
│   ├── players.ts    # 참가자 관련 API
│   ├── tournaments.ts # 토너먼트 관련 API
│   └── maps.ts       # 맵 관련 API
├── app/              # Next.js App Router 페이지들
│   ├── page.tsx      # 메인 페이지
│   ├── apply/        # 참가 신청 페이지
│   ├── login/        # 로그인 페이지
│   ├── tournament/   # 토너먼트 페이지
│   ├── players/      # 참가자 관리 페이지
│   └── maps/         # 맵 관리 페이지
├── components/       # 재사용 가능한 컴포넌트들
├── contexts/         # React Context들
│   ├── AuthContext.tsx    # 인증 상태 관리
│   └── WebSocketContext.tsx # WebSocket 연결 관리
├── types/            # TypeScript 타입 정의
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
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:8080/ws
```

## 📋 사용법

### 참가자로 사용하기

1. **참가 신청**: 메인 페이지에서 "참가 신청하기" 클릭
2. **정보 입력**: 이름, 닉네임, 종족, 4자리 숫자 비밀번호 입력
3. **토너먼트 참여**: 로그인 후 토너먼트 페이지에서 실시간 진행 상황 확인

### 관리자로 사용하기

1. **관리자 로그인**: 관리자 계정으로 로그인
2. **참가자 관리**: 참가자 목록 확인 및 관리
3. **맵 관리**: 토너먼트용 맵 추가/삭제
4. **토너먼트 관리**: 매치 결과 입력 및 토너먼트 진행

## 🎯 주요 페이지

### 🏠 메인 페이지 (`/`)

- 토너먼트 소개 및 특징 안내
- 참가 신청 및 대회 현황 확인 버튼
- 반응형 디자인으로 모든 기기에서 최적화

### 📝 참가 신청 (`/apply`)

- 실시간 폼 검증
- 종족 선택 (프로토스/테란/저그)
- 4자리 숫자 비밀번호 제한

### 🔐 로그인 (`/login`)

- 참가자/관리자 통합 로그인
- JWT 토큰 기반 인증
- 자동 리다이렉션

### 🏆 토너먼트 (`/tournament`)

- 실시간 토너먼트 상황 표시
- WebSocket 기반 자동 업데이트
- 관리자용 결과 입력 인터페이스

### 👥 참가자 관리 (`/players`)

- 전체 참가자 목록
- 종족별 통계 표시
- 관리자용 참가자 삭제 기능

### 🗺️ 맵 관리 (`/maps`)

- 관리자 전용 기능
- 맵 추가/삭제
- 토너먼트용 맵 설정

## 🐛 문제 해결

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

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 👨‍💻 개발자

**mukhoplus** - [GitHub](https://github.com/mukhoplus)

## 🙏 감사의 말

- [Next.js](https://nextjs.org/) 팀의 훌륭한 프레임워크
- [Tailwind CSS](https://tailwindcss.com/)의 아름다운 디자인 시스템
- [React Query](https://tanstack.com/query/latest)의 강력한 서버 상태 관리
- StarCraft 커뮤니티의 지속적인 열정

---

⚡ **복면스타왕에서 당신의 진정한 실력을 증명해보세요!** ⚡
