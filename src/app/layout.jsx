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
          </footer>
        </div>
      </body>
    </html>
  );
}
