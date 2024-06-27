import React, { useEffect, useState } from 'react';
import config from '../../config';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FormControl, Grid, Select, TextField } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const FeesPendingStudentsIndex = () => {
  const [stuData, setStuData] = useState([]);
  const [dataPerPage, setDataPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedVal, setSearchedVal] = useState('');

  useEffect(() => {
    axios.get(`${config.apiURL}/dashboard/feePendingStudents`)
      .then((res) => {
        setStuData(res.data);
      })
      .catch((err) => {
        console.log("Error fetching students data", err);
      });
  }, []);

  const handleChangeDataPerPage = (e) => {
    const newDataPerPage = parseInt(e.target.value, 10);
    setDataPerPage(newDataPerPage);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const search = (item) => {
    const searchValue = searchedVal.toLowerCase();
    return Object.values(item).some(
      (value) => value && value.toString().toLowerCase().includes(searchValue)
    );
  };

  const firstIndexOfData = (currentPage - 1) * dataPerPage;
  const lastIndexOfData = currentPage * dataPerPage;
  const currentData = stuData.slice(firstIndexOfData, lastIndexOfData);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  return (
    <div>
      <h1 className='text-center'>Pending Students</h1>
      <Grid container spacing={3}>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <TextField label="Search" onChange={(e) => setSearchedVal(e.target.value)} value={searchedVal} />
        </Grid>
        <Grid item xs={4}>
          <FormControl>
            <Select value={dataPerPage} onChange={handleChangeDataPerPage}>
              <option value={5}>5 Per Page</option>
              <option value={10}>10 Per Page</option>
              <option value={15}>15 Per Page</option>
              <option value={20}>20 Per Page</option>
              <option value={0}>All Per Page</option>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <TableContainer component={Paper} className='mt-3'>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>S.no</StyledTableCell>
              <StyledTableCell align="right">Student name</StyledTableCell>
              <StyledTableCell align="right">Student Image</StyledTableCell>
              <StyledTableCell align="right">Roll Number</StyledTableCell>
              <StyledTableCell align="right">Class Name</StyledTableCell>
              <StyledTableCell align="right">Section Name</StyledTableCell>
              <StyledTableCell align="right">Fees Category</StyledTableCell>
              <StyledTableCell align="right">Fees Amount</StyledTableCell>
              <StyledTableCell align="right">Discount Amount</StyledTableCell>
              <StyledTableCell align="right">Remaining Amount</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.filter(search).map((stu, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>{firstIndexOfData + index + 1}</StyledTableCell>
                <StyledTableCell align="right">{stu.stu_name}</StyledTableCell>
                <StyledTableCell align="right">
                  <img src={stu.stu_img} alt={stu.stu_name} height='50' width='50' />
                </StyledTableCell>
                <StyledTableCell align="right">{stu.roll_no}</StyledTableCell>
                <StyledTableCell align="right">{stu.cls_name}</StyledTableCell>
                <StyledTableCell align="right">{stu.sec_name}</StyledTableCell>
                <StyledTableCell align="right">{stu.fee_category}</StyledTableCell>
                <StyledTableCell align="right">{stu.amount}</StyledTableCell>
                <StyledTableCell align="right">{stu.discount_amount}</StyledTableCell>
                <StyledTableCell align="right">{stu.remaining_amount}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container spacing={1} display='flex' justifyContent='center' className='mt-3'>
      <Stack spacing={2}>
        <Pagination count={Math.ceil(stuData.length / dataPerPage)} page={currentPage} onChange={handlePageChange} variant="outlined" />
      </Stack>
      </Grid>
    </div>
  );
};

export default FeesPendingStudentsIndex;
