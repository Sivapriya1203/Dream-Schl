import { useEffect, useState } from 'react';
import { Grid, Typography, Box, Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import config from '../../config';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import MainCard from 'components/MainCard';
import MonthlyBarChart from './MonthlyBarChart';
import UniqueVisitorCard from './UniqueVisitorCard';
import { Link } from 'react-router-dom';

export default function DashboardDefault() {
  const [studentsCount, setStudentsCount] = useState(0);
  const [staffsCount, setStaffsCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState();
  const [selectedYear,setSelectedYear] = useState('2024-2025')
  const [siblingCount,setSiblingCount] = useState();

  useEffect(() => {
    axios.get(`${config.apiURL}/dashboard/feePendingStudents`)
      .then((res) => {
        const count = res.data.length;
        setStudentsCount(count);
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
      });

    axios.get(`${config.apiURL}/staffs/getStaffs`)
      .then((res) => {
        const count = res.data.length;
        setStaffsCount(count);
      })
      .catch((error) => {
        console.error('Error fetching staff:', error);
      });
  }, []);

  useEffect(()=>{
    axios.get(`${config.apiURL}/dashboard/totalPaidAmount/${selectedYear}`)
      .then((res) => {
        setTotalRevenue(res.data);
      })
      .catch((error) => {
        console.error('Error fetching staff:', error);
      });
  },[])

  useEffect(()=>{
    axios.get(`${config.apiURL}/students/getSiblings`)
      .then((res) => {
        setSiblingCount(res.data);
        console.log("Sibling :",siblingCount)
      })
      .catch((error) => {
        console.error('Error fetching staff:', error);
      });
  },[])

  

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Link to='/feePendingStu'>
        <AnalyticEcommerce title="Total Pending Students" count={studentsCount} extra="35,000" /></Link>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Staffs" count={staffsCount}extra="8,900" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
  <AnalyticEcommerce
    title="Total revenue"
    count={totalRevenue ? `${totalRevenue.total_paid_amount}` : "Loading..."}
    // year={
    //   <FormControl sx={{ minWidth: 120 }}>
    //     {/* Dropdown for selecting year */}
    //     <InputLabel id="year-select-label">Year</InputLabel>
    //     <Select
    //       labelId="year-select-label"
    //       id="year-select"
    //       value={selectedYear}
    //       onChange={(e) => setSelectedYear(e.target.value)}
    //     >
    //       {/* Render your year options here */}
    //       <MenuItem value={'2024-2025'}>2024-2025</MenuItem>
    //       {/* Add other years as needed */}
    //     </Select>
    //   </FormControl>
    // }
    isLoss={false} // Assuming revenue is not a loss
    color="warning" // Adjust color as needed
    extra="1,943" // Additional information, you might want to change this based on actual data
  />
</Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Link to='/sibStu'>
        <AnalyticEcommerce title="Total profit" count={siblingCount ? `${siblingCount.siblingsCount}` : "Loading..."}  isLoss color="warning"  />
        </Link>
      </Grid>

      {/* row 2 */}
      <Grid item xs={12} md={7} lg={8}>
        <UniqueVisitorCard />
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Income Overview</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack spacing={2}>
              <Typography variant="h6" color="text.secondary">
                This Week Statistics
              </Typography>
             
            </Stack>
          </Box>
          <MonthlyBarChart />
        </MainCard>
      </Grid>
    </Grid>
  );
}
