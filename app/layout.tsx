import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CSCON 5.0 — Create. Build. Scale.",
  description: "The OAU Creator, Business & Tech Summit. July 21, 2026 · Oduduwa Hall, OAU. NACOS presents the flagship gathering where creators, builders and founders converge.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
