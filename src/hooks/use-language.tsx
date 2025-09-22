"use client"

import * as React from "react"
import translations from "@/data/translations.json"

type Language = "ru" | "en"

type LanguageProviderProps = {
  children: React.ReactNode
  defaultLanguage?: Language
  storageKey?: string
}

type LanguageProviderState = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const initialState: LanguageProviderState = {
  language: "ru",
  setLanguage: () => null,
  t: () => "",
}

const LanguageProviderContext = React.createContext<LanguageProviderState>(initialState)

export function LanguageProvider({
  children,
  defaultLanguage = "ru",
  storageKey = "arqa-language",
  ...props
}: LanguageProviderProps) {
  const [language, setLanguage] = React.useState<Language>(
    () => (localStorage.getItem(storageKey) as Language) || defaultLanguage
  )

  const t = React.useCallback((key: string) => {
    return translations[language][key as keyof typeof translations.ru] || key
  }, [language])

  const value = {
    language,
    setLanguage: (language: Language) => {
      localStorage.setItem(storageKey, language)
      setLanguage(language)
    },
    t,
  }

  return (
    <LanguageProviderContext.Provider {...props} value={value}>
      {children}
    </LanguageProviderContext.Provider>
  )
}

export const useLanguage = () => {
  const context = React.useContext(LanguageProviderContext)

  if (context === undefined)
    throw new Error("useLanguage must be used within a LanguageProvider")

  return context
}
