import React from "react";
import Routes from "./Routes";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { RoleProvider } from "./contexts/RoleContext";
import SetupRequired from "./components/SetupRequired";

function App() {
  // Check if Firebase configuration is missing
  if (typeof window !== 'undefined' && window.__FIREBASE_CONFIG_ERROR__) {
    return <SetupRequired />;
  }

  return (
    <DarkModeProvider>
      <RoleProvider>
        <Routes />
      </RoleProvider>
    </DarkModeProvider>
  );
}

export default App;
