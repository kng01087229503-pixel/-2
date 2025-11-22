# 커피 주문 앱

## 1. 프로젝트 개요

### 1.1 프로젝트명
커피주문 앱

### 1.2 프로젝트목적
사용자가 커피 메뉴를 주문하고, 관리자가 주문을 관리할 수 있는 간단한 풀스택 웹 앱

### 1.3 개발 범위
- 주문하기 화면(메뉴선택 및 장바구니 기능)
- 관리자화면(재고관리 및 주문상태 관리)
- 데이터를 생성/조회/수정/삭제할 수 있는 기능

## 2. 기술스택
- 프런트엔드: HTML, CSS, 리액트, 자바스크립트
- 백엔드: Node.js, Express
- 데이터베이스: PostgreSQL

## 3. 기본사항
- 프런트엔드와 백엔드를 따로 개발
- 기본적인 웹 기술만 사용
- 학습목적이므로 사용자 인증이나 결제 기능은 제외
- 메뉴는 커피 메뉴만 있음

## 4. 주문하기 화면 PRD

### 4.1 화면 개요
사용자가 커피 메뉴를 선택하고 장바구니에 담아 주문할 수 있는 메인 화면입니다.

### 4.2 화면 구성 요소

#### 4.2.1 헤더 영역
- **위치**: 화면 최상단
- **구성 요소**:
  - 좌측: "COZY" 브랜드 로고 (다크 그린 배경, 흰색 텍스트)
  - 우측: 네비게이션 버튼
    - "주문하기" 버튼 (현재 화면)
    - "관리자" 버튼 (관리자 화면으로 이동)

#### 4.2.2 메뉴 아이템 섹션
- **위치**: 헤더 아래, 화면 중앙 영역
- **레이아웃**: 메뉴 카드들이 가로로 배치 (그리드 레이아웃)
- **메뉴 카드 구성 요소**:
  1. **메뉴 이미지**
     - 상단에 위치
     - 이미지가 없는 경우 플레이스홀더 표시
  2. **메뉴명**
     - 이미지 아래에 표시
     - 예: "아메리카노(ICE)", "아메리카노(HOT)", "카페라떼"
  3. **가격**
     - 메뉴명 아래에 표시
     - 형식: "X,XXX원"
  4. **설명**
     - 가격 아래에 표시
     - 예: "간단한 설명..."
  5. **옵션 선택**
     - 체크박스 형태로 제공
     - 옵션 예시:
       - "샷 추가 (+500원)"
       - "시럽 추가 (+0원)"
     - 각 옵션 선택 시 가격에 반영
  6. **담기 버튼**
     - 카드 하단에 위치
     - 회색 배경의 "담기" 버튼
     - 클릭 시 선택한 옵션과 함께 장바구니에 추가

#### 4.2.3 장바구니 섹션
- **위치**: 화면 하단
- **구성 요소**:
  1. **제목**: "장바구니"
  2. **장바구니 아이템 목록**
     - 각 아이템 표시 형식: "메뉴명 (옵션) X 수량"
     - 각 아이템 옆에 개별 가격 표시
     - 예: "아메리카노(ICE) (샷 추가) X 1 - 4,500원"
     - 예: "아메리카노(HOT) X 2 - 8,000원"
  3. **총 금액**
     - 우측에 "총 금액" 라벨과 함께 표시
     - 금액은 굵은 글씨로 강조
     - 형식: "총 금액: XX,XXX원"
  4. **주문하기 버튼**
     - 총 금액 아래에 위치
     - 회색 배경의 "주문하기" 버튼
     - 클릭 시 주문 처리

### 4.3 기능 요구사항

#### 4.3.1 메뉴 표시 기능
- 서버에서 메뉴 목록을 조회하여 화면에 표시
- 각 메뉴는 카드 형태로 표시
- 메뉴 정보: 메뉴명, 가격, 설명, 이미지, 옵션 목록

#### 4.3.2 옵션 선택 기능
- 각 메뉴 카드에서 옵션을 체크박스로 선택 가능
- 옵션 선택 시 추가 가격이 실시간으로 반영되어 표시
- 여러 옵션 동시 선택 가능

#### 4.3.3 장바구니 담기 기능
- "담기" 버튼 클릭 시:
  - 선택한 메뉴와 옵션 정보를 장바구니에 추가
  - 동일한 메뉴+옵션 조합이 이미 있으면 수량 증가
  - 장바구니에 추가된 아이템을 하단 장바구니 섹션에 표시

#### 4.3.4 장바구니 관리 기능
- 장바구니에 담긴 아이템 목록 표시
- 각 아이템의 수량 표시
- 각 아이템의 개별 가격 계산 및 표시
  - 기본 가격 + 선택한 옵션 가격의 합계
- 총 금액 자동 계산 및 표시
- 장바구니 아이템 삭제 기능 (선택사항)

#### 4.3.5 주문하기 기능
- "주문하기" 버튼 클릭 시:
  - 장바구니에 담긴 모든 아이템을 주문으로 전송
  - 주문 데이터를 서버에 저장
  - 주문 완료 후 장바구니 초기화
  - 주문 완료 메시지 표시 (선택사항)

### 4.4 UI/UX 요구사항

#### 4.4.1 디자인
- 깔끔하고 미니멀한 디자인
- 흰색 배경에 다크 그레이 텍스트
- 브랜드 컬러: 다크 그린 (COZY 로고)
- 버튼: 회색 배경

#### 4.4.2 레이아웃
- 반응형 디자인 고려 (선택사항)
- 메뉴 카드는 가로 스크롤 또는 그리드 레이아웃
- 장바구니는 화면 하단에 고정 또는 스크롤 가능

#### 4.4.3 사용자 경험
- 옵션 선택 시 가격 변화를 명확히 표시
- 장바구니에 추가 시 시각적 피드백 제공 (선택사항)
- 총 금액이 항상 명확하게 표시
- 버튼 클릭 시 적절한 피드백 제공

### 4.5 데이터 요구사항

#### 4.5.1 메뉴 데이터 구조
```javascript
{
  id: number,
  name: string,           // 예: "아메리카노(ICE)"
  price: number,          // 기본 가격 (원)
  description: string,    // 메뉴 설명
  image: string,          // 이미지 URL (선택사항)
  options: [              // 옵션 목록
    {
      id: number,
      name: string,       // 예: "샷 추가"
      price: number       // 추가 가격 (원)
    }
  ]
}
```

#### 4.5.2 장바구니 아이템 데이터 구조
```javascript
{
  menuId: number,
  menuName: string,
  basePrice: number,
  selectedOptions: [      // 선택한 옵션 목록
    {
      optionId: number,
      optionName: string,
      optionPrice: number
    }
  ],
  quantity: number,       // 수량
  totalPrice: number      // (기본가격 + 옵션가격) * 수량
}
```

#### 4.5.3 주문 데이터 구조
```javascript
{
  items: [                // 장바구니 아이템 배열
    {
      menuId: number,
      menuName: string,
      options: [string],  // 선택한 옵션명 배열
      quantity: number,
      price: number
    }
  ],
  totalAmount: number,    // 총 주문 금액
  orderDate: Date         // 주문 일시
}
```

### 4.6 API 요구사항

#### 4.6.1 메뉴 조회
- **엔드포인트**: `GET /api/menus`
- **응답**: 메뉴 목록 배열

#### 4.6.2 주문 생성
- **엔드포인트**: `POST /api/orders`
- **요청 본문**: 주문 데이터 구조
- **응답**: 생성된 주문 정보

### 4.7 예외 처리
- 장바구니가 비어있을 때 주문하기 버튼 비활성화 (선택사항)
- 메뉴 로딩 실패 시 에러 메시지 표시
- 주문 전송 실패 시 에러 메시지 표시 및 재시도 옵션 제공

## 5. 관리자 화면 PRD

### 5.1 화면 개요
관리자가 주문 현황을 모니터링하고, 재고를 관리하며, 주문 상태를 변경할 수 있는 관리자 전용 화면입니다.

### 5.2 화면 구성 요소

#### 5.2.1 헤더 영역
- **위치**: 화면 최상단
- **구성 요소**:
  - 좌측: "COZY" 브랜드 로고 (검은색 테두리)
  - 우측: 네비게이션 버튼
    - "주문하기" 버튼 (주문하기 화면으로 이동)
    - "관리자" 버튼 (현재 화면, 활성 상태 표시 - 검은색 테두리 강조)

#### 5.2.2 관리자 대시보드 섹션
- **위치**: 헤더 아래, 화면 상단 영역
- **제목**: "관리자 대시보드"
- **구성 요소**: 주문 통계 정보
  - **총 주문**: 전체 주문 건수
  - **주문 접수**: 접수된 주문 건수
  - **제조 중**: 현재 제조 중인 주문 건수
  - **제조 완료**: 제조가 완료된 주문 건수
  - **표시 형식**: "총 주문 X / 주문 접수 X / 제조 중 X / 제조 완료 X"
  - **예시**: "총 주문 1 / 주문 접수 1 / 제조 중 0 / 제조 완료 0"

#### 5.2.3 재고 현황 섹션
- **위치**: 대시보드 아래, 화면 중앙 영역
- **제목**: "재고 현황"
- **레이아웃**: 재고 카드들이 가로로 배치 (그리드 레이아웃)
- **재고 카드 구성 요소**:
  1. **메뉴명**
     - 카드 상단에 표시
     - 예: "아메리카노 (ICE)", "아메리카노 (HOT)", "카페라떼"
  2. **재고 수량**
     - 메뉴명 아래에 표시
     - 형식: "X개"
     - 예: "10개"
  3. **재고 조정 버튼**
     - 수량 아래에 위치
     - "+" 버튼: 재고 증가
     - "-" 버튼: 재고 감소
     - 각 버튼 클릭 시 재고 수량이 1씩 증감

#### 5.2.4 주문 현황 섹션
- **위치**: 재고 현황 아래, 화면 하단 영역
- **제목**: "주문 현황"
- **구성 요소**: 주문 목록
  - **주문 카드 구성 요소**:
    1. **주문 일시**
       - 카드 상단에 표시
       - 형식: "X월 X일 XX:XX"
       - 예: "7월 31일 13:00"
    2. **주문 아이템 정보**
       - 주문 일시 아래에 표시
       - 형식: "메뉴명 X 수량"
       - 예: "아메리카노(ICE) x 1"
    3. **주문 금액**
       - 아이템 정보 아래에 표시
       - 형식: "X,XXX원"
       - 예: "4,000원"
    4. **주문 상태 변경 버튼**
       - 카드 하단에 위치
       - 주문 상태에 따라 다른 버튼 표시:
         - "주문 접수" 버튼: 신규 주문을 접수할 때
         - "제조 시작" 버튼: 제조를 시작할 때
         - "제조 완료" 버튼: 제조를 완료할 때
       - 버튼 클릭 시 주문 상태가 다음 단계로 변경

### 5.3 기능 요구사항

#### 5.3.1 대시보드 통계 표시 기능
- 서버에서 주문 통계를 조회하여 실시간으로 표시
- 각 주문 상태별 건수를 집계하여 표시
- 주문 상태 변경 시 통계 자동 업데이트

#### 5.3.2 재고 조회 기능
- 서버에서 각 메뉴별 재고 수량을 조회하여 표시
- 재고 카드 형태로 각 메뉴의 재고 정보 표시

#### 5.3.3 재고 수정 기능
- "+" 버튼 클릭 시:
  - 해당 메뉴의 재고 수량이 1 증가
  - 변경된 재고 수량을 서버에 저장
  - 화면에 변경된 수량 즉시 반영
- "-" 버튼 클릭 시:
  - 해당 메뉴의 재고 수량이 1 감소
  - 재고가 0 이하로 내려가지 않도록 제한 (선택사항)
  - 변경된 재고 수량을 서버에 저장
  - 화면에 변경된 수량 즉시 반영

#### 5.3.4 주문 목록 조회 기능
- 서버에서 주문 목록을 조회하여 표시
- 주문은 최신순으로 정렬하여 표시
- 각 주문의 상태에 따라 다른 버튼 표시

#### 5.3.5 주문 상태 변경 기능
- **주문 접수**:
  - "주문 접수" 버튼 클릭 시 주문 상태를 "접수됨"으로 변경
  - 대시보드의 "주문 접수" 통계 증가
- **제조 시작**:
  - "제조 시작" 버튼 클릭 시 주문 상태를 "제조 중"으로 변경
  - 대시보드의 "제조 중" 통계 증가, "주문 접수" 통계 감소
- **제조 완료**:
  - "제조 완료" 버튼 클릭 시 주문 상태를 "완료"로 변경
  - 대시보드의 "제조 완료" 통계 증가, "제조 중" 통계 감소
  - 해당 메뉴의 재고 수량 자동 감소 (선택사항)

#### 5.3.6 실시간 업데이트 기능 (선택사항)
- 주문이 새로 들어오면 자동으로 주문 목록에 추가
- 주문 상태 변경 시 대시보드 통계 자동 업데이트
- 재고 변경 시 재고 현황 자동 업데이트

### 5.4 UI/UX 요구사항

#### 5.4.1 디자인
- 깔끔하고 미니멀한 디자인
- 흰색 배경에 연한 회색 테두리로 섹션 구분
- 검은색 테두리로 활성 버튼 강조
- 각 섹션은 둥근 모서리로 구분

#### 5.4.2 레이아웃
- 섹션별로 명확하게 구분
- 재고 카드는 가로 스크롤 또는 그리드 레이아웃
- 주문 목록은 세로 스크롤 가능
- 대시보드 통계는 한 줄에 가로로 배치

#### 5.4.3 사용자 경험
- 주문 상태 변경 시 시각적 피드백 제공
- 재고 수정 시 변경된 수량이 즉시 반영되어 표시
- 버튼 클릭 시 적절한 피드백 제공
- 주문이 없을 때 적절한 안내 메시지 표시 (선택사항)

### 5.5 데이터 요구사항

#### 5.5.1 주문 통계 데이터 구조
```javascript
{
  total: number,          // 총 주문 건수
  received: number,       // 주문 접수 건수
  inProgress: number,     // 제조 중 건수
  completed: number       // 제조 완료 건수
}
```

#### 5.5.2 재고 데이터 구조
```javascript
{
  menuId: number,
  menuName: string,       // 예: "아메리카노 (ICE)"
  stock: number           // 재고 수량
}
```

#### 5.5.3 주문 데이터 구조 (관리자 화면용)
```javascript
{
  id: number,
  orderDate: Date,        // 주문 일시
  items: [                // 주문 아이템 배열
    {
      menuId: number,
      menuName: string,
      quantity: number,
      price: number
    }
  ],
  totalAmount: number,    // 총 주문 금액
  status: string          // 주문 상태: "pending", "received", "inProgress", "completed"
}
```

### 5.6 API 요구사항

#### 5.6.1 주문 통계 조회
- **엔드포인트**: `GET /api/orders/statistics`
- **응답**: 주문 통계 데이터 구조

#### 5.6.2 재고 목록 조회
- **엔드포인트**: `GET /api/inventory`
- **응답**: 재고 데이터 배열

#### 5.6.3 재고 수정
- **엔드포인트**: `PUT /api/inventory/:menuId`
- **요청 본문**: 
  ```javascript
  {
    stock: number  // 변경할 재고 수량
  }
  ```
- **응답**: 수정된 재고 정보

#### 5.6.4 주문 목록 조회
- **엔드포인트**: `GET /api/orders`
- **쿼리 파라미터** (선택사항):
  - `status`: 주문 상태 필터링
- **응답**: 주문 데이터 배열

#### 5.6.5 주문 상태 변경
- **엔드포인트**: `PUT /api/orders/:orderId/status`
- **요청 본문**:
  ```javascript
  {
    status: string  // "received", "inProgress", "completed"
  }
  ```
- **응답**: 업데이트된 주문 정보

### 5.7 예외 처리
- 재고가 0일 때 "-" 버튼 비활성화 또는 에러 메시지 표시 (선택사항)
- 주문 통계 조회 실패 시 에러 메시지 표시
- 재고 수정 실패 시 에러 메시지 표시 및 원래 값으로 복구
- 주문 상태 변경 실패 시 에러 메시지 표시 및 재시도 옵션 제공
- 주문 목록이 비어있을 때 적절한 안내 메시지 표시 (선택사항)

## 6. 백엔드 개발 PRD

### 6.1 데이터 모델

#### 6.1.1 Menus (메뉴)
메뉴 정보를 저장하는 테이블입니다.

**필드:**
- `id` (number, Primary Key): 메뉴 고유 ID
- `name` (string): 커피 이름 (예: "아메리카노(ICE)", "카페라떼")
- `description` (string): 메뉴 설명
- `price` (number): 기본 가격 (원 단위)
- `image` (string, nullable): 이미지 URL (선택사항)
- `stock` (number): 재고 수량
- `createdAt` (Date): 생성 일시
- `updatedAt` (Date): 수정 일시

**예시 데이터:**
```javascript
{
  id: 1,
  name: "아메리카노(ICE)",
  description: "시원하고 깔끔한 아이스 아메리카노",
  price: 4000,
  image: null,
  stock: 10,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z"
}
```

#### 6.1.2 Options (옵션)
메뉴에 추가할 수 있는 옵션 정보를 저장하는 테이블입니다.

**필드:**
- `id` (number, Primary Key): 옵션 고유 ID
- `name` (string): 옵션 이름 (예: "샷 추가", "시럽 추가")
- `price` (number): 옵션 가격 (원 단위, 0 이상)
- `menuId` (number, Foreign Key): 연결할 메뉴 ID (Menus 테이블 참조)
- `createdAt` (Date): 생성 일시
- `updatedAt` (Date): 수정 일시

**예시 데이터:**
```javascript
{
  id: 1,
  name: "샷 추가",
  price: 500,
  menuId: 1,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z"
}
```

#### 6.1.3 Orders (주문)
주문 정보를 저장하는 테이블입니다.

**필드:**
- `id` (number, Primary Key): 주문 고유 ID
- `orderDate` (Date): 주문 일시
- `totalAmount` (number): 총 주문 금액 (원 단위)
- `status` (string): 주문 상태
  - `"pending"`: 주문 접수 대기 (기본값)
  - `"received"`: 주문 접수
  - `"inProgress"`: 제조 중
  - `"completed"`: 제조 완료
- `createdAt` (Date): 생성 일시
- `updatedAt` (Date): 수정 일시

**예시 데이터:**
```javascript
{
  id: 1,
  orderDate: "2024-01-15T13:30:00Z",
  totalAmount: 9000,
  status: "pending",
  createdAt: "2024-01-15T13:30:00Z",
  updatedAt: "2024-01-15T13:30:00Z"
}
```

#### 6.1.4 OrderItems (주문 아이템)
주문에 포함된 메뉴와 옵션 정보를 저장하는 테이블입니다.

**필드:**
- `id` (number, Primary Key): 주문 아이템 고유 ID
- `orderId` (number, Foreign Key): 주문 ID (Orders 테이블 참조)
- `menuId` (number, Foreign Key): 메뉴 ID (Menus 테이블 참조)
- `menuName` (string): 메뉴 이름 (주문 시점의 메뉴명 저장)
- `quantity` (number): 주문 수량
- `price` (number): 아이템 단가 (기본 가격 + 옵션 가격)
- `totalPrice` (number): 아이템 총 가격 (단가 × 수량)
- `createdAt` (Date): 생성 일시

**예시 데이터:**
```javascript
{
  id: 1,
  orderId: 1,
  menuId: 1,
  menuName: "아메리카노(ICE)",
  quantity: 2,
  price: 4500,
  totalPrice: 9000,
  createdAt: "2024-01-15T13:30:00Z"
}
```

#### 6.1.5 OrderItemOptions (주문 아이템 옵션)
주문 아이템에 선택된 옵션 정보를 저장하는 테이블입니다.

**필드:**
- `id` (number, Primary Key): 주문 아이템 옵션 고유 ID
- `orderItemId` (number, Foreign Key): 주문 아이템 ID (OrderItems 테이블 참조)
- `optionId` (number, Foreign Key): 옵션 ID (Options 테이블 참조)
- `optionName` (string): 옵션 이름 (주문 시점의 옵션명 저장)
- `optionPrice` (number): 옵션 가격 (주문 시점의 옵션 가격 저장)
- `createdAt` (Date): 생성 일시

**예시 데이터:**
```javascript
{
  id: 1,
  orderItemId: 1,
  optionId: 1,
  optionName: "샷 추가",
  optionPrice: 500,
  createdAt: "2024-01-15T13:30:00Z"
}
```

### 6.2 데이터 스키마를 위한 사용자 흐름

#### 6.2.1 메뉴 조회 및 표시
1. **프론트엔드**: 사용자가 '주문하기' 화면에 접속
2. **백엔드**: `GET /api/menus` API 호출
3. **데이터베이스**: Menus 테이블에서 모든 메뉴 정보 조회
   - Options 테이블과 JOIN하여 각 메뉴의 옵션 목록도 함께 조회
4. **백엔드**: 조회된 메뉴 정보를 프론트엔드에 반환
   - **중요**: 재고 수량(`stock`)은 관리자 화면에서만 표시되므로, 일반 사용자용 API 응답에서는 제외하거나 별도 엔드포인트로 제공
5. **프론트엔드**: 받은 메뉴 정보를 화면에 표시
   - 메뉴명, 설명, 가격, 이미지, 옵션 목록 표시

#### 6.2.2 장바구니 관리 (프론트엔드 로컬 상태)
1. **프론트엔드**: 사용자가 메뉴 카드에서 옵션을 선택하고 "담기" 버튼 클릭
2. **프론트엔드**: 선택한 메뉴와 옵션 정보를 로컬 상태(장바구니)에 저장
   - 동일한 메뉴+옵션 조합이 이미 있으면 수량 증가
3. **프론트엔드**: 장바구니 섹션에 선택한 아이템 목록 표시
   - 각 아이템의 메뉴명, 옵션, 수량, 가격 표시
   - 총 금액 계산 및 표시

#### 6.2.3 주문 생성
1. **프론트엔드**: 사용자가 장바구니에서 "주문하기" 버튼 클릭
2. **프론트엔드**: 주문 데이터 구성
   - 주문 일시: 현재 시간
   - 주문 아이템: 장바구니의 모든 아이템
   - 각 아이템의 메뉴 ID, 메뉴명, 수량, 선택한 옵션, 가격
   - 총 주문 금액
3. **백엔드**: `POST /api/orders` API 호출
4. **데이터베이스**: 
   - Orders 테이블에 주문 정보 저장 (status: "pending")
   - OrderItems 테이블에 주문 아이템 정보 저장
   - OrderItemOptions 테이블에 각 아이템의 옵션 정보 저장
5. **백엔드**: 생성된 주문 정보를 프론트엔드에 반환
6. **프론트엔드**: 주문 완료 메시지 표시 및 장바구니 초기화

#### 6.2.4 주문 현황 조회 및 상태 변경
1. **프론트엔드**: 관리자가 '관리자' 화면의 '주문 현황' 섹션 접근
2. **백엔드**: `GET /api/orders` API 호출
3. **데이터베이스**: Orders 테이블에서 모든 주문 정보 조회
   - OrderItems 테이블과 JOIN하여 주문 아이템 정보 조회
   - OrderItemOptions 테이블과 JOIN하여 각 아이템의 옵션 정보 조회
   - 주문 일시 기준 내림차순 정렬 (최신 주문 먼저)
4. **백엔드**: 조회된 주문 정보를 프론트엔드에 반환
5. **프론트엔드**: 주문 목록을 화면에 표시
   - 주문 일시, 주문 아이템(메뉴명, 수량, 옵션), 주문 금액 표시
   - 주문 상태에 따라 버튼 표시:
     - `"pending"` → "주문 접수" 버튼
     - `"received"` → "제조 시작" 버튼
     - `"inProgress"` → "제조 완료" 버튼
     - `"completed"` → "완료됨" 텍스트 표시
6. **프론트엔드**: 관리자가 상태 변경 버튼 클릭
7. **백엔드**: `PUT /api/orders/:orderId/status` API 호출
8. **데이터베이스**: Orders 테이블에서 해당 주문의 status 필드 업데이트
   - "주문 접수" 클릭: `"pending"` → `"received"`
   - "제조 시작" 클릭: `"received"` → `"inProgress"`
   - "제조 완료" 클릭: `"inProgress"` → `"completed"`
9. **백엔드**: 업데이트된 주문 정보를 프론트엔드에 반환
10. **프론트엔드**: 주문 목록 및 대시보드 통계 업데이트

### 6.3 API 설계

#### 6.3.1 메뉴 목록 조회
**엔드포인트**: `GET /api/menus`

**설명**: 데이터베이스에서 커피 메뉴 목록을 불러와서 반환합니다.

**요청:**
- 쿼리 파라미터: 없음

**응답:**
- **성공 (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "name": "아메리카노(ICE)",
      "description": "시원하고 깔끔한 아이스 아메리카노",
      "price": 4000,
      "image": null,
      "options": [
        {
          "id": 1,
          "name": "샷 추가",
          "price": 500
        },
        {
          "id": 2,
          "name": "시럽 추가",
          "price": 0
        }
      ]
    },
    {
      "id": 2,
      "name": "카페라떼",
      "description": "부드러운 우유와 에스프레소의 조화",
      "price": 5000,
      "image": null,
      "options": [
        {
          "id": 3,
          "name": "샷 추가",
          "price": 500
        }
      ]
    }
  ]
  ```
- **에러 (500 Internal Server Error)**:
  ```json
  {
    "error": "메뉴 목록을 불러오는 중 오류가 발생했습니다."
  }
  ```

#### 6.3.2 주문 생성
**엔드포인트**: `POST /api/orders`

**설명**: 사용자가 주문하기 버튼을 누르면 주문 정보를 데이터베이스에 저장합니다.

**요청 본문:**
```json
{
  "items": [
    {
      "menuId": 1,
      "menuName": "아메리카노(ICE)",
      "quantity": 2,
      "options": [
        {
          "optionId": 1,
          "optionName": "샷 추가",
          "optionPrice": 500
        }
      ],
      "price": 4500,
      "totalPrice": 9000
    }
  ],
  "totalAmount": 9000
}
```

**응답:**
- **성공 (201 Created)**:
  ```json
  {
    "id": 1,
    "orderDate": "2024-01-15T13:30:00Z",
    "totalAmount": 9000,
    "status": "pending",
    "items": [
      {
        "id": 1,
        "menuId": 1,
        "menuName": "아메리카노(ICE)",
        "quantity": 2,
        "price": 4500,
        "totalPrice": 9000,
        "options": [
          {
            "id": 1,
            "optionId": 1,
            "optionName": "샷 추가",
            "optionPrice": 500
          }
        ]
      }
    ]
  }
  ```
- **에러 (400 Bad Request)**: 요청 데이터 유효성 검사 실패
  ```json
  {
    "error": "주문 정보가 올바르지 않습니다."
  }
  ```
- **에러 (500 Internal Server Error)**: 서버 오류
  ```json
  {
    "error": "주문 저장 중 오류가 발생했습니다."
  }
  ```

#### 6.3.3 주문 목록 조회
**엔드포인트**: `GET /api/orders`

**설명**: 주문 정보에 따라 메뉴 목록의 재고도 함께 보여줍니다. 관리자 화면의 '주문 현황'에 표시됩니다.

**요청:**
- 쿼리 파라미터 (선택사항):
  - `status` (string): 주문 상태로 필터링 (예: "pending", "received", "inProgress", "completed")

**응답:**
- **성공 (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "orderDate": "2024-01-15T13:30:00Z",
      "totalAmount": 9000,
      "status": "pending",
      "items": [
        {
          "id": 1,
          "menuId": 1,
          "menuName": "아메리카노(ICE)",
          "quantity": 2,
          "price": 4500,
          "totalPrice": 9000,
          "options": [
            {
              "optionName": "샷 추가"
            }
          ]
        }
      ]
    }
  ]
  ```
- **에러 (500 Internal Server Error)**:
  ```json
  {
    "error": "주문 목록을 불러오는 중 오류가 발생했습니다."
  }
  ```

#### 6.3.4 주문 상세 조회
**엔드포인트**: `GET /api/orders/:orderId`

**설명**: 주문 ID를 전달하면 해당 주문 정보를 반환합니다.

**요청:**
- 경로 파라미터:
  - `orderId` (number): 조회할 주문 ID

**응답:**
- **성공 (200 OK)**:
  ```json
  {
    "id": 1,
    "orderDate": "2024-01-15T13:30:00Z",
    "totalAmount": 9000,
    "status": "pending",
    "items": [
      {
        "id": 1,
        "menuId": 1,
        "menuName": "아메리카노(ICE)",
        "quantity": 2,
        "price": 4500,
        "totalPrice": 9000,
        "options": [
          {
            "optionName": "샷 추가"
          }
        ]
      }
    ]
  }
  ```
- **에러 (404 Not Found)**: 주문을 찾을 수 없음
  ```json
  {
    "error": "주문을 찾을 수 없습니다."
  }
  ```
- **에러 (500 Internal Server Error)**:
  ```json
  {
    "error": "주문 정보를 불러오는 중 오류가 발생했습니다."
  }
  ```

#### 6.3.5 주문 상태 변경
**엔드포인트**: `PUT /api/orders/:orderId/status`

**설명**: 주문 상태를 변경합니다. (관리자 화면에서 사용)

**요청:**
- 경로 파라미터:
  - `orderId` (number): 상태를 변경할 주문 ID
- 요청 본문:
  ```json
  {
    "status": "received"
  }
  ```
  - `status` 값: `"received"`, `"inProgress"`, `"completed"`

**응답:**
- **성공 (200 OK)**:
  ```json
  {
    "id": 1,
    "orderDate": "2024-01-15T13:30:00Z",
    "totalAmount": 9000,
    "status": "received",
    "items": [...]
  }
  ```
- **에러 (400 Bad Request)**: 잘못된 상태 값
  ```json
  {
    "error": "올바르지 않은 주문 상태입니다."
  }
  ```
- **에러 (404 Not Found)**: 주문을 찾을 수 없음
- **에러 (500 Internal Server Error)**: 서버 오류

#### 6.3.6 재고 목록 조회
**엔드포인트**: `GET /api/inventory`

**설명**: 관리자 화면에서 메뉴별 재고 수량을 조회합니다.

**요청:**
- 쿼리 파라미터: 없음

**응답:**
- **성공 (200 OK)**:
  ```json
  [
    {
      "menuId": 1,
      "menuName": "아메리카노(ICE)",
      "stock": 10
    },
    {
      "menuId": 2,
      "menuName": "카페라떼",
      "stock": 5
    }
  ]
  ```
- **에러 (500 Internal Server Error)**:
  ```json
  {
    "error": "재고 정보를 불러오는 중 오류가 발생했습니다."
  }
  ```

#### 6.3.7 재고 수정
**엔드포인트**: `PUT /api/inventory/:menuId`

**설명**: 관리자가 메뉴의 재고 수량을 수정합니다.

**요청:**
- 경로 파라미터:
  - `menuId` (number): 재고를 수정할 메뉴 ID
- 요청 본문:
  ```json
  {
    "stock": 15
  }
  ```

**응답:**
- **성공 (200 OK)**:
  ```json
  {
    "menuId": 1,
    "menuName": "아메리카노(ICE)",
    "stock": 15
  }
  ```
- **에러 (400 Bad Request)**: 재고 수량이 음수인 경우
  ```json
  {
    "error": "재고 수량은 0 이상이어야 합니다."
  }
  ```
- **에러 (404 Not Found)**: 메뉴를 찾을 수 없음
- **에러 (500 Internal Server Error)**: 서버 오류

#### 6.3.8 주문 통계 조회
**엔드포인트**: `GET /api/orders/statistics`

**설명**: 관리자 대시보드에 표시할 주문 통계를 조회합니다.

**요청:**
- 쿼리 파라미터: 없음

**응답:**
- **성공 (200 OK)**:
  ```json
  {
    "total": 10,
    "received": 3,
    "inProgress": 2,
    "completed": 5
  }
  ```
  - `total`: 전체 주문 건수
  - `received`: 주문 접수 건수 (status가 "received" 또는 "pending"인 주문)
  - `inProgress`: 제조 중 건수 (status가 "inProgress"인 주문)
  - `completed`: 제조 완료 건수 (status가 "completed"인 주문)
- **에러 (500 Internal Server Error)**:
  ```json
  {
    "error": "주문 통계를 불러오는 중 오류가 발생했습니다."
  }
  ```

### 6.4 데이터베이스 스키마 설계

#### 6.4.1 테이블 관계도
```
Menus (1) ──< (N) Options
  │
  │ (1)
  │
  └──< (N) OrderItems ──< (N) OrderItemOptions
        │
        │ (N)
        │
        └──> (1) Orders
```

#### 6.4.2 데이터베이스 제약 조건
- **Menus 테이블**:
  - `id`: Primary Key, Auto Increment
  - `name`: NOT NULL, UNIQUE
  - `price`: NOT NULL, >= 0
  - `stock`: NOT NULL, >= 0

- **Options 테이블**:
  - `id`: Primary Key, Auto Increment
  - `menuId`: Foreign Key (Menus.id), NOT NULL, ON DELETE CASCADE
  - `name`: NOT NULL
  - `price`: NOT NULL, >= 0

- **Orders 테이블**:
  - `id`: Primary Key, Auto Increment
  - `orderDate`: NOT NULL
  - `totalAmount`: NOT NULL, >= 0
  - `status`: NOT NULL, ENUM('pending', 'received', 'inProgress', 'completed')

- **OrderItems 테이블**:
  - `id`: Primary Key, Auto Increment
  - `orderId`: Foreign Key (Orders.id), NOT NULL, ON DELETE CASCADE
  - `menuId`: Foreign Key (Menus.id), NOT NULL
  - `quantity`: NOT NULL, > 0
  - `price`: NOT NULL, >= 0
  - `totalPrice`: NOT NULL, >= 0

- **OrderItemOptions 테이블**:
  - `id`: Primary Key, Auto Increment
  - `orderItemId`: Foreign Key (OrderItems.id), NOT NULL, ON DELETE CASCADE
  - `optionId`: Foreign Key (Options.id), NOT NULL
  - `optionPrice`: NOT NULL, >= 0

### 6.5 에러 처리 및 유효성 검사

#### 6.5.1 공통 에러 응답 형식
```json
{
  "error": "에러 메시지",
  "code": "ERROR_CODE" // 선택사항
}
```

#### 6.5.2 주요 유효성 검사
- **주문 생성 시**:
  - `items` 배열이 비어있지 않아야 함
  - 각 아이템의 `menuId`가 존재하는 메뉴 ID여야 함
  - 각 아이템의 `quantity`가 1 이상이어야 함
  - `totalAmount`가 실제 계산된 총액과 일치해야 함

- **주문 상태 변경 시**:
  - 상태 전이는 순차적으로만 가능 (pending → received → inProgress → completed)
  - 이미 완료된 주문은 상태 변경 불가

- **재고 수정 시**:
  - `stock` 값이 0 이상이어야 함
  - `menuId`가 존재하는 메뉴 ID여야 함

### 6.6 성능 고려사항
- 메뉴 목록 조회 시 Options 테이블과 JOIN하여 한 번의 쿼리로 처리
- 주문 목록 조회 시 필요한 테이블들을 효율적으로 JOIN
- 인덱스 설정:
  - `Menus.name`: UNIQUE 인덱스
  - `Options.menuId`: 인덱스
  - `Orders.orderDate`: 인덱스 (정렬 최적화)
  - `Orders.status`: 인덱스 (필터링 최적화)
  - `OrderItems.orderId`: 인덱스
  - `OrderItems.menuId`: 인덱스  