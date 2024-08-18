import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import {Provider } from "./Provider";



const inter = FontSans({ subsets: ["latin"], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "Docs Flow",
  description: "Reale time collaborative docs editor",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <ClerkProvider appearance={{ variables: { colorPrimary: "#3371FF" }, baseTheme: dark }}>
      <html lang="en">
        <body className={inter.className}>
          <Provider>
            {children}
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
