import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Развилка",
  description:
    "AI-разбор двух вероятных траекторий будущего на основе честных ответов о жизни, привычках, страхах и целях.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#090b0f] text-white">
        <div className="site-grain" />
        {children}
      </body>
    </html>
  );
}
