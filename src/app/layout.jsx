import "./globals.css";

export const metadata = {
  title: "Whiscovery",
  description: "Notion DB로 관리하는 위스키 컬렉션",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Grandiflora+One:wght@400&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Kaushan+Script&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <div className="flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
          <footer className="px-4 pb-5 text-center text-xs text-ink/45 sm:px-8">
            제작자: 정진욱
            <p className="mt-2 whitespace-pre-line text-[11px] leading-relaxed text-ink/40">
              {"상단 사진: 임지원님이 글렌캐런잔 붙여둔 커티삭 호(원작: Jack Spurling, 1870 ~ 1928)\n배경 사진: 위스커버리의 고향, 팝콘 하우스의 바깥 바"}
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
