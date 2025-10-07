import type { Metadata } from "next";
import "./globals.css";
import RootClientWrapper from "@/components/helper/RootClientWrapper";

export const metadata: Metadata = {
  title: "Investment Platform",
  description: "Manage your investments easily and securely",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <RootClientWrapper>{children}</RootClientWrapper>
      </body>
    </html>
  );
}