import React, { createContext, useContext, useState } from "react";

const ConfigContext = createContext();

export const useConfig = () => {
  return useContext(ConfigContext);
};

export const ConfigProvider = ({ children }) => {
  const [mqttConfig, setMqttConfig] = useState({
    brokerAddress: "mqtt-dashboard.com",
    brokerPort: "8000",
    topic: "security/gas",
  });

  const updateConfig = (newConfig) => {
    setMqttConfig(newConfig);
  };

  return (
    <ConfigContext.Provider value={{ mqttConfig, updateConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};
