import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Chart from 'react-apexcharts';
import { addWeeks, addMonths, addYears, addHours } from 'date-fns';
import DatePicker from 'react-datepicker';
import { Button, Box, Typography, Grid } from '@mui/material';
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

const PumpHistoryChart = ({ deviceId }) => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const [state, setState] = useState({
    options: {
      chart: {
        toolbar: {
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true | '<img src="/static/icons/reset.png" width="40">',
          },
        },
        id: 'pump-history-chart',
      },
      xaxis: {
        type: 'datetime',
        categories: [],
      },
      yaxis: {
        title: {
          text: 'Threshold',
        },
      },
      markers: {
        size: [], // Empty array for dynamic marker sizes
      },
    },
    series: [
      {
        name: 'Pump History',
        data: [],
      },
    ],
  });

  const [timeRange, setTimeRange] = useState('day');
  const [customStartDate, setCustomStartDate] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(true);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customEndDate] = useState(null);

  const fetchPumpHistoryData = async () => {
    try {
      let startDate, endDate;
      const todayUTC = new Date();
      switch (timeRange) {
        case 'day':
          startDate = addHours(todayUTC, -23);
          endDate = todayUTC;
          break;
        case 'week':
          startDate = addWeeks(todayUTC, -1);
          endDate = todayUTC;
          break;
        case 'month':
          startDate = addMonths(todayUTC, -1);
          endDate = todayUTC;
          break;
        case 'year':
          startDate = addYears(todayUTC, -1);
          endDate = todayUTC;
          break;
        case 'custom':
          startDate = customStartDate || todayUTC;
          endDate = customEndDate || todayUTC;
          endDate.setHours(0);
          startDate.setMinutes(0);
          endDate.setMinutes(59);
          endDate.setHours(23);
          break;
        default:
          startDate = addMonths(todayUTC, -1);
          endDate = todayUTC;
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

      const data = response.data;
      const categories = [];
      const pumpHistoryData = [];
      const markerSizes = [];

      data.data.forEach((item) => {
        const timestamp = new Date(item.timestamp).getTime(); // Get the timestamp
        const markerSize = isNaN(item.pumpDuration) ? 0 : item.pumpDuration;
        markerSizes.push(markerSize); // Collect marker sizes for all data points
        console.log(markerSizes);
        pumpHistoryData.push({
          x: timestamp,
          y: item.threshold || 70,
          marker: {
            size: markerSize,
          },
        });
      });

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            type: 'datetime', // Set the x-axis type to datetime
            labels: {
              formatter: function(value) {
                // Format the value to display as time
                return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
              }
            }
          },
          markers: {
            size: markerSizes, // Assign collected marker sizes to options
          },
        },
        series: [
          {
            name: 'Pump History',
            data: pumpHistoryData,
          },
        ],
      }));
           
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchPumpHistoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId, timeRange, dateRange, customStartDate]);

  const handleTimeRangeButtonClick = (range) => {
    setTimeRange(range);
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
        <Chart options={state.options} series={state.series} type="scatter" height={400} />
      </Box>
    </div>
  );
};

export default PumpHistoryChart;
