import { useSettings } from "./SettingContext";

export default function SettingPanel() {
  const {
    theme,
    language,
    setTheme,
    setLanguage,
    resetSettings,
  } = useSettings();

  return (
    <div>
      <h2>Settings</h2>

      <div>
        <h3>Theme</h3>

        <button onClick={() => setTheme("light")}>
          Light
        </button>

        <button onClick={() => setTheme("dark")}>
          Dark
        </button>
      </div>

      <div>
        <h3>Language</h3>

        <button onClick={() => setLanguage("en")}>
          English
        </button>

        <button onClick={() => setLanguage("th")}>
          Thai
        </button>
      </div>

      <button onClick={resetSettings}>
        Reset
      </button>

      <p>Current theme: {theme}</p>
      <p>Current language: {language}</p>
    </div>
  );
}