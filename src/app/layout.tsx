import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Macro Mixer MVP",
  description: "Research and synthesis prototype for contextual pyramids"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" lang="en">
      <body>{children}</body>
    </html>
  );
}
