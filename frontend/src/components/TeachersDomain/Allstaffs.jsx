import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Dialog, DialogActions, DialogContent, FormControl, Grid, Select, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import UpdateStaff from './UpdateStaff'; // Assuming you have UpdateStaff component
import config from '../../config'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Add, Delete, Edit } from '@mui/icons-material';
function AllStaffs() {
  const [staffData, setStaffData] = useState([]);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [dlt, setDlt] = useState(false);
  const [updateData, setUpdateData] = useState();
  const [dataPerPage, setDataPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedVal, setSearchedVal] = useState('');

  useEffect(() => {
    Axios.get(`${config.apiURL}/staffs/getStaffs`)
      .then((res) => {
        setStaffData(res.data);
        console.log("Response data :", res.data);
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  }, [openUpdate, dlt]);

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

  const handleUpdate = (id) => {
    const selectData = staffData.find((staff) => staff.staff_id === id);
    if (selectData) {
      setUpdateData(selectData);
      setOpenUpdate(true);
    }
  };

  const handleDelete = (id) => {
    Axios.delete(`${config.apiURL}/staffs/deleteStaff/${id}`)
      .then((res) => {
        console.log("Deleted successfully :");
        setDlt(true);
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  };

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
  const currentData = staffData.slice(firstIndexOfData, lastIndexOfData);


  return (
    <div>
      
      <Grid container spacing={3}>
        <Grid item xs={4}>
        <Link to='/addStaff'><Button variant='contained' color='primary' startIcon={<Add/>}>Add</Button></Link>
        </Grid>
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
              <StyledTableCell align="right">Staff name</StyledTableCell>
              <StyledTableCell align="right">Staff image</StyledTableCell>
              <StyledTableCell align="right">Email</StyledTableCell>
              <StyledTableCell align="right">Mobile</StyledTableCell>
              <StyledTableCell align="right">Gender</StyledTableCell>
              <StyledTableCell align="right">Qualification</StyledTableCell>
              <StyledTableCell align="right">Experience</StyledTableCell>
              <StyledTableCell align="right">Address</StyledTableCell>
              <StyledTableCell align="right">Department</StyledTableCell>
              <StyledTableCell align="right">Role</StyledTableCell>
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {currentData.filter(search).map((row) => (
              <StyledTableRow key={row.staff_id}>
                <StyledTableCell component="th" scope="row">
                  {row.staff_id}
                </StyledTableCell>
                <StyledTableCell align="right">{row.staff_name}</StyledTableCell>
                <StyledTableCell align="right">
                  <img src={row.staff_img} height='50' width='50'/>
                </StyledTableCell>
                <StyledTableCell align="right">{row.email}</StyledTableCell>
                <StyledTableCell align="right">{row.mobile}</StyledTableCell>
                <StyledTableCell align="right">{row.gender}</StyledTableCell>
                <StyledTableCell align="right">{row.qualification}</StyledTableCell>
                <StyledTableCell align="right">{row.experience}</StyledTableCell>
                <StyledTableCell align="right">{row.address}</StyledTableCell>
                <StyledTableCell align="right">{row.dept_name}</StyledTableCell>
                <StyledTableCell align="right">{row.role_name}</StyledTableCell>
                <StyledTableCell align="right">
                  <Button variant="contained" fullWidth color="info" startIcon={<Edit/>} onClick={() => handleUpdate(row.staff_id)}>
                    Edit
                  </Button>
                  <Button variant="contained" fullWidth color="error" startIcon={<Delete/>} onClick={() => handleDelete(row.staff_id)}>
                    Delete
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container spacing={1} display='flex' justifyContent='center' className='mt-3'>
      <Stack spacing={2}>
        <Pagination count={Math.ceil(staffData.length / dataPerPage)} page={currentPage} onChange={handlePageChange} variant="outlined" />
      </Stack>
      </Grid>

      <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)}>
        <DialogContent>
          <UpdateStaff data={updateData} onClose={() => setOpenUpdate(false)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdate(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AllStaffs;
