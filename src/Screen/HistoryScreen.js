import React from "react";
import { View, Text, SectionList, StyleSheet } from "react-native";

const HistoryScreen = ({ route }) => {
  const { history } = route.params;

  const reversedHistory = [...history].reverse();

  const groupedHistory = reversedHistory.reduce((accumulator, currentValue) => {
    const topic = currentValue.topic;
    if (!accumulator[topic]) {
      accumulator[topic] = [];
    }
    accumulator[topic].push(currentValue);
    return accumulator;
  }, {});

  const sections = Object.keys(groupedHistory).map((topic) => ({
    title: `Topic: ${topic}`,
    data: groupedHistory[topic],
  }));

  return (
    <View style={styles.container}>
      <SectionList
        style={styles.list}
        sections={sections}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false} 
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={[styles.item, item.gasLevel >= 1200 && styles.highGasLevel]}>
            <Text style={styles.gasLevel}>{`Gas Level: ${item.gasLevel} PPM`}</Text>
            <Text style={styles.timestamp}>{`Timestamp: ${formatTimestamp(item.timestamp)}`}</Text>
          </View>
        )}
      />
    </View>
  );
};

const formatTimestamp = (timestamp) => {
  const options = { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" };
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, options);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
  },
  list: {
    width: "100%",
  },
  sectionHeader: {
    backgroundColor: "#6b9080",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  sectionHeaderText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
  },
  item: {
    borderBottomWidth: 1,
    borderColor: "#ECF0F1", 
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: "100%", 
    alignSelf: "center", 
    borderRadius :5,
  },
  highGasLevel: {
    backgroundColor: "#f5f3f4",

  },
  gasLevel: {
    color: "#2C3E50",
    fontSize: 16,
    fontWeight: "bold",
  },
  timestamp: {
    color: "#7F8C8D",
    fontSize: 14,
    marginTop: 5,
  },
});

export default HistoryScreen;
