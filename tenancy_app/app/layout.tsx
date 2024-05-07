import "./globals.css";
import { Inter, Passion_One } from "next/font/google";
import { Metadata } from "next";

import { Providers } from "@/components/provider";
import { SessionWrapper } from "@/components/session-wrapper";
import { LoginModal } from "@/components/modals/login-modal";
import { NavHeader } from "@/components/nav-header/nav-header";

import { cn } from "./_lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const passionOne = Passion_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-passion-one",
});

export const metadata: Metadata = {
  title: "Tenancy Help NZ - Tenancy Advice",
  description:
    "Get help with your tenancy issues in New Zealand, backed by solid sources.",
  openGraph: {
    title: "Tenancy Help NZ - Tenancy Advice",
    description:
      "Get help with your tenancy issues in New Zealand, backed by solid sources.",
    url: "https://tenancyhelp.com",
    type: "website",
    locale: "en_US",
    siteName: "Tenancy Help NZ",
    images: [
      {
        url: "https://tenancyhelp.com/tenancy-logo.png",
        width: 2321,
        height: 1000,
        alt: "Tenancy Help NZ logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionWrapper>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(inter.variable, passionOne.variable)}>
          <Providers
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NavHeader />
            <LoginModal />
            <div className="flex flex-col min-h-screen">
              <main className="flex flex-col flex-1 bg-muted/50">
                {children}
              </main>
            </div>
          </Providers>
        </body>
      </html>
    </SessionWrapper>
  );
}
