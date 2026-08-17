import { useSettings } from "./SettingContext";

export default function PreviewCard() {
  const { theme, language } = useSettings();

  const message =
    language === "en"
      ? "This is your preference preview."
      : "นี่คือตัวอย่างการตั้งค่าของคุณ";

  return (
    <div>
      <h2>Preview Card</h2>

      <p>Current Theme: {theme}</p>

      <p>Current Language: {language}</p>

      <p>{message}</p>
    </div>
  );
}