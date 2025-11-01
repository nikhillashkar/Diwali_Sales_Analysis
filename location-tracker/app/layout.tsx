import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Location Tracker - Real-time Location Sharing",
  description: "Share and track locations with consent-based real-time updates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
