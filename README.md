# 🎯 DOT-DAILY

**당신의 하루를 점으로 연결하는 일상 관리 앱**

> "완벽하지 않아도 괜찮다" - 유연한 할 일 관리와 감정 기록을 통한 자기 성찰

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.9-blue?style=flat-square&logo=prisma)](https://www.prisma.io/)

## 📖 목차

- [프로젝트 소개](#-프로젝트-소개)
- [선정 배경](#-선정-배경)
- [기획 의도](#-기획-의도)
- [핵심 기능](#-핵심-기능)
- [기술 스택](#-기술-스택)
- [프로젝트 구조](#-프로젝트-구조)
- [시작하기](#-시작하기)
- [개발 환경 설정](#-개발-환경-설정)
- [코드 리뷰 설정](#-코드-리뷰-설정)
- [API 문서](#-api-문서)
- [배포](#-배포)
- [팀 소개](#-팀-소개)
- [개선 계획](#-개선-계획)

## 🎯 프로젝트 소개

DOT-DAILY는 일상 속 할 일을 단순히 "완료"하는 것을 넘어서, 감정과 함께 기록하고 돌아볼 수 있는 모바일 중심의 웹 애플리케이션입니다.

### 🌟 핵심 철학

- **"완벽하지 않아도 괜찮다"**: 유연한 할 일 관리
- **모바일 퍼스트**: 언제 어디서나 빠른 접근
- **감정 기록을 통한 자기 성찰**: 데이터 기반 개인 분석

### 🎨 주요 특징

- **모바일 친화적 UI**: 네이티브 앱과 같은 직관적인 사용자 경험
- **감정 기반 회고**: 5가지 감정 스티커로 일일 기록
- **유연한 할 일 관리**: 보류함, 재시도 등 다양한 상태 관리
- **데이터 기반 인사이트**: 개인 패턴 분석 및 통계 제공
- **게스트 모드**: 로그인 없이 기본 기능 체험 가능

## 💡 선정 배경

### 기존 앱들의 한계점

#### 1. 복잡한 기능 과부하

- 프로젝트 관리, 팀 협업, 시간 추적 등 과도한 기능
- 단순한 "오늘 뭘 할까?" 질문에 답하기 어려운 복잡성

#### 2. 완료 압박감

- "미완료 = 실패" 이분법적 사고 조장
- 빨간색 경고, 실패 메시지로 인한 스트레스 가중

#### 3. 모바일 UX 부족

- 데스크톱 중심 설계로 모바일 사용 불편
- 이동 중 빠른 할 일 추가/확인 어려움

#### 4. 감정과 분리된 관리

- "했다/안 했다" 체크만 가능
- "왜 못했는지", "그때 어떤 기분이었는지" 성찰 부족

### 개인적 경험

- 완벽주의 성향으로 인한 스트레스
- 모바일로 빠른 기록 필요성 체감
- 감정과 함께 성찰할 수 있는 도구 필요성

## 🚀 기획 의도

### 1. "완벽하지 않아도 괜찮다"는 철학

기존 앱들이 "오늘 할 일을 모두 완료하세요!"라고 압박한다면, DOT-DAILY는 "못한 일은 내일로, 보류할 일은 보류함으로" 보내도 괜찮다는 유연한 접근을 제공합니다.

### 2. 모바일 퍼스트 설계

언제 어디서나 빠른 할 일 등록과 확인이 가능하도록 모바일 환경을 최우선으로 고려했습니다. 네이티브 앱과 같은 직관적인 사용자 경험을 웹에서 구현했습니다.

### 3. 감정 기록을 통한 자기 성찰

단순한 할 일 관리를 넘어서 감정 기록과 통합하여, 데이터를 기반으로 한 개인 성향 분석과 개선점 도출이 가능하도록 설계했습니다.

## ✨ 핵심 기능

### 📝 우선순위별 할 일 관리 (나의 하루)

- **3단계 우선순위**: 오늘 무조건(must) / 오늘이면 굿(should) / 잊지말자(remind)
- **상태 관리**: 대기(pending) → 성공(success) / 다시(retry) / 보류(archive)
- **완료 애니메이션**: Framer Motion을 활용한 성취감을 주는 시각적 효과
- **자동 리셋**: 매일 자정 미완료 할 일 자동 재시도 상태로 변경
- **게스트 모드**: 로그인 없이 로컬 스토리지 기반 할 일 관리

### 🎭 감정 기반 일일 회고 (오늘 회고)

- **5가지 감정 스티커**: 좋음, 나쁨, 그냥그럼, 뿌듯함, 감사함
- **텍스트 메모**: 하루 마무리 기록
- **캘린더 기반 조회**: FullCalendar를 활용한 감정 패턴 분석
- **연속 기록 추적**: 스트릭(연속 달성일) 시스템

### 📦 보류함 (Archive)

- **날짜별 정리**: 보류한 할 일을 체계적으로 관리
- **재도전 기능**: 다시 도전하거나 완료 처리 가능
- **성취 흐름 회고**: 보관함에서 개인 성장 추이 확인

### 📊 통계 대시보드 (나의 정보)

- **기간별 통계**: 전체 / 1개월 / 1주일 단위 분석
- **할 일 완료율**: 성공, 대기, 재시도, 보류 상태별 통계
- **감정 변화 추이**: 시각화된 감정 패턴
- **개인 패턴 인사이트**: 데이터 기반 개선점 제시

### 🔐 인증 시스템

- **일반 로그인**: 이메일/비밀번호 기반 인증
- **게스트 모드**: 로그인 없이 기본 기능 체험 (로컬 스토리지 활용)
- **데이터 동기화**: 모든 기기에서 데이터 공유

## 🛠 기술 스택

### Frontend

- **Framework**: Next.js 15.3.3 (App Router)
- **Language**: TypeScript 5.8
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3.3.5 + class-variance-authority (CVA)
- **State Management**: Zustand (클라이언트 상태) + React Query 5.81.2 (서버 상태)
- **Animation**: Framer Motion 12.18.1
- **UI Components**: Headless UI, Lucide React
- **Calendar**: FullCalendar 6.1.18
- **Drag & Drop**: @hello-pangea/dnd 18.0.1
- **Documentation**: Storybook 9.0.8
- **Testing**: Vitest 3.2.3

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Language**: TypeScript 5.8.3
- **Database**: PostgreSQL
- **ORM**: Prisma 6.9.0
- **Authentication**: JWT, Google OAuth (Passport)
- **Validation**: Zod 3.25.67
- **Documentation**: Swagger/OpenAPI
- **Cron Jobs**: node-cron 4.2.0
- **Development**: Nodemon 3.1.10

### DevOps & Tools

- **Package Manager**: npm
- **Version Control**: Git
- **Code Quality**: ESLint 9, Prettier 3.5.3
- **Design**: Figma
- **Deployment**: Vercel (Frontend), Render (Backend)
- **Database**: Supabase (Local Development)
- **Bundle Analysis**: @next/bundle-analyzer

## 📁 프로젝트 구조

```
DOT-DAILY/
├── frontend/                 # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/             # App Router 페이지
│   │   │   ├── (dashboard)/ # 대시보드 레이아웃
│   │   │   │   ├── myday/   # 나의 하루 페이지
│   │   │   │   ├── retrospect/ # 회고 페이지
│   │   │   │   └── archive/ # 보류함 페이지
│   │   │   ├── (auth)/      # 인증 레이아웃
│   │   │   │   ├── login/   # 로그인 페이지
│   │   │   │   └── signup/  # 회원가입 페이지
│   │   │   ├── profile/     # 프로필 페이지
│   │   │   └── ...
│   │   ├── components/      # 재사용 컴포넌트
│   │   │   ├── ui/          # 기본 UI 컴포넌트 (CVA 적용)
│   │   │   │   ├── Button/  # 12가지 스타일 조합 버튼
│   │   │   │   ├── Modal/   # 전체화면 모달 시스템
│   │   │   │   ├── Toast/   # 토스트 알림
│   │   │   │   └── Skeleton/ # 로딩 스켈레톤
│   │   │   ├── layout/      # 레이아웃 컴포넌트
│   │   │   └── ...
│   │   ├── features/        # 도메인 단위 모듈화
│   │   │   ├── myday/       # 나의 하루 기능
│   │   │   ├── archive/     # 보류함 기능
│   │   │   ├── retrospect/  # 회고 기능
│   │   │   └── ...
│   │   ├── lib/             # 유틸리티 및 API
│   │   │   ├── api/         # API 클라이언트
│   │   │   └── styles/      # CVA 스타일 시스템
│   │   ├── store/           # Zustand 스토어
│   │   ├── hooks/           # 커스텀 훅
│   │   └── constants/       # 상수 정의
│   └── public/              # 정적 자산 (감정 스티커, 로고 등)
├── backend/                  # Express.js 백엔드
│   ├── controller/          # 컨트롤러
│   ├── service/             # 비즈니스 로직
│   ├── router/              # 라우터
│   ├── prisma/              # 데이터베이스 스키마
│   │   ├── schema.prisma    # Prisma 스키마
│   │   └── migrations/      # 마이그레이션 파일
│   ├── middlewares/         # 미들웨어
│   ├── validations/         # Zod 입력 검증
│   ├── docs/                # Swagger 문서
│   ├── jobs/                # Cron 작업
│   └── ...
└── ...
```

## 🚀 시작하기

### 필수 요구사항

- Node.js 18+
- npm 또는 yarn
- PostgreSQL (또는 Supabase)

### 1. 저장소 클론

```bash
git clone https://github.com/sunfivemin/DOT-DAILY.git
cd DOT-DAILY
```

### 2. 의존성 설치

```bash
# 루트 의존성 설치
npm install

# 프론트엔드 의존성 설치
cd frontend
npm install

# 백엔드 의존성 설치
cd ../backend
npm install
```

### 3. 환경변수 설정

#### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

#### Backend (.env)

```env
DATABASE_URL="postgresql://username:password@localhost:5432/dotdaily"
DIRECT_URL="postgresql://username:password@localhost:5432/dotdaily"
JWT_SECRET="your-super-secret-jwt-key"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

### 4. 데이터베이스 설정

```bash
cd backend
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### 5. 개발 서버 실행

```bash
# 백엔드 서버 (포트 3001)
cd backend
npm run dev

# 프론트엔드 서버 (포트 3000)
cd frontend
npm run dev
```

## 🔧 개발 환경 설정

### 프론트엔드 개발

```bash
cd frontend

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 테스트
npm run test

# 린트 검사
npm run lint

# Storybook 실행
npm run storybook

# 번들 분석
npm run analyze
```

### 백엔드 개발

```bash
cd backend

# 개발 서버 실행
npm run dev

# 데이터베이스 마이그레이션
npm run db:migrate:dev

# Prisma Studio 실행
npm run db:studio

# 빌드
npm run build

# Supabase 로컬 개발
npm run supabase:start
```

## 🤖 코드 리뷰 설정

### Gemini AI 코드 리뷰

이 프로젝트는 Gemini AI를 활용한 한국어 코드 리뷰를 지원합니다.

#### 설정 방법

1. **스타일 가이드 확인**

   ```bash
   # .gemini/styleguide.md 파일이 프로젝트에 포함되어 있습니다
   cat .gemini/styleguide.md
   ```

2. **PR에서 Gemini 리뷰 요청**
   - GitHub PR 생성 시 Gemini에게 한국어로 코드 리뷰를 요청하세요
   - `.gemini/styleguide.md` 파일을 참조하여 일관된 리뷰를 받을 수 있습니다

#### 리뷰 가이드라인

- **언어**: 모든 리뷰는 한국어로 작성됩니다
- **구조**: 장점 → 개선점 → 보안 → 성능 순서로 리뷰
- **스타일**: 구체적이고 실용적인 제안을 제공
- **컨벤션**: 프로젝트의 코딩 스타일 가이드를 준수

#### Copilot 연동

- GitHub Copilot도 한국어로 응답하도록 설정됩니다
- 프로젝트의 스타일 가이드를 참조하여 일관된 코드 제안을 받을 수 있습니다

## 📚 API 문서

### 주요 엔드포인트

#### 인증

- `POST /api/v1/auth/login` - 로그인
- `POST /api/v1/auth/register` - 회원가입
- `GET /api/v1/auth/google` - Google OAuth

#### 할 일 관리

- `GET /api/v1/todos` - 할 일 목록 조회
- `POST /api/v1/todos` - 할 일 생성
- `PUT /api/v1/todos/:id` - 할 일 수정
- `DELETE /api/v1/todos/:id` - 할 일 삭제
- `PUT /api/v1/todos/:id/status` - 상태 변경

#### 통계

- `GET /api/v1/user/stats?period=week` - 사용자 통계 (기간별)

#### 회고

- `GET /api/v1/reviews` - 회고 목록
- `POST /api/v1/reviews` - 회고 생성

자세한 API 문서는 개발 서버 실행 후 `http://localhost:3001/api-docs`에서 확인할 수 있습니다.

## 🚀 배포

### Frontend (Vercel)

```bash
cd frontend
npm run build
# Vercel에 배포
```

### Backend (Render)

```bash
cd backend
npm run build
# Render.com에 배포
```

### 배포 링크

- **프론트엔드**: [dot-daily.vercel.app](https://dot-daily.vercel.app)
- **백엔드**: [dot-daily.onrender.com](https://dot-daily.onrender.com)

## 👥 팀 소개

| 이름       | 역할         | GitHub                                         | 주요 기여                                                 |
| ---------- | ------------ | ---------------------------------------------- | --------------------------------------------------------- |
| **민선오** | PM & FE 개발 | [@SunFive](https://github.com/sunfivemin)      | 프로젝트 기획, 디자인 시스템 설계, 나의 하루/보류함 구현  |
| **신우혁** | FE 개발      | [@woo-dev-log](https://github.com/woo-dev-log) | 로그인/회원가입, 회고 캘린더 UI/CRUD, 통계 화면 구현      |
| **한건희** | BE 개발      | [@Hangeony](https://github.com/Hangeony)       | API 설계 및 구축, ERD 설계, Swagger 문서화, 데이터 모델링 |

## 📝 커밋 메시지 컨벤션 (Conventional Commits)

| 타입       | 설명                                                             |
| ---------- | ---------------------------------------------------------------- |
| `feat`     | ✨ 새로운 기능 추가                                              |
| `fix`      | 🐛 버그 수정                                                     |
| `docs`     | 📚 문서 파일 변경 (README, 주석 등)                              |
| `style`    | 💄 코드 스타일 변경 (공백, 세미콜론 등 **로직 변화 없음**)       |
| `refactor` | ♻️ 코드 리팩토링 (기능 변경 없이 구조 개선)                      |
| `test`     | ✅ 테스트 코드 추가/수정                                         |
| `chore`    | 🔧 기타 설정 변경 (빌드 설정, 패키지 관리 등 비즈니스 로직 제외) |

### 예시

```bash
git commit -m "feat: 투두 생성 기능 추가"
git commit -m "fix: 로그인 오류 수정"
git commit -m "docs: API 명세서 수정"
```

## 🔍 아쉬운 점 & 개선 계획

### ❗ 현재 아쉬운 점

- **소셜 로그인 미구현**: 카카오, 구글 로그인 연동 계획이었으나 시간 제약으로 일반 로그인만 구현
- **테스트 코드 부족**: 단위 테스트, 통합 테스트 작성 계획이었으나 수동 테스트 위주로 진행
- **성능 최적화 여지**: 이미지 최적화, 코드 스플리팅 등 추가 개선 가능

### 🔧 개선 계획

- **게스트 모드 개선**: 로그인 없이 기본 기능 체험 가능 (현재 구현됨)
- **카카오, 구글 로그인 연동**: 소셜 로그인 완전 구현
- **PWA 적용**: 오프라인 지원, 푸시 알림 기능
- **성능 최적화**: 이미지 최적화, 코드 스플리팅, 캐싱 전략
- **테스트 코드 작성**: 단위 테스트, 통합 테스트, E2E 테스트

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 개발 가이드라인

- TypeScript 사용 필수
- ESLint 규칙 준수
- 컴포넌트별 Storybook 작성
- 테스트 코드 작성 권장
- Conventional Commits 사용

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 [Issues](https://github.com/sunfivemin/DOT-DAILY/issues)를 통해 연락해주세요.

---

## 🎬 프로젝트 소감

이번 프로젝트를 통해 기술적 구현뿐만 아니라 사용자의 마음을 이해하고 공감하는 서비스를 만드는 것의 중요성을 깨달았습니다.

**"완벽하지 않아도 괜찮다"**는 메시지처럼, 저희 프로젝트도 완벽하지는 않지만 사용자에게 의미 있는 가치를 전달하고자 노력했습니다.

앞으로도 기술과 사람을 연결하는 따뜻한 서비스를 만드는 개발자가 되겠습니다.

---

**DOT-DAILY** - 당신의 하루를 점으로 연결하세요 ✨
