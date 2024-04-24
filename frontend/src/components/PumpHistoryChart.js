import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Chart from 'react-apexcharts';
import { API_URL } from '../utils/apiConfig';
import axios from 'axios';
import { Box, Grid, Typography, Button } from '@mui/material'; // Import Material-UI components
import { styled } from '@mui/material/styles';
import DateRangeIcon from '@mui/icons-material/DateRange'; // Import DateRangeIcon
import DatePicker from 'react-datepicker';

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  marginRight: theme.spacing(1),
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
  },
}));

const PumpHistoryChart = ({ deviceId }) => {
  const [frequencyData, setFrequencyData] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [timeRange, setTimeRange] = useState('day');
  const [options, setOptions] = useState({
    chart: {
      type: 'bar',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '90%',
        colors: {
          ranges: [{
            from: 0,
            to: 100,
            color: '#80ed99' // Green color
          }]
        },
      },
    },
    xaxis: {
      type: 'string',
      categories: [],
      title: {
        text: 'Time',
      },
      tickPlacement: 'on',
      labels: {
        rotate: -45,
      },
      axisTicks: {
        show: true,
        placement: 'on',
        alignWithLabels: true, // To align the ticks with the labels
      },
      tickAmount: 12, // Display only every third tick
    },
    yaxis: {
      title: {
        text: 'Frequency',
      },
    },
    tooltip: {
      x: {
        formatter: function(val) {
          const hours = Math.floor(val);
          const start = `${hours-1}:00`;
          const end = `${hours }:00`;
          return `${start} to ${end}`;
        }
      },
      y: {
        formatter: function(val) {
          return `Frequency: ${val}`; // Update this line
        }
      }
    }
  });

  useEffect(() => {
    fetchPumpHistoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId, timeRange, customStartDate, customEndDate]);

  const fetchPumpHistoryData = async () => {
    try {
      let startDate, endDate;
      const todayUTC = new Date();
      switch (timeRange) {
        case 'day':
          startDate = new Date(todayUTC);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(todayUTC);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'week':
          startDate = new Date(todayUTC);
          startDate.setDate(startDate.getDate() - 7);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(todayUTC);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'month':
          startDate = new Date(todayUTC);
          startDate.setMonth(startDate.getMonth() - 1);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(todayUTC);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'year':
          startDate = new Date(todayUTC);
          startDate.setFullYear(startDate.getFullYear() - 1);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(todayUTC);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'custom':
          startDate = customStartDate || todayUTC;
          endDate = customEndDate || todayUTC;
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          break;
        default:
          startDate = new Date(todayUTC);
          startDate.setMonth(startDate.getMonth() - 1);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(todayUTC);
          endDate.setHours(23, 59, 59, 999);
      }

      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();
      const endpoint = `${API_URL}/pump/history`;

      const params = {
        deviceId,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };
      const response = await axios.get(endpoint, { params });

      const data = response.data.data;
      const categories = data.map(item => {
        return item.time;
      });

      setFrequencyData(data.map(item => ({ x: item.time, y: item.frequency })));

      setOptions(prevOptions => ({
        ...prevOptions,
        xaxis: {
          ...prevOptions.xaxis,
          categories: categories,
        },
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleTimeRangeButtonClick = (range) => {
    setTimeRange(range);
    setShowDatePicker(range === 'custom');
  };

  const handleCustomStartDateChange = (date) => {
    setCustomStartDate(date);
  };

  const handleCustomEndDateChange = (date) => {
    setCustomEndDate(date);
  };

  return (
    <div>
      <Box sx={{ padding: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
        <Grid sx={{ padding: 1 }} container alignItems="center" spacing={2}>
          <Grid item>
            <Box>
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
                    fontSize: '0.9rem',
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
                    <Typography
                      padding="0.3rem"
                      variant="body1"
                      sx={{
                        mx: 1,
                        fontSize: '0.9rem',
                      }}
                    >
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
        <Chart options={options} series={[{ data: frequencyData }]} type="bar"  />
      </Box>
    </div>
  );
};

export default PumpHistoryChart;
