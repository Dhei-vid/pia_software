import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/contexts/UserContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const metadata: Metadata = {
  title: "Wright LAW ACT Software",
  description: "AI application that interprets the Petroleum Act Law (PIA) in Nigeria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <UserProvider>
            {children}
            <Toaster position={"top-right"} />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
