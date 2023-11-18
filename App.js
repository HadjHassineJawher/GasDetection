import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ConfigProvider } from "./src/Context/ConfigContext";
import MainScreen from "./src/Screen/MainScreen";
import ConfigScreen from "./src/Screen/ConfigScreen";
import HistoryScreen from "./src/Screen/HistoryScreen";
import ChartScreen from "./src/Screen/ChartScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <ConfigProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Main"
          screenOptions={{
            headerStyle: {
              backgroundColor: "#ffffff", 
            },
            headerTintColor: "#586f6b",
            headerTitleStyle: {
              fontWeight: "bold", 
            },
          }}
        >
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{
              title: "Gas Detection", 
            }}
          />
          <Stack.Screen
            name="Config"
            component={ConfigScreen}
            options={{
              title: "Configuration", 
            }}
          />
          <Stack.Screen
            name="History"
            component={HistoryScreen}
            options={{
              title: "History", 
            }}
          />
          <Stack.Screen
            name="Chart"
            component={ChartScreen}
            options={{
              title: "Statistics", 
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ConfigProvider>
  );
}
