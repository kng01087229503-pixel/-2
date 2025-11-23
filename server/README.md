# Coffee Order App - Backend Server

커피 주문 앱의 백엔드 서버입니다. Express.js를 사용하여 RESTful API를 제공합니다.

## 기술 스택

- **Node.js**: JavaScript 런타임
- **Express.js**: 웹 프레임워크
- **CORS**: Cross-Origin Resource Sharing 지원
- **dotenv**: 환경 변수 관리

## 설치 방법

1. 의존성 설치:
```bash
npm install
```

2. 환경 변수 설정:
```bash
cp .env.example .env
```

3. `.env` 파일을 열어 필요한 설정을 수정합니다.

## 실행 방법

### 개발 모드 (자동 재시작)
```bash
npm run dev
```

### 프로덕션 모드
```bash
npm start
```

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## API 엔드포인트

### 기본 엔드포인트
- `GET /`: 서버 정보 확인
- `GET /health`: 서버 상태 확인

### 메뉴 관련 (추후 구현)
- `GET /api/menus`: 메뉴 목록 조회

### 주문 관련 (추후 구현)
- `GET /api/orders`: 주문 목록 조회
- `GET /api/orders/:orderId`: 주문 상세 조회
- `POST /api/orders`: 주문 생성
- `PUT /api/orders/:orderId/status`: 주문 상태 변경
- `GET /api/orders/statistics`: 주문 통계 조회

### 재고 관련 (추후 구현)
- `GET /api/inventory`: 재고 목록 조회
- `PUT /api/inventory/:menuId`: 재고 수정

## 프로젝트 구조

```
server/
├── server.js          # 메인 서버 파일
├── package.json       # 프로젝트 설정 및 의존성
├── .env.example       # 환경 변수 예시 파일
├── .gitignore         # Git 제외 파일 목록
└── README.md          # 프로젝트 문서
```

## 개발 가이드

자세한 API 명세는 `docs/PRD.md` 파일의 "6. 백엔드 개발 PRD" 섹션을 참고하세요.


