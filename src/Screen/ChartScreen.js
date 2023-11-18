import React from "react";
import { View, Text, StatusBar, StyleSheet, Dimensions } from "react-native";
import { PieChart, LineChart } from "react-native-chart-kit";
import { useNavigation } from "@react-navigation/native";
import { useConfig } from "../Context/ConfigContext";

const decimateData = (data, maxPoints) => {
  const decimatedData = [...data];
  const step = Math.ceil(data.length / maxPoints);
  return decimatedData.filter((_, index) => index % step === 0);
};

const ChartSection = ({ title, chartData, chartType }) => {
  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={[styles.chartContainer, { backgroundColor: "#fff", width: screenWidth * 0.9 }]}>
      <Text style={styles.chartTitle}>{title}</Text>
      {chartType === "pie" ? (
        <PieChart
          data={chartData}
          width={screenWidth * 0.9}
          height={240}
          chartConfig={{
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
          absolute
        />
      ) : (
        <LineChart
          data={chartData}
          width={screenWidth * 0.9}
          height={240}
          yAxisLabel="PPM"
          chartConfig={{
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForDots: {
              r: "5",
              strokeWidth: "2",
              stroke: "#000", // Fixed color for dots
            },
          }}
          style={styles.chart}
          withDots
          absolute
        />
      )}
    </View>
  );
};
const ChartScreen = ({ route }) => {
  const { history } = route.params;
  const navigation = useNavigation();
  const { mqttConfig } = useConfig();

  const formatTime = (timestamp) => {
    const hours = timestamp.getHours().toString().padStart(2, "0");
    const minutes = timestamp.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const maxDataPoints = 20;

  const pieChartData = history.map((entry) => ({
    name: formatTime(entry.timestamp),
    value: entry.gasLevel,
    color: `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(
      Math.random() * 100
    )}, ${Math.floor(Math.random() * 100)}, 1)`,
  }));

  const decimatedLineChartData = decimateData(history, maxDataPoints);
  const lineChartData = {
    labels: decimatedLineChartData.map((entry) => formatTime(entry.timestamp)),
    datasets: [
      {
        data: decimatedLineChartData.map((entry) => entry.gasLevel),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <ChartSection title="Gas Level Over Time" chartData={lineChartData} chartType="line" />
      
      <View style={styles.separator} />
      <ChartSection title="Gas Level Distribution" chartData={pieChartData} chartType="pie" />
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
  chartContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  chart: {
    borderRadius: 0,
    backgroundColor: "transparent",
  },
  separator: {
    height: 1,
    backgroundColor: "#73877b",
    width: "90%",
    marginBottom: 20,
  },
});

export default ChartScreen;