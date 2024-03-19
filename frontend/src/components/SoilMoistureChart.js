import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Chart from 'react-apexcharts'; // Add this import
import { startOfToday, addWeeks, addMonths, addYears,  addHours } from 'date-fns';
import DatePicker from 'react-datepicker'; // Add this import
import { DateRangePicker } from 'react-date-range';

const SoilMoistureChart = ({ deviceId }) => {
  // State variables
  const [state, setState] = useState({
    options: {
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: [] // Empty initially, will be filled with time ranges
      },
      colors:['#7d947e']
    },
    series: [
      {
        name: "Soil Moisture",
        data: [] // Empty initially, will be filled with soil moisture values
      }
    ]
  });

  const [timeRange, setTimeRange] = useState('day');
  
  const [customStartDate, setCustomStartDate] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  // State to control the visibility of the start and end date pickers
  const [showStartDatePicker, setShowStartDatePicker] = useState(true);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Function to fetch soil moisture data
  const fetchSoilMoistureData = async () => {
    try {
      let startDate, endDate;
      const today=new Date();
      switch (timeRange) {
        case 'day':
          startDate = addHours(today, -24);
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

      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();
      let endpoint = '/sensor_readings/avgsoilmoisture';
      if (timeRange=='day'){
        endpoint = '/sensor_readings/avgsoilmoisture';
      }
      console.log("Dates are")
      console.log(formattedStartDate,formattedEndDate)
      const response = await fetch(
        `${endpoint}?deviceId=${deviceId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      );

      const data = await response.json();
      const categories = [];
      const soilMoistureData = [];
      console.log(soilMoistureData)
      data.data.forEach(item => {
        categories.push(item.timeRange);
        soilMoistureData.push(parseFloat(item.soilMoisture));
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
            name: "Soil Moisture",
            data: soilMoistureData
          }
        ]
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Effect to fetch data based on changes in deviceId, timeRange, and dateRange
  useEffect(() => {
    fetchSoilMoistureData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId, timeRange, dateRange, customStartDate]);

  // Event handler for time range buttons
  const handleTimeRangeButtonClick = (range) => {
    setTimeRange(range);
  };

  const handleCustomStartDateChange = (date) => {
    // Set the start time to 00:00:00
    const startDateWithTime = new Date(date);
    startDateWithTime.setHours(0, 0, 0, 0);
  
    setCustomStartDate(startDateWithTime);
    setDateRange({ ...dateRange, startDate: startDateWithTime, endDate: null });
    setShowStartDatePicker(false);
    setShowEndDatePicker(true);
  };
  
  const handleCustomEndDateChange = (date) => {
    // Set the end time to 23:59:59
    const endDateWithTime = new Date(date);
    endDateWithTime.setHours(23, 59, 59, 999);
  
    if (endDateWithTime > customStartDate) {
      setDateRange({ ...dateRange, endDate: endDateWithTime });
      setShowEndDatePicker(false);
      setShowStartDatePicker(true);
    }
  };
  return (
    <div>
      {/* Time range buttons and custom date range pickers */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '4px', border: '1px solid #000', marginTop: '80px' }}>
        <h4 style={{ marginTop: '0px', marginBottom: '-10px', marginRight: '0px' }}>Soil Moisture Chart</h4>
        <button style={{ marginRight: '4px' }} onClick={() => handleTimeRangeButtonClick('day')}>Day</button>
        <button style={{ marginRight: '4px' }} onClick={() => handleTimeRangeButtonClick('week')}>Week</button>
        <button style={{ marginRight: '4px' }} onClick={() => handleTimeRangeButtonClick('month')}>Month</button>
        <button style={{ marginRight: '4px' }} onClick={() => handleTimeRangeButtonClick('year')}>Year</button>
        <button 
          onClick={() => handleTimeRangeButtonClick('custom')}
          style={{
            width: '20px',
            height: '25px',
            background: 'transparent',
            border: 'none',
            paddingTop: '0px',
            marginRight:'20px',
            marginTop: '-2px',
          }}
        >
          {showStartDatePicker && (
            <DatePicker
              selected={customStartDate}
              onChange={handleCustomStartDateChange}
              customInput={<img src="calendaricon.png" alt="Calendar Icon" style={{ width: '350%', height: '350%'}} />}
              style={{ marginLeft: '10px' }}/>
          )}
          {showEndDatePicker && dateRange.startDate && (
            <DatePicker
              selected={dateRange.endDate}
              onChange={handleCustomEndDateChange}
              minDate={customStartDate}
              customInput={<img src="calendaricon.png" alt="Calendar Icon" style={{ width: '350%', height: '350%'}} />}
              style={{ marginLeft: '10px' }}/>
          )}
        </button>
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

export default SoilMoistureChart;
