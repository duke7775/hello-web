import { SettingProvider, useSettings } from "./SettingContext";
import SettingPanel from "./SettingPanel";
import Header from "./Header";
import PreviewCard from "./PreviewCard";

function AppContent() {
  const { theme } = useSettings();

  return (
    <div className={theme}>
      <Header />
      <SettingPanel />
      <PreviewCard />
    </div>
  );
}

export default function App() {
  return (
    <SettingProvider>
      <AppContent />
    </SettingProvider>
  );
}