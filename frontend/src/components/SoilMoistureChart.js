import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Chart from 'react-apexcharts'; // Add this import
import {addWeeks, addMonths, addYears, set} from 'date-fns';
import DatePicker from 'react-datepicker'; // Add this import
import { addHours } from 'date-fns';
import { Button, Box, IconButton, Typography } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { styled } from '@mui/material/styles';
import 'react-datepicker/dist/react-datepicker.css';
import { API_URL } from '../utils/apiConfig';

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  marginRight: theme.spacing(1),
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: 0,
  '&:hover': {
    backgroundColor: 'transparent',
  },
}));

const SoilMoistureChart = ({ deviceId }) => {
  
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

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
          text: 'Soil Moisture' // Label for the Y-axis
        }
      },
      colors:['#7d947e'],
      dataLabels: {
        enabled: false  // Hide the data points
      }
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
  const [customRangeLabel, setCustomRangeLabel] = useState('Custom ');
  // State to control the visibility of the start and end date pickers
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [flag, setFlag] = useState(true);
  const fetchSoilMoistureData = async () => {
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
      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();
      // Fetch data from the appropriate endpoint based on time range
      let endpoint = `${API_URL}/sensor_readings/avgsoilmoisture`;
      if (timeRange === 'day') {
        endpoint = `${API_URL}/sensor_readings/allsoilmoisture`;
      }
  
      const response = await fetch(
        `${endpoint}?deviceId=${deviceId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      );
  
      const data = await response.json();
      const categories = [];
      const soilMoistureData = [];
      
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
      let prevSoilMoisture = null; // Initialize previous soil moisture value

      data.data.forEach((item) => {
          let currentSoilMoisture = parseFloat(item.soilMoisture);
          if (currentSoilMoisture === 0 && prevSoilMoisture !== null) {
            currentSoilMoisture=prevSoilMoisture;
            soilMoistureData.push (currentSoilMoisture); // Push previous value
          } else {
              soilMoistureData.push(currentSoilMoisture); // Push current value
          }
          prevSoilMoisture = currentSoilMoisture; // Update previous value
      });
      
      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {

            title: {
              text: `Time Range : `+startDate.getDate()+"-"+(startDate.getMonth()+1)+"-"+startDate.getFullYear()+" to "+endDate.getDate()+"-"+(endDate.getMonth()+1)+"-"+endDate.getFullYear()
            },
            categories: categories,
          },
        },
        series: [
          {
            name: 'Soil Moisture',
            data: soilMoistureData,
          },
        ],
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  // Effect to fetch data based on changes in deviceId, timeRange, and dateRange
  useEffect(() => {
    setFlag(false);
    fetchSoilMoistureData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId, timeRange, dateRange, customStartDate]);

  // Event handler for time range buttons 
  const handleTimeRangeButtonClick = (range) => {
    if(customStartDate!==null & dateRange.endDate!==null ){
      setCustomRangeLabel("Custom");
    }
    else if(customStartDate!==null & dateRange.endDate===null){
      setCustomRangeLabel("End Date");
    }
    else{
      setCustomRangeLabel("StartDate");
    }
    setTimeRange(range);
  };

  const handleCustomStartDateChange = (date) => {
    // Set the start time to 00:00:00
    setCustomRangeLabel("End Date");
    const startDateWithTime = new Date(date);
    startDateWithTime.setHours(0, 0, 0, 0);
    setFlag(false);
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
      setShowStartDatePicker(false);
      setCustomRangeLabel("Custom");
      setFlag(false);
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
              <StyledButton
                onClick={() =>setShowStartDatePicker(true) }
              >{customRangeLabel}</StyledButton>
              
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

export default SoilMoistureChart;