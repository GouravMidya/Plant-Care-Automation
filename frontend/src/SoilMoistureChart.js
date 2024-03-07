import React, { useState, useEffect } from 'react';
import { Chart } from 'chart.js/auto';
import { startOfToday, addDays, addWeeks, addMonths, addYears, format } from 'date-fns';
import 'chartjs-adapter-date-fns';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SoilMoistureChart = ({ deviceId }) => {
  const [moistureData, setMoistureData] = useState({ values: [] });
  const [timeRange, setTimeRange] = useState('month');
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [customStartDate, setCustomStartDate] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(true); // Declare and initialize
  const [showEndDatePicker, setShowEndDatePicker] = useState(false); // Declare and initialize

  useEffect(() => {
    if (timeRange === 'custom') {
      fetchCustomRangeData();
    } else {
      fetchSoilMoistureData();
    }
  }, [deviceId, timeRange, dateRange]);

  const fetchSoilMoistureData = async () => {
    try {
      const today = startOfToday();
      let startDate;

      if (timeRange === 'custom' && dateRange.startDate && dateRange.endDate) {
        startDate = dateRange.startDate;
      } else {
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

  const fetchCustomRangeData = async () => {
    try {
      const formattedStartDate = format(dateRange.startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(dateRange.endDate, 'yyyy-MM-dd');

      const response = await fetch(
        `/sensor_readings?deviceId=${deviceId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      );

      const data = await response.json();

      const moistureValues = data.data.map((reading) => reading.soilMoisture);
      const timestamps = data.data.map((reading) => new Date(reading.timestamp));

      setMoistureData({ values: moistureValues, timestamps });
    } catch (error) {
      console.error('Error fetching soil moisture data:', error);
    }
  };

  const renderChart = () => {
    const ctx = document.getElementById('soilMoistureChart');

    if (ctx) {
      const timeUnit = timeRange === 'day' ? 'hour' : 'day';
      const displayFormat = timeRange === 'day' ? 'H:mm' : 'MMM d';
      const tooltipFormat = timeRange === 'day' ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd';

      return new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: timeUnit,
                displayFormats: {
                  hour: 'H:mm',
                  day: displayFormat,
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
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  const timestamp = context.parsed.x;
                  return `${format(timestamp, tooltipFormat)}: ${context.parsed.y}`;
                },
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

  const handleTimeRangeButtonClick = (range) => {
    setTimeRange(range);
  };

  const handleCustomStartDateChange = (date) => {
    setCustomStartDate(date);
    setDateRange({ ...dateRange, startDate: date, endDate: null });
    setShowStartDatePicker(false);
    setShowEndDatePicker(true);
  };

  const handleCustomEndDateChange = (date) => {
    if (date > customStartDate) {
      setDateRange({ ...dateRange, endDate: date });
      setShowEndDatePicker(false);
      setShowStartDatePicker(true);
    }
  };

  return (
    <div>
      <h2>Soil Moisture Chart</h2>
      <div>
        <button onClick={() => handleTimeRangeButtonClick('day')}>Day</button>
        <button onClick={() => handleTimeRangeButtonClick('week')}>Week</button>
        <button onClick={() => handleTimeRangeButtonClick('month')}>Month</button>
        <button onClick={() => handleTimeRangeButtonClick('year')}>Year</button>
        <button
  onClick={() => handleTimeRangeButtonClick('custom')}
  style={{ width: '20px', height: '25px', background: 'transparent', border: 'none', paddingTop:'5px'}}
>
  {showStartDatePicker && (
    <DatePicker
      selected={customStartDate}
      onChange={handleCustomStartDateChange}
      customInput={<img src="calendaricon.png" alt="Calendar Icon" style={{ width: '350%', height: '350%' }} />}
    />
  )}
  {showEndDatePicker && dateRange.startDate && (
    <DatePicker
      selected={dateRange.endDate}
      onChange={handleCustomEndDateChange}
      minDate={customStartDate}
      customInput={<img src="calendaricon.png" alt="Calendar" style={{ width: '700%', height: '700%' }} />}
    />
  )}
</button>
      </div>
      <canvas id="soilMoistureChart"></canvas>
    </div>
  );
};

export default SoilMoistureChart
