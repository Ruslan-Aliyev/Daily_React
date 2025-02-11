import { useEffect } from "react";
import { DailyProvider } from "@daily-co/daily-react";
import NonPrebuildApp from "./NonPrebuildApp.jsx";


export default function NonPrebuild() {
  return (
    <DailyProvider dailyConfig={{ useDevicePreferenceCookies: true }}>
      <NonPrebuildApp />
    </DailyProvider>
  );
};
