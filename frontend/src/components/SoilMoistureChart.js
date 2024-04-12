import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Chart from 'react-apexcharts'; // Add this import
import {addWeeks, addMonths, addYears} from 'date-fns';
import DatePicker from 'react-datepicker'; // Add this import
import { addHours } from 'date-fns';
import { Button, Box, Grid, Typography, useTheme, useMediaQuery } from '@mui/material';
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

const SoilMoistureChart = ({ deviceId }) => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const theme = useTheme();
  const isXSmallScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.only('md'));

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
        id: "basic-bar",
      },
      xaxis: {
        categories: [],
      },
      stroke: {
        width: [3,3],
        curve: 'smooth',
        dashArray: [['straight'],[7]]
      },
      yaxis: {
        title: {
          text: 'Soil Moisture (%)',
        },
      },
      colors: ['#80ed99', '#ff4d6d'], // Add a different color for null values
      dataLabels: {
        enabled: false,
      },
      legend: { show: false },
    },
    series: [
      {
        name: "Soil Moisture",
        data: [],
      },
      {
        name: "Null Values", // Add a new series for null values
        data: [],
      },
    ],
  });

  const [timeRange, setTimeRange] = useState('day');
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(true);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchSoilMoistureData = async () => {
    try {
      let startDate, endDate;
      const today = new Date();
      switch (timeRange) {
        case 'day':
          startDate = addHours(new Date(today), -24);
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
      const response = await axios.get(`${endpoint}?deviceId=${deviceId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
  
      const data = response.data;
      const categories = [];
      const soilMoistureData = [];
      const nullValuesData = [];

      if (timeRange === 'day') {
        data.data.forEach((item) => {
          if (item.timeRange % 3 === 0) {
            categories.push(item.timeRange + ':00');
          } else {
            categories.push("");
          }
        });
      }
      if (categories.length === 0) {
        data.data.forEach((item) => {
          if (item.timeRange % 3 === 0) {
            categories.push(item.timeRange + ':00');
          } else {
            categories.push("");
          }
        });
      }

      let prevSoilMoisture = 0;
      let flag=0;
      let flag2=0;
      data.data.forEach((item, index) => {
        const currentSoilMoisture = parseFloat(item.soilMoisture);
        if (currentSoilMoisture === 0) {
          if (flag===0){
            flag=1;
            soilMoistureData.push(prevSoilMoisture);
          }
          else{
            soilMoistureData.push(null); // Push null for 0 values
            flag2=0;
          }
          nullValuesData.push(prevSoilMoisture); // Store the index for null values
        } else {
          if (flag2===0){
            nullValuesData.push(currentSoilMoisture);
            flag2=1;
            flag=0;
            soilMoistureData.push(currentSoilMoisture);
            prevSoilMoisture=currentSoilMoisture;
          }
          else{
            nullValuesData.push(null);
            flag=0;
            soilMoistureData.push(currentSoilMoisture);
            prevSoilMoisture=currentSoilMoisture;
          }  
        }
      });

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: categories,
            title: {
              text: `Time Range : ${startDate.getDate()}-${startDate.getMonth() + 1}-${startDate.getFullYear()} to ${endDate.getDate()}-${endDate.getMonth() + 1}-${endDate.getFullYear()}`,
            },
          },
          
        },
        series: [
          {
            name: 'Soil Moisture',
            data: soilMoistureData,
          },
          {
            name: 'Null Values',
            data: nullValuesData,
          },
        ],
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchSoilMoistureData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId, timeRange, dateRange, customStartDate]);

  const handleTimeRangeButtonClick = (range) => {
    setTimeRange(range);
    // Reset custom date picker when another option is selected
    if (range !== 'custom') {
      setShowDatePicker(false);
      setCustomStartDate(null);
      setCustomEndDate(null);
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
      setCustomEndDate(endDateWithTime);
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
    

export default SoilMoistureChart;