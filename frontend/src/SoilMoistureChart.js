import React, { useState, useEffect } from 'react';
import { Chart } from 'chart.js/auto';
import { startOfToday, addDays, addWeeks, addMonths, addYears, format } from 'date-fns';
import 'chartjs-adapter-date-fns';

const SoilMoistureChart = ({ deviceId }) => {
  const [moistureData, setMoistureData] = useState({ values: [] });
  const [timeRange, setTimeRange] = useState('month'); // Default time range is set to 'month'

  useEffect(() => {
    fetchSoilMoistureData();
  }, [deviceId, timeRange]);

  const fetchSoilMoistureData = async () => {
    try {
      // Calculate start date based on the selected time range
      const today = startOfToday();
      let startDate;

      switch (timeRange) {
        case 'day':
          startDate = addDays(today, -1);
          break;
        case 'week':
          startDate = addWeeks(today, -1);
          break;
        case 'month':
          startDate = startOfToday();
          startDate.setMonth(today.getMonth() - 1);
          break;
        case 'year':
          startDate = startOfToday();
          startDate.setFullYear(today.getFullYear() - 1);
          break;
        default:
          startDate = startOfToday();
      }

      // Format dates to 'YYYY-MM-DD' for API request
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(today, 'yyyy-MM-dd');

      // Fetch soil moisture data for the specific device and time range
      const response = await fetch(
        `/sensor_readings?deviceId=${deviceId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      );
      const data = await response.json();

      // Extract soil moisture values and timestamps from the fetched data
      const moistureValues = data.data.map((reading) => reading.soilMoisture);
      const timestamps = data.data.map((reading) => new Date(reading.timestamp));

      // Update the state with the soil moisture data
      setMoistureData({ values: moistureValues, timestamps });
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
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: timeRange === 'day' ? 'hour' : 'day', // Set unit to 'hour' for the 'Day' range
                displayFormats: {
                  hour: 'H:mm', // Format for hourly intervals
                  day: 'MMM d', // Format for daily intervals
                },
              },
              title: {
                display: true,
                text: 'Time',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Soil Moisture',
              },
            },
          },
        },
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
  }, [moistureData, timeRange]);

  const chartData = {
    labels: moistureData.timestamps,
    datasets: [
      {
        label: 'Soil Moisture',
        data: moistureData.values,
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  // Function to handle time range button click
  const handleTimeRangeButtonClick = (range) => {
    setTimeRange(range);
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
