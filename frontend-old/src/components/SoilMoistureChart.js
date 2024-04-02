import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Chart from 'react-apexcharts'; // Add this import
import {addWeeks, addMonths, addYears} from 'date-fns';
import DatePicker from 'react-datepicker'; // Add this import
import { addHours } from 'date-fns';
import { Button, Box, IconButton, Typography } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { styled } from '@mui/material/styles';
import 'react-datepicker/dist/react-datepicker.css';

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
  const [customRangeLabel, setCustomRangeLabel] = useState('Custom Date Range');
  // State to control the visibility of the start and end date pickers
  const [showStartDatePicker, setShowStartDatePicker] = useState(true);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

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
      let endpoint = '/sensor_readings/avgsoilmoisture';
      if (timeRange === 'day') {
        endpoint = '/sensor_readings/allsoilmoisture';
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
            console.log(currentSoilMoisture);
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
    fetchSoilMoistureData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId, timeRange, dateRange, customStartDate]);

  // Event handler for time range buttons 
  const handleTimeRangeButtonClick = (range) => {
    setTimeRange(range);
    if (range === 'custom') {
      setCustomRangeLabel('Start Date');
      setShowStartDatePicker(true);
      setShowEndDatePicker(false);
    } else {
      setCustomRangeLabel('Custom Date Range');
      setShowStartDatePicker(false);
      setShowEndDatePicker(false);
    }
  };

  const handleCustomStartDateChange = (date) => {
    const startDateWithTime = new Date(date);
    startDateWithTime.setHours(0, 0, 0, 0);
  
    setCustomStartDate(startDateWithTime);
    setDateRange({ ...dateRange, startDate: startDateWithTime, endDate: null });
    setCustomRangeLabel('End Date'); // Update the label to 'End Date'
    setShowStartDatePicker(false); // Hide the start date picker
    setShowEndDatePicker(true); // Show the end date picker
  };
  

  const handleCustomEndDateChange = (date) => {
    const endDateWithTime = new Date(date);
    endDateWithTime.setHours(23, 59, 59, 999);
  
    if (endDateWithTime > customStartDate) {
      setDateRange({ ...dateRange, endDate: endDateWithTime });
      setCustomRangeLabel('Custom Date Range'); // Reset the label to default
      setShowEndDatePicker(false); // Hide the end date picker
      setShowStartDatePicker(true); // Show the start date picker
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
            className={timeRange === 'custom' ? 'Mui-selected' : ''}
            onClick={() => handleTimeRangeButtonClick('custom')}
            startIcon={
              showStartDatePicker && (
                <StyledIconButton>
                  <DatePicker
                    selected={customStartDate}
                    onChange={handleCustomStartDateChange}
                    customInput={<CalendarTodayIcon />}
                  />
                </StyledIconButton>
              )
            }
            endIcon={
              showEndDatePicker && dateRange.startDate && (
                <StyledIconButton>
                  <DatePicker
                    selected={dateRange.endDate}
                    onChange={handleCustomEndDateChange}
                    minDate={customStartDate}
                    customInput={<CalendarTodayIcon />}
                  />
                </StyledIconButton>
              )
            }
          >
            <Typography onClick={() => handleTimeRangeButtonClick('custom')}>
              {customRangeLabel}
            </Typography>
          </StyledButton>
          
        </Box>
      {/* Chart component */}
      <Chart
        options={state.options}
        series={state.series}
        type="area"
        width="550"
      />
      </Box>
    </div>
    
  );
  
};

export default SoilMoistureChart;