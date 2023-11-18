import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from "react-native";
import Paho from "paho-mqtt";
import { useNavigation } from "@react-navigation/native";
import { useConfig } from "../Context/ConfigContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import * as Speech from "expo-speech";
import { v4 as uuidv4 } from "uuid";

const MainScreen = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  const navigation = useNavigation();
  const { mqttConfig } = useConfig();
  const [value, setValue] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function getNotificationPermission() {
      const { granted } = await Notifications.getPermissionsAsync();
      console.log("Notification Permissions:", granted);
      if (!granted) {
        try {
          const { granted } = await Notifications.requestPermissionsAsync();
          if (!granted) {
            console.log(
              "Notification permissions are required to use this feature."
            );
          }
        } catch (error) {
          console.error("Error requesting notification permissions:", error);
        }
      }
    }

    if (!mqttConfig) {
      return;
    }

    const client = new Paho.Client(
      mqttConfig.brokerAddress,
      Number(mqttConfig.brokerPort),
      `mqtt-async-test-${parseInt(Math.random() * 100)}`
    );

    if (!client.isConnected()) {
      client.connect({
        onSuccess: () => {
          console.log("Connected");
          client.subscribe(mqttConfig.topic);
          client.onMessageArrived = onMessage;
        },
        onFailure: (error) => {
          console.error("Failed to Connect", error);
        },
      });
    }

    return () => {
      if (client.isConnected()) {
        client.disconnect();
      }
    };

    getNotificationPermission();
  }, [mqttConfig]);

  function onMessage(message) {
    if (message.destinationName === mqttConfig?.topic) {
      const gasLevel = parseInt(message.payloadString);
      setValue(gasLevel);
      setHistory((prevHistory) => [
        ...prevHistory,
        { topic: mqttConfig.topic, gasLevel, timestamp: new Date() },
      ]);

      if (gasLevel >= 1200) {
        sendNotification(gasLevel);
      }
    }
  }

  const sendNotification = async (gasLevel) => {
    const spokenMessage = `Gas level is high at ${gasLevel} parts per million. Consider taking action.`;
    const pushNotificationMessage = `Gas level is elevated. Check the app for details.`;

    console.log("Sending spoken notification:", spokenMessage);

    try {
      Speech.speak(spokenMessage);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Gas Alert!",
          body: pushNotificationMessage,
          sound: "default",
        },
        trigger: {
          seconds: 5,
        },
        identifier: uuidv4(), // Use uuidv4 for a unique identifier
      });
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const calculateGaugeColor = () => {
    if (value <= 500) {
      return "#a4c3b2";
    } else if (value <= 1000) {
      return "#fca311";
    } else if (value >= 1200) {
      return "#e54b4b";
    }
  };

  const calculateGasLevelTextColor = () => {
    return "white";
  };

  const getGasLevelStatus = () => {
    if (value <= 500) {
      return "Normal";
    } else if (value <= 1000) {
      return "Moderate";
    } else if (value >= 1200) {
      return "High";
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.gaugeContainer,
          { backgroundColor: calculateGaugeColor() },
        ]}
      >
        <Text
          style={[styles.gasLevelText, { color: calculateGasLevelTextColor() }]}
        >
          Gas Level
        </Text>
        <Text
          style={[styles.gasValue, { color: calculateGasLevelTextColor() }]}
        >
          {value} PPM
        </Text>
        <Text style={styles.gasStatus}>{getGasLevelStatus()}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Config")}
        >
          <MaterialCommunityIcons name="cogs" size={24} color="#fff" />
          <Text style={styles.buttonText}> Config</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("History", { history })}
        >
          <MaterialCommunityIcons name="history" size={24} color="#fff" />
          <Text style={styles.buttonText}> History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Chart", { history })}
        >
          <MaterialCommunityIcons name="chart-line" size={24} color="#fff" />
          <Text style={styles.buttonText}> Charts</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.developerText}>
        Developed by: Hadj Hassine Jawher
      </Text>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  gaugeContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "88%",
    height: 350,
    borderRadius: 5,
    marginBottom: 20,
  },
  gasLevelText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  gasValue: {
    fontSize: 36,
    fontWeight: "bold",
  },
  gasStatus: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
  },
  button: {
    backgroundColor: "#6b9080",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  developerText: {
    marginTop: 10,
    fontSize: 12,
    color: "black",
  },
});

export default MainScreen;
