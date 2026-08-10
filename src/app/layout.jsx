import { Fraunces, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
});

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
      </head>
      <body className={`${fraunces.variable} ${notoSansKr.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
