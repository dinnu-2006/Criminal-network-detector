import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CrimeNet AI — Criminal Network Analysis",
  description: "AI-Powered Criminal Network Analysis System for authorized law-enforcement investigators. SIH 2026, Problem Statement ID: 26189.",
  keywords: ["criminal network analysis", "graph intelligence", "law enforcement", "ICJS", "SIH 2026"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ margin: 0, padding: 0, height: "100vh", overflow: "hidden", background: "#020502" }}>
        {children}
      </body>
    </html>
  );
}
