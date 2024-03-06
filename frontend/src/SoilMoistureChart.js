import React, { useState, useEffect } from 'react';
import { Chart } from 'chart.js/auto';

const SoilMoistureChart = ({ deviceId }) => {
  const [moistureData, setMoistureData] = useState([]);
  const [timeRange, setTimeRange] = useState('month'); // Default time range is set to 'month'

  useEffect(() => {
    fetchSoilMoistureData();
  }, [deviceId, timeRange]);

  const fetchSoilMoistureData = async () => {
    try {
      // Calculate start date based on the selected time range
      const today = new Date();
      let startDate;

      switch (timeRange) {
        case 'day':
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 1);
          break;
        case 'week':
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(today.getFullYear() - 1, today.getMonth(), 1);
          break;
        default:
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      }

      // Format dates to 'YYYY-MM-DD' for API request
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(today);

      // Fetch soil moisture data for the specific device and time range
      const response = await fetch(
        `/sensor_readings?deviceId=${deviceId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      );
      const data = await response.json();

      // Extract soil moisture values from the fetched data
      const moistureValues = data.data.map((reading) => reading.soilMoisture);

      // Update the state with the soil moisture data
      setMoistureData(moistureValues);
    } catch (error) {
      console.error('Error fetching soil moisture data:', error);
    }
  };

  const renderChart = () => {
    const ctx = document.getElementById('soilMoistureChart');

    if (ctx) {
      return new Chart(ctx, {
        type: 'line',
        data: chartData,
      });
    }
  };

  useEffect(() => {
    const chartInstance = renderChart();

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [moistureData]);

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

  // Function to handle time range button click
  const handleTimeRangeButtonClick = (range) => {
    setTimeRange(range);
  };

  // Function to format date as 'YYYY-MM-DD'
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div>
      <h2>Soil Moisture Chart</h2>
      <div>
        <button onClick={() => handleTimeRangeButtonClick('day')}>Day</button>
        <button onClick={() => handleTimeRangeButtonClick('week')}>Week</button>
        <button onClick={() => handleTimeRangeButtonClick('month')}>Month</button>
        <button onClick={() => handleTimeRangeButtonClick('year')}>Year</button>
      </div>
      <canvas id="soilMoistureChart"></canvas>
    </div>
  );
};

export default SoilMoistureChart;
