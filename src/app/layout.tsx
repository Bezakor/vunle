import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

const DESCRIPTION =
  "Vunle creates a guided visualization made only for you — your goal, your tone, your timeline, your emotion. Join the waitlist.";

/**
 * NEXT_PUBLIC_SITE_URL is what the share card and canonical link are built
 * from. Set it in the host's environment once the real domain is in place;
 * without it these fall back to the Vercel address, and a link shared from a
 * different domain would point its preview image back here.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vunle.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Vunle — Personal goals need personal visualizations",
  description: DESCRIPTION,
  // opengraph-image.jpg and icon.png next to this file are picked up on their
  // own; these are the parts Next cannot infer.
  openGraph: {
    type: "website",
    siteName: "Vunle",
    title: "Vunle — Personal goals need personal visualizations",
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vunle — Personal goals need personal visualizations",
    description: DESCRIPTION,
  },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} font-mono antialiased`}>{children}</body>
    </html>
  );
}
