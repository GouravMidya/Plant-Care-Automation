import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Chart from 'react-apexcharts'; // Add this import
import {addWeeks, addMonths, addYears,addHours} from 'date-fns';
import DatePicker from 'react-datepicker'; // Add this import
import { Button, Box,Typography, Grid} from '@mui/material';
import DateRangeIcon from '@mui/icons-material/DateRange';
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
            selection: true,
            zoom: true,
            download: true, 
            zoomin: false ,
            zoomout: false,
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
  const [ setShowStartDatePicker] = useState(true);
  const [setShowEndDatePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customEndDate] = useState(null);
  // Function to fetch Temperature data
  const fetchTemperatureData = async () => {
    try {
      let startDate, endDate;
      const todayUTC = new Date(); // Get current UTC date
      switch (timeRange) {
        case 'day':
          startDate = addHours(todayUTC, -24); // Subtract 24 hours in UTC
          startDate.setMinutes(0);
          endDate = todayUTC; // End date is current time in UTC
          endDate.setMinutes(0);
          break;
        case 'week':
          startDate = addWeeks(todayUTC, -1); // Subtract 1 week in UTC
          endDate = todayUTC;
          break;
        case 'month':
          startDate = addMonths(todayUTC, -1); // Subtract 1 month in UTC
          endDate = todayUTC;
          break;
        case 'year':
          startDate = addYears(todayUTC, -1); // Subtract 1 year in UTC
          endDate = todayUTC;
          break;
        case 'custom':
          startDate = customStartDate ? customStartDate : todayUTC; // Use custom start date or current UTC time
          endDate = customEndDate ? customEndDate : todayUTC;
          break;
        default:
          startDate = addMonths(todayUTC, -1); // Default to 1 month ago in UTC
          endDate = todayUTC;
      }

      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();

      let endpoint = `${API_URL}/sensor_readings/avgtemp`;
      if (timeRange === 'day') {
        endpoint = `${API_URL}/sensor_readings/alltemp`;
      }
      const response = await axios.get(`${endpoint}?deviceId=${deviceId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
      console.log(`${endpoint}?deviceId=${deviceId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
      
      const data = response.data;
      const categories = [];
      const temperatureData = [];
      const nullValuesData = [];

      if (timeRange === 'day') {
        // Generate categories representing each hour of the past day
          data.data.forEach((item) => {
            item.timeRange=(item.timeRange+6)%24;
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
        if (currentTemperature === 0 ) {
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
    // Reset custom date picker when another option is selected
    if (range !== 'custom') {
      setShowDatePicker(false);
      setCustomStartDate(null);
    } else {
      setShowDatePicker(true);
    }
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
    <Box sx={{ padding: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
    <Grid sx={{ padding: 1 }}container alignItems="center" spacing={2}>
    <Grid item>
    <Box >
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
    {!showDatePicker && (
    <StyledButton
    onClick={() => {
    setShowDatePicker(!showDatePicker);
    handleTimeRangeButtonClick('custom');
    }}
    >
    Custom
    </StyledButton>
    )}
    </Box>
    </Grid>
    {showDatePicker && (
    <Grid item>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Typography
    padding="0.1rem"
    variant="body1"

    sx={{
        mx: 1,
        fontSize:'0.9rem',
    }}
>
    Start Date:
</Typography>

    <DatePicker
    selected={customStartDate}
    onChange={handleCustomStartDateChange}
    customInput={<DateRangeIcon />}
    />
    {customStartDate && (
    <>
    <Typography padding="0.3rem" variant="body1" sx={{
        mx: 1,
        fontSize:'0.9rem',
    }}>
    End Date:
    </Typography>
    <DatePicker
    selected={customEndDate}
    onChange={handleCustomEndDateChange}
    minDate={customStartDate}
    customInput={<DateRangeIcon />}
    />
    </>
    )}
    </Box>
    </Grid>
    )}
    </Grid>
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
