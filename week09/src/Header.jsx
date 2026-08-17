import { useSettings } from "./SettingContext";

export default function Header() {
  const { language } = useSettings();

  return (
    <header>
      <h1>
        {language === "en"
          ? "Welcome"
          : ""}
      </h1>
    </header>
  );
}