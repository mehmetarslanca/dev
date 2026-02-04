import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export interface AppConfig {
  githubProfileUrl: string;
  githubUsername: string;
}

const ConfigContext = createContext<AppConfig | null>(null);

export const useConfig = () => {
  return useContext(ConfigContext);
};

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [config, setConfig] = useState<AppConfig | null>(null);

  useEffect(() => {
    axios.get("/api/config")
      .then((res) => setConfig(res.data))
      .catch((err) => {
        console.error("Failed to fetch app config", err);
        // Fallback or set error state. For now, let's allow the app to load with empty/default values
        // so the user isn't staring at a blank screen.
         setConfig({
             githubProfileUrl: "https://github.com",
             githubUsername: "param-error"
         });
      });
  }, []);

  if (!config) {
     return <div className="flex items-center justify-center h-screen w-full bg-background text-foreground">Loading configuration...</div>;
  }

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
};
