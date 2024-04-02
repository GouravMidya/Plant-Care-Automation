import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Chart from 'react-apexcharts'; // Add this import
import { addWeeks, addMonths, addYears} from 'date-fns';
import DatePicker from 'react-datepicker'; // Add this import
import { addHours } from 'date-fns';

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
      yaxis: {
        title: {
          text: 'Temperature' // Label for the Y-axis
        }
      },
      colors: ['#b4757a'],
      dataLabels: {
        enabled: false  // Hide the data points
      }
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

  // State to control the visibility of the start and end date pickers
  const [showStartDatePicker, setShowStartDatePicker] = useState(true);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Function to fetch Temperature data
  const fetchTemperatureData = async () => {
    try {
      let startDate, endDate;
      const today = new Date();
      switch (timeRange) {
        case 'day':
          // Calculate start date as 24 hours ago from now
          startDate = addHours(new Date(today),-24);
          startDate.setMinutes(0);
          endDate = new Date(today);// End date is current time
          endDate.setMinutes(0);
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
      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();
      
      let endpoint = '/sensor_readings/avgtemp';
      if (timeRange === 'day') {
        endpoint = '/sensor_readings/alltemp';
      }
      
      const response = await fetch(
        `${endpoint}?deviceId=${deviceId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      );

      const data = await response.json();
      const categories = [];
      const temperatureData = [];
      let flag=startDate.getHours();
      if (timeRange === 'day') {
        // Generate categories representing each hour of the past day
          data.data.forEach((item) => {
            if(item.timeRange%3===0){
              flag+=1;
              categories.push((flag%24)+':00');
            }
            else{
              flag+=1;
              categories.push("");
            }
          });
        
      } 
      flag=0;
      if(categories.length===0){
        data.data.forEach((item) => {
          if(item.timeRange%3===0){
            categories.push(item.timeRange+':00');
          }
          else{
            categories.push("");
          }
        });
      }


      let prevTemperature = null;// Initialize previous soil moisture value
      data.data.forEach(item => {
        let currentTemperature = parseFloat(item.temperature);
        if (currentTemperature === 0 && prevTemperature !== null) {
          currentTemperature=prevTemperature;
          temperatureData.push (currentTemperature); // Push previous value
        } else {
            temperatureData.push(currentTemperature); // Push current value
        }
        prevTemperature = currentTemperature; // Update previous value
    });

      setState(prevState => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            title: {
              text: `Time Range : `+startDate.getDate()+"-"+(startDate.getMonth()+1)+"-"+startDate.getFullYear()+" to "+endDate.getDate()+"-"+(endDate.getMonth()+1)+"-"+endDate.getFullYear()
            },
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
  };

  // Event handler for custom start date change
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
      <h4 style={{ marginTop: '0px', marginBottom: '-10px', marginRight: '0px' }}>Temperature Chart</h4>
        {/* DAY BUTTON */}
        <button
          style={{
            marginRight: '4px',
            backgroundColor: timeRange === 'day' ? 'black' : 'transparent', // Set color based on time range
            color: timeRange === 'day' ? 'white' : 'black' // Adjust text color accordingly
          }}
          onClick={() => handleTimeRangeButtonClick('day')}
        >
          Day
        </button>
        
        {/* WEEK BUTTON */}
        {/* <button
          style={{
            marginRight: '4px',
            backgroundColor: timeRange === 'week' ? 'black' : 'transparent',
            color: timeRange === 'week' ? 'white' : 'black'
          }}
          onClick={() => handleTimeRangeButtonClick('week')}
        >
          Week
        </button> */}

        {/* MONTH BUTTON */}
        <button
          style={{
            marginRight: '4px',
            backgroundColor: timeRange === 'month' ? 'black' : 'transparent',
            color: timeRange === 'month' ? 'white' : 'black'
          }}
          onClick={() => handleTimeRangeButtonClick('month')}
        >
          Month
        </button>

        {/* YEAR BUTTON */}
        <button
          style={{
            marginRight: '4px',
            backgroundColor: timeRange === 'year' ? 'black' : 'transparent',
            color: timeRange === 'year' ? 'white' : 'black'
          }}
          onClick={() => handleTimeRangeButtonClick('year')}
        >
          Year
        </button>
        
        {/* CUSTOM BUTTON */}
        <button
          onClick={() => handleTimeRangeButtonClick('custom')}
          style={{
            width: '80px',
            height: '30px',
            background: 'transparent', // Set a background color
            border: '0px solid #000', // Add a border
            borderRadius: '5px', // Optional: Add border-radius for rounded corners
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '20px',
            marginTop: '-2px',
          }}
        >
          <span style={{ marginRight: '5px' }}>
            {showStartDatePicker && (
              <DatePicker
                selected={customStartDate}
                onChange={handleCustomStartDateChange}
                customInput={<img src="calendaricon.png" alt="Calendar Icon" style={{ width: '100%', height: '100%' }} />}
                style={{ marginLeft: '10px' }}
              />
            )}
          </span>
          {showEndDatePicker && dateRange.startDate && (
            <DatePicker
              selected={dateRange.endDate}
              onChange={handleCustomEndDateChange}
              minDate={customStartDate}
              customInput={<img src="calendaricon.png" alt="Calendar Icon" style={{ width: '100%', height: '100%' }} />}
              style={{ marginLeft: '10px' }}
            />
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

export default TemperatureChart;
