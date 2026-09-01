import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";


// const headerFont = localFont(
// {
//    src:[
//    {
//   path: "./fonts/Saans-TRIAL-Regular.woff2",
//   weight: "400",
//   style: 'normal'
// },
// {
//   path: "./fonts/Saans-TRIAL-Bold.woff2",
//   weight: "700",
//   style: 'bold',
// }
//  ], variable: "--font-header",
//  display: "swap",
// });

const headerFont = localFont({
  src:"./fonts/Saans-TRIAL-Regular.woff2",
  weight: "400",
  style: 'normal',
  variable: "--font-header",
})

const textFont = localFont({
  src: "./fonts/NectoMono-Regular.woff2",
  weight: "400",
  variable: "--font-text",
});

export const metadata: Metadata = {
  title: "CSCON 5.0 — Build. Create. Scale.",
  description: "The OAU Creator, Business & Tech Summit. September 3rd, 2026 · Oduduwa Hall, OAU. NACOS presents the flagship gathering where creators, builders and founders converge.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${headerFont.variable} ${textFont.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
