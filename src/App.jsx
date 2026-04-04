import React from "react";
import Routes from "./Routes";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import SetupRequired from "./components/SetupRequired";
import { UserProvider } from "./context/UserContext";

function App() {
  // Check if Firebase configuration is missing
  if (typeof window !== 'undefined' && window.__FIREBASE_CONFIG_ERROR__) {
    return <SetupRequired />;
  }

  return (
    <UserProvider>
      <DarkModeProvider>
        <Routes />
      </DarkModeProvider>
    </UserProvider>
  );
}

export default App;
