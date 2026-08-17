import { createContext, useContext, useEffect, useState } from "react";

const SettingContext = createContext();

const DEFAULT_SETTINGS = {
  theme: "light",
  language: "en",
};

export function SettingProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const savedSettings = localStorage.getItem("app-settings");

    if (savedSettings) {
      const settings = JSON.parse(savedSettings);

      setTheme(settings.theme);
      setLanguage(settings.language);
    }
  }, []);
  useEffect(() => {
    const settings = {
      theme,
      language,
    };

    localStorage.setItem("app-settings", JSON.stringify(settings));
  }, [theme, language]);

  const resetSettings = () => {
    setTheme(DEFAULT_SETTINGS.theme);
    setLanguage(DEFAULT_SETTINGS.language);
  };

  return (
    <SettingContext.Provider
      value={{
        theme,
        language,
        setTheme,
        setLanguage,
        resetSettings,
      }}
    >
      {children}
    </SettingContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingContext);
}