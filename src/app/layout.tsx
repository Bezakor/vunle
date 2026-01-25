import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindScape - Personalized Guided Meditations",
  description: "Create custom AI-generated guided visualization meditations tailored to your personal journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
