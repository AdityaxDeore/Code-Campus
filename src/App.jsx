import React from "react";
import Routes from "./Routes";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import SetupRequired from "./components/SetupRequired";

function App() {
  // Check if Firebase configuration is missing
  if (typeof window !== 'undefined' && window.__FIREBASE_CONFIG_ERROR__) {
    return <SetupRequired />;
  }

  return (
    <DarkModeProvider>
      <Routes />
    </DarkModeProvider>
  );
}

export default App;
