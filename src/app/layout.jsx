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
      <body className={`${fraunces.variable} ${notoSansKr.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
