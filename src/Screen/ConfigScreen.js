import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableHighlight, Text, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useConfig } from "../Context/ConfigContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ConfigScreen = () => {
  const navigation = useNavigation();
  const { mqttConfig, updateConfig } = useConfig();
  const [brokerAddress, setBrokerAddress] = useState(mqttConfig.brokerAddress);
  const [brokerPort, setBrokerPort] = useState(mqttConfig.brokerPort);
  const [topic, setTopic] = useState(mqttConfig.topic);

  const handleConnect = () => {
    if (!brokerAddress || !brokerPort || !topic) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return;
    }

    try {
      // Assume updateConfig is synchronous for simplicity
      updateConfig({ brokerAddress, brokerPort, topic });
      Alert.alert("Success", "Configuration updated successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error updating configuration:", error);
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>HiveMQ Broker Configuration</Text>
      <TextInput
        style={styles.input}
        placeholder="Broker Address"
        onChangeText={setBrokerAddress}
        value={brokerAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Broker Port"
        onChangeText={setBrokerPort}
        value={brokerPort}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Topic"
        onChangeText={setTopic}
        value={topic}
      />
      <TouchableHighlight
        style={styles.buttonContainer}
        underlayColor="#6b9080"
        onPress={handleConnect}
      >
        <View style={styles.button}>
          <MaterialCommunityIcons name="check" size={24} color="white" />
          <Text style={styles.buttonText}> Connect</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#6b9080",
  },
  input: {
    height: 55,
    borderColor: "#6b9080",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 20,
    width: "90%",
    borderRadius: 8,
    backgroundColor: "white",
  },
  buttonContainer: {
    width: "90%",
    borderRadius: 8,
    overflow: "hidden",
  },
  button: {
    backgroundColor: "#6b9080",
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default ConfigScreen;
