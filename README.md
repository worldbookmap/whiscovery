# Whiscovery

Notion 데이터베이스를 소스로 사용하는 Next.js 웹페이지입니다.

## 기술 스택

- Next.js (App Router)
- Tailwind CSS
- Font Awesome
- Notion API (`@notionhq/client`)

## 시작하기

1. 의존성 설치

```bash
npm install
```

2. 환경 변수 파일 생성

`.env.example`를 참고해서 루트에 `.env.local` 파일을 만들고 값을 채웁니다.

```bash
NOTION_TOKEN=secret_xxx
NOTION_DATABASE_IDS=66f2af0a-9fdd-41c6-b5e2-79f129b78d11,969a1a26-b590-4ebe-940b-f4eae9a73bed,9d95858b-8972-4510-b401-6ad8d795df58,4a43a3f1-7213-41da-852e-97fb848e02b1
```

3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`을 열면 노션 DB 데이터가 카드 형태로 표시됩니다.

## Notion DB 권한 설정

- Notion Integration 생성 후 토큰 발급
- 사용할 데이터베이스에 Integration 연결(Share)
- 데이터베이스 ID를 URL에서 추출해 `NOTION_DATABASE_IDS`에 쉼표로 구분하여 입력

## 기본 매핑 규칙

코드는 아래 속성명을 우선 탐색합니다. 각 데이터베이스는 화면에서 별도 박스로 렌더링됩니다.

- 제목: `Name`, `Title`, `이름`, `제목`
- 지역: `Region`, `지역`, `Country`, `국가`
- 가격: `Price`, `가격`, `Cost`
- 설명: `Description`, `설명`, `Note`

속성명이 다르면 `src/lib/notion.js`에서 매핑 로직을 맞춰주면 됩니다.
