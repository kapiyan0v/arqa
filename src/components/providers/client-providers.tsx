"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/hooks/use-theme"
import { LanguageProvider } from "@/hooks/use-language"
import { RoleProvider } from "@/hooks/use-role"
import { Layout } from "@/components/layout/layout"
import { Toaster } from "sonner"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="arqa-theme">
        <LanguageProvider defaultLanguage="ru" storageKey="arqa-language">
          <RoleProvider defaultRole="viewer" storageKey="arqa-user-role">
            <Layout>
              {children}
            </Layout>
            <Toaster />
          </RoleProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
