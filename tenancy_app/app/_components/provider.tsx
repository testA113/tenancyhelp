"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReCaptchaProvider } from "next-recaptcha-v3";

import { TooltipProvider } from "@/components/ui/tooltip";

// https://tanstack.com/query/v5/docs/framework/react/guides/advanced-ssr
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function Providers({ children, ...props }: ThemeProviderProps) {
  const queryClient = getQueryClient();
  return (
    <ReCaptchaProvider
      className="hidden"
      hidden
      reCaptchaKey={process.env.RECAPTCHA_SITE_KEY}
    >
      <QueryClientProvider client={queryClient}>
        <NextThemesProvider {...props}>
          <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
        </NextThemesProvider>
      </QueryClientProvider>
    </ReCaptchaProvider>
  );
}
