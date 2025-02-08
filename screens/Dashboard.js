import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";
import Card from "../components/Card";

// Fetch data from local API
const fetchDataFromAPI = async (setFeeds, setIsLoading) => {
  const url = "https://kiran-application.onrender.com/api/data";

  try {
    const response = await fetch(url);
    const data = await response.json();

    setFeeds(data || []);
    setIsLoading(false);
  } catch (error) {
    console.error("Error fetching data from API:", error);
    setIsLoading(false);
  }
};

const Dashboard = () => {
  const [feeds, setFeeds] = useState([]); // Data from API
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDataFromAPI(setFeeds, setIsLoading);

    const intervalId = setInterval(() => {
      fetchDataFromAPI(setFeeds, setIsLoading);
    }, 15000); // Fetch data every 15 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  // Extracting data for the first group (Irradiance, Temperature, Voltage)
  const timeLabels = feeds.map((feed, index) =>
    index % 5 === 0 ? new Date(feed.timestamp).toLocaleTimeString() : ""
  );
  const field1Data = feeds.map((feed) => parseFloat(feed.irradiance) || 0); // Irradiance
  const field2Data = feeds.map((feed) => parseFloat(feed.temperature) || 0); // Temperature
  const field3Data = feeds.map((feed) => parseFloat(feed.voltage) || 0); // Voltage
  const field4Data = feeds.map((feed) => parseFloat(feed.azimuth) || 0); // Azimuth
  const field5Data = feeds.map((feed) => parseFloat(feed.zenith) || 0); // Zenith

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Line color
    strokeWidth: 2, // Line thickness
    propsForDots: {
      r: "4", // Dot radius
      strokeWidth: "2",
      stroke: "#ffa726", // Dot border color
      fill: "#ffa726", // Dot fill color
    },
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cardContainer}>
        <Card
          fieldName="Irradiance"
          value={`${field1Data[field1Data.length - 1]?.toFixed(2)} W/m²`}
          icon={require("../assets/irradiance.png")}
        />
        <Card
          fieldName="Temperature"
          value={`${field2Data[field2Data.length - 1]?.toFixed(2)} °C`}
          icon={require("../assets/temperature.png")}
        />
        <Card
          fieldName="Voltage"
          value={`${field3Data[field3Data.length - 1]?.toFixed(2)} V`}
          icon={require("../assets/voltage.png")}
        />
        <Card
          fieldName="Azimuth"
          value={`${field4Data[field4Data.length - 1]?.toFixed(2)}°`}
          icon={require("../assets/azimuth.png")}
        />
        <Card
          fieldName="Zenith"
          value={`${field5Data[field5Data.length - 1]?.toFixed(2)}°`}
          icon={require("../assets/zenith.png")}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.chartContainer}>
          {feeds.length > 0 && (
            <>
              <LineChart
                data={{
                  labels: timeLabels,
                  datasets: [
                    {
                      data: field1Data,
                    },
                  ],
                }}
                width={Dimensions.get("window").width - 32}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
              <LineChart
                data={{
                  labels: timeLabels,
                  datasets: [
                    {
                      data: field2Data,
                    },
                  ],
                }}
                width={Dimensions.get("window").width - 32}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
              <LineChart
                data={{
                  labels: timeLabels,
                  datasets: [
                    {
                      data: field3Data,
                    },
                  ],
                }}
                width={Dimensions.get("window").width - 32}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
              <LineChart
                data={{
                  labels: timeLabels,
                  datasets: [
                    {
                      data: field4Data,
                    },
                  ],
                }}
                width={Dimensions.get("window").width - 32}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
              <LineChart
                data={{
                  labels: timeLabels,
                  datasets: [
                    {
                      data: field5Data,
                    },
                  ],
                }}
                width={Dimensions.get("window").width - 32}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  chartContainer: {
    marginTop: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default Dashboard;
