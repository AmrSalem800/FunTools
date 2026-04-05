import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language } from "@/lib/i18n";

interface AppContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  lang: Language;
  toggleLang: () => void;
  dir: "ltr" | "rtl";
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") || "dark";
    }
    return "dark";
  });

  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("lang") as Language) || "ar";
    }
    return "ar";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    root.lang = lang;
    localStorage.setItem("lang", lang);
  }, [lang]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  const toggleLang = () => setLang((prev) => (prev === "ar" ? "en" : "ar"));
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <AppContext.Provider value={{ theme, toggleTheme, lang, toggleLang, dir }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}