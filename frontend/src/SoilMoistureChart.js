import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';

const SoilMoistureChart = ({ deviceId, startDate, endDate }) => {
  const [moistureData, setMoistureData] = useState([]);

  // Fetch soil moisture data when the component mounts or when startDate/endDate changes
  useEffect(() => {
    fetchSoilMoistureData();
  }, [deviceId, startDate, endDate]);

  // Cleanup function to destroy chart instance when the component unmounts
  useEffect(() => {
    const chartInstance = renderChart();

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [moistureData, startDate, endDate]);

  const fetchSoilMoistureData = async () => {
    try {
      // Fetch soil moisture data for the specific device and date range
      const response = await fetch(`/sensor_readings?deviceId=${deviceId}&startDate=${startDate}&endDate=${endDate}`);
      const data = await response.json();

      // Extract soil moisture values from the fetched data
      const moistureValues = data.data.map((reading) => reading.soilMoisture);

      // Update the state with the soil moisture data
      setMoistureData(moistureValues);
    } catch (error) {
      console.error('Error fetching soil moisture data:', error);
    }
  };

  // Chart rendering logic
  const renderChart = () => {
    const ctx = document.getElementById('soilMoistureChart');

    return new Chart(ctx, {
      type: 'line',
      data: chartData,
    });
  };

  // Chart configuration for soil moisture
  const chartData = {
    labels: Array.from({ length: moistureData.length }, (_, i) => i + 1),
    datasets: [
      {
        label: 'Soil Moisture',
        data: moistureData,
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  return (
    <div>
      <h2>Soil Moisture Chart</h2>
      <canvas id="soilMoistureChart"></canvas>
    </div>
  );
};

export default SoilMoistureChart;
