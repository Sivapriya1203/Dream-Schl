import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AreaChart, Area, XAxis as XAxisArea, YAxis as YAxisArea, CartesianGrid as CartesianGridArea, Tooltip as TooltipArea } from 'recharts';
import config from '../../config'

// material-ui
import { useTheme } from '@mui/material/styles';

// Function to get the name of the month from a date string (e.g., "2024-06")
const getMonthName = (dateString) => {
  const date = new Date(dateString + '-01');
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return monthNames[date.getMonth()];
};

// ==============================|| INCOME AREA CHART ||============================== //

export default function IncomeAreaChart({ slot }) {
  const theme = useTheme();
  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    let endpoint;
    if (slot === 'month') {
      endpoint = `${config.apiURL}/dashboard/feesLogs/month`;
    } else {
      endpoint = `${config.apiURL}/dashboard/feesLogs/week`;
    }

    axios.get(endpoint)
      .then(response => {
        const newData = response.data.map(item => ({
          name: slot === 'month' ? getMonthName(item.month) : item.roll_no, // Use 'getMonthName' function to get the month name
          amount: parseFloat(item.amount),
        }));
        setChartData(newData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [slot]);

  const renderChart = () => {
    if (slot === 'month') {
      return (
        <ResponsiveContainer width="100%" height={450}>
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxisArea dataKey="name" />
            <YAxisArea />
            <TooltipArea />
            <Area type="monotone" dataKey="amount" stroke={theme.palette.primary.main} fillOpacity={0.3} fill={theme.palette.primary.main} />
          </AreaChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill={theme.palette.primary.main} />
          </BarChart>
        </ResponsiveContainer>
      );
    }
  };

  return renderChart();
}

IncomeAreaChart.propTypes = { slot: PropTypes.string };
