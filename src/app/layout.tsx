import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TurboQuant 한국어 보고서",
    template: "%s | TurboQuant 한국어 보고서",
  },
  description:
    "TurboQuant, QJL, PolarQuant 논문 3편과 Google Research 블로그를 바탕으로 KV 캐시 압축 기술을 한국어로 설명한 단일 페이지 리포트.",
  keywords: [
    "TurboQuant",
    "QJL",
    "PolarQuant",
    "KV Cache",
    "LLM Quantization",
    "Vector Quantization",
  ],
  openGraph: {
    title: "TurboQuant 한국어 보고서",
    description:
      "Google Research 계열 KV 캐시 압축 기술을 한국어로 정리한 웹 보고서.",
    locale: "ko_KR",
    type: "article",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="site-body">
        <div className="site-shell">
          <div className="page-canvas">{children}</div>
        </div>
      </body>
    </html>
  );
}
