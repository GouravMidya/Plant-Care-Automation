import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Chart from 'react-apexcharts'; // Add this import
import {addWeeks, addMonths, addYears} from 'date-fns';
import DatePicker from 'react-datepicker'; // Add this import
import { addHours } from 'date-fns';
import { Button, Box} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { styled } from '@mui/material/styles';
import { API_URL } from '../utils/apiConfig';
import axios from 'axios';


const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  marginRight: theme.spacing(1),
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
  },
}));

const TemperatureChart = ({ deviceId }) => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  // State variables
  const [state, setState] = useState({
    options: {
      chart: {
        toolbar: {
          tools: {
            download: true, 
            selection: false,
            zoom: false,
            zoomin: true ,
            zoomout: true,
            pan: true,
            reset: true | '<img src="/static/icons/reset.png" width="40">',
          },
        },
        id: "basic-bar"
      },
      xaxis: {
        
        categories: [] // Empty initially, will be filled with time ranges
      },
      stroke: {
        width: [3,3],
        curve: 'smooth',
        dashArray: [['straight'],[7]]
      },
      yaxis: {
        title: {
          text: 'Temperature' // Label for the Y-axis
        }
      },
      colors: ['#80ed99', '#ff4d6d'],
      dataLabels: {
        enabled: false  // Hide the data points
      },
      legend: { show: false }
    },
    series: [
      {
        name: "Temperature",
        data: [] // Empty initially, will be filled with Temperature moisture values
      },
      {
        name: "Null Values", // Add a new series for null values
        data: [],
      },
    ]
  });

  const [timeRange, setTimeRange] = useState('day');
  const [customStartDate, setCustomStartDate] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(true);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Function to fetch Temperature data
  const fetchTemperatureData = async () => {
    try {
      let startDate, endDate;
      const today = new Date();
      switch (timeRange) {
        case 'day':
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
      
      let endpoint = `${API_URL}/sensor_readings/avgtemp`;
      if (timeRange === 'day') {
        endpoint = `${API_URL}/sensor_readings/alltemp`;
      }
      const response = await axios.get(`${endpoint}?deviceId=${deviceId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
  
      const data = response.data;
      const categories = [];
      const temperatureData = [];
      const nullValuesData = [];

      if (timeRange === 'day') {
        // Generate categories representing each hour of the past day
          data.data.forEach((item) => {
            if(item.timeRange%3===0){
              categories.push(item.timeRange+':00');
            }
            else{
              categories.push("");
            }
          });
        
      } 
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

      let prevTemperature = 0;
      let flag=0;
      let flag2=0;
      
      data.data.forEach((item, index) => {
        const currentTemperature = parseFloat(item.temperature);
        if (currentTemperature === 0 && prevTemperature) {
          if (flag===0){
            flag=1;
            temperatureData.push(prevTemperature);
          }
          else{
            temperatureData.push(null); // Push null for 0 values
            flag2=0;
          }
          nullValuesData.push(prevTemperature); // Store the index for null values
        } else {
          if (flag2===0){
            nullValuesData.push(currentTemperature);
            flag2=1;
            flag=0;
            temperatureData.push(currentTemperature);
            prevTemperature=currentTemperature;
          }
          else{
            nullValuesData.push(null);
            flag=0;
            temperatureData.push(currentTemperature);
            prevTemperature=currentTemperature;
          }  
        }
      });

      setState(prevState => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: categories,
            title: {
              text: `Time Range : ${startDate.getDate()}-${startDate.getMonth() + 1}-${startDate.getFullYear()} to ${endDate.getDate()}-${endDate.getMonth() + 1}-${endDate.getFullYear()}`,
            },
          }
        },
        series: [
          {
            name: "Temperature",
            data: temperatureData
          },
          {
            name: 'Null Values',
            data: nullValuesData,
          },
        ]
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  useEffect(() => {
    fetchTemperatureData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId, timeRange, dateRange, customStartDate]);

  const handleTimeRangeButtonClick = (range) => {
    setTimeRange(range);
  };

  const handleCustomStartDateChange = (date) => {
    const startDateWithTime = new Date(date);
    startDateWithTime.setHours(0, 0, 0, 0);
    setCustomStartDate(startDateWithTime);
    setDateRange({ ...dateRange, startDate: startDateWithTime, endDate: null });
    setShowStartDatePicker(false);
    setShowEndDatePicker(true);
  };

  const handleCustomEndDateChange = (date) => {
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
      <Box sx={{ padding: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <StyledButton
            className={timeRange === 'day' ? 'Mui-selected' : ''}
            onClick={() => handleTimeRangeButtonClick('day')}
          >
            Day
          </StyledButton>
          <StyledButton
            className={timeRange === 'month' ? 'Mui-selected' : ''}
            onClick={() => handleTimeRangeButtonClick('month')}
          >
            Month
          </StyledButton>
          <StyledButton
            className={timeRange === 'year' ? 'Mui-selected' : ''}
            onClick={() => handleTimeRangeButtonClick('year')}
          >
            Year
          </StyledButton>
          <StyledButton
              onClick={() => handleTimeRangeButtonClick('custom')}
            > 
              <span style={{ marginRight: '5px' }}>
                {showStartDatePicker && (
                  <DatePicker
                    selected={customStartDate}
                    onChange={handleCustomStartDateChange}
                    customInput={<CalendarTodayIcon />}
                    style={{ marginLeft: '10px' }}
                  />
                )}
              </span>
              {showEndDatePicker && dateRange.startDate && (
                <DatePicker
                  selected={dateRange.endDate}
                  onChange={handleCustomEndDateChange}
                  minDate={customStartDate}
                  customInput={<CalendarTodayIcon />}
                  style={{ marginLeft: '10px' }}
                />
              )}
      </StyledButton>
          
        </Box>
      {/* Chart component */}
      <Chart
        options={state.options}
        series={state.series}
        type="area"
      />
      </Box>
    </div>
    
  );
  
};

export default TemperatureChart;
