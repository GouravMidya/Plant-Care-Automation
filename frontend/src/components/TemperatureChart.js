import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Chart from 'react-apexcharts'; // Add this import
import { startOfToday, addWeeks, addMonths, addYears,addHours } from 'date-fns';
import 'chartjs-adapter-date-fns';
import 'react-date-range/dist/styles.css';
import 'react-datepicker/dist/react-datepicker.css';


const TemperatureChart = ({ deviceId }) => {
  // State variables
  const [state, setState] = useState({
    options: {
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: [] // Empty initially, will be filled with time ranges
      },
      colors: ['#b4757a']
    },
    series: [
      {
        name: "Temperature",
        data: [] // Empty initially, will be filled with Temperature moisture values
      }
    ]
  });

  const [timeRange, setTimeRange] = useState('day');
  const [customStartDate, setCustomStartDate] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  // Function to fetch Temperature data
  const fetchTemperatureData = async () => {
    try {
      let startDate, endDate;
      const today = startOfToday();
      switch (timeRange) {
        case 'day':
          startDate = addHours(new Date(), -24);
          endDate = new Date();
          break;
        case 'week':
          startDate = addWeeks(today, -1);
          endDate = new Date();
          break;
        case 'month':
          startDate = addMonths(today, -1);
          endDate = new Date();
          break;
        case 'year':
          startDate = addYears(today, -1);
          endDate = new Date();
          break;
        case 'custom':
          startDate = customStartDate ? customStartDate : new Date();
          endDate = dateRange.endDate;
          break;
        default:
          startDate = addMonths(today, -1);
          endDate = new Date();
      }

      // Format dates for API request
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];
      let endpoint = '/sensor_readings/avgtemp';
      if (timeRange === 'day') {
        endpoint = '/sensor_readings/avgtemp';
      }
      console.log("Dates are")
      console.log(formattedStartDate,formattedEndDate)
      const response = await fetch(
        `${endpoint}?deviceId=${deviceId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      );

      const data = await response.json();
      const categories = [];
      const temperatureData = [];

      data.data.forEach(item => {
        categories.push(item.timeRange);
        temperatureData.push(parseFloat(item.temperature));
      });

      setState(prevState => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: categories
          }
        },
        series: [
          {
            name: "Temperature",
            data: temperatureData
          }
        ]
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Effect to fetch data based on changes in deviceId, timeRange, and dateRange
  useEffect(() => {
    fetchTemperatureData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId, timeRange, dateRange, customStartDate]);

  // Event handler for time range buttons
  const handleTimeRangeButtonClick = (range) => {
    setTimeRange(range);
    if (range !== 'custom') {
      setCustomStartDate(null);
      setDateRange({ startDate: new Date(), endDate: new Date() });
    }
  };

  // Event handler for custom start date change
  const handleCustomStartDateChange = (date) => {
    setCustomStartDate(date);
    setDateRange({ ...dateRange, startDate: date });
  };

  // Event handler for custom end date change
  const handleCustomEndDateChange = (date) => {
    setDateRange({ ...dateRange, endDate: date });
  };

  return (
    <div>
      {/* Time range buttons and custom date range pickers */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '4px', border: '1px solid #000', marginTop: '80px' }}>
        <h4 style={{ marginTop: '0px', marginBottom: '-10px', marginRight: '0px' }}>Temperature Chart</h4>
        <button style={{ marginRight: '4px' }} onClick={() => handleTimeRangeButtonClick('day')}>Day</button>
        <button style={{ marginRight: '4px' }} onClick={() => handleTimeRangeButtonClick('week')}>Week</button>
        <button style={{ marginRight: '4px' }} onClick={() => handleTimeRangeButtonClick('month')}>Month</button>
        <button style={{ marginRight: '4px' }} onClick={() => handleTimeRangeButtonClick('year')}>Year</button>
        <button style={{ marginRight: '4px' }} onClick={() => handleTimeRangeButtonClick('custom')}>Custom</button> {/* Changed to handle 'custom' button */}
      </div>
      {/* Chart component */}
      <Chart
        options={state.options}
        series={state.series}
        type="area"
        width="550"
      />
    </div>
  );
};

export default TemperatureChart;
