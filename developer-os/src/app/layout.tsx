import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SessionProvider } from "@/components/providers/session-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Developer OS",
    template: "%s | Developer OS",
  },
  description:
    "Your second brain for everything you study, learn, build, complete, review and track.",
  keywords: [
    "developer",
    "productivity",
    "study",
    "coding",
    "DSA",
    "machine learning",
    "project management",
  ],
  authors: [{ name: "Developer OS" }],
  creator: "Developer OS",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Developer OS",
    title: "Developer OS",
    description:
      "Your second brain for everything you study, learn, build, complete, review and track.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer OS",
    description:
      "Your second brain for everything you study, learn, build, complete, review and track.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <ThemeProvider defaultTheme="system" storageKey="developer-os-theme">
          <SessionProvider>
            <QueryProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </QueryProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
