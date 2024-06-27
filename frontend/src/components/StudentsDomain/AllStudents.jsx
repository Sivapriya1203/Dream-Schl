
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
import UpdateStudent from './UpdateStudent';
import config  from '../../config';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

function AllStudents() {
  const [roleData, setRoleData] = useState([]);
  const [openUpdate,setOpenUpdate] = useState(false);
  const [dlt,setDlt] = useState(false);
  const [updateData,setUpdateData] = useState()
  const [dataPerPage, setDataPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedVal, setSearchedVal] = useState('');

  useEffect(() => {
    Axios.get(`${config.apiURL}/students/getStudents`)
      .then((res) => {
        setRoleData(res.data);
        console.log("Response data :",res.data)
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  }, [openUpdate,dlt]);

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

  const handleUpdate = (id) =>{
   
      const selectData = roleData.find((stu)=>stu.stu_id === id);
      if(selectData){
        setUpdateData(selectData);
        setOpenUpdate(true)
      }
  }

  const handleDlt = (id) =>{
    Axios.delete(`${config.apiURL}/students/deleteStudent/${id}`)
      .then((res) => {
        console.log("Deleted successfully :")
        setDlt(true)
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  }

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
  const currentData = roleData.slice(firstIndexOfData, lastIndexOfData);


  return (
    <div>
       
       <Grid container spacing={3}>
        <Grid item xs={4}>
        <Link to='/addStudent'> <Button variant="contained" color="primary" startIcon={<AddIcon/>} >Add</Button></Link>
        
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
              
              <StyledTableCell align="right">Student name</StyledTableCell>
              <StyledTableCell align="right">Student Image</StyledTableCell>
              <StyledTableCell align="right">Class</StyledTableCell>
              <StyledTableCell align="right">Aadhar no</StyledTableCell>
              <StyledTableCell align="right">Father name</StyledTableCell>
              <StyledTableCell align="right">Mother name</StyledTableCell>
              <StyledTableCell align="right">Father Mobile</StyledTableCell>
              <StyledTableCell align="right">Mother Mobile</StyledTableCell>
              <StyledTableCell align="right">Gender</StyledTableCell>
              <StyledTableCell align="right">Caste</StyledTableCell>
              <StyledTableCell align="right">Religion</StyledTableCell>
              <StyledTableCell align="right">Address</StyledTableCell>
              <StyledTableCell align="right">Referal</StyledTableCell>
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roleData.map((row) => (
              <StyledTableRow key={row.stu_id}>
                <StyledTableCell component="th" scope="row">
                  {row.stu_id}
                </StyledTableCell>
                <StyledTableCell align="right">{row.stu_name}</StyledTableCell>
                <StyledTableCell align="right">
                  <img src={row.stu_img} height='50' width='50'/>
                </StyledTableCell>
                <StyledTableCell align="right">{row.cls_name}</StyledTableCell>
                <StyledTableCell align="right">{row.stu_aadhar}</StyledTableCell>
                <StyledTableCell align="right">{row.father_name}</StyledTableCell>
                <StyledTableCell align="right">{row.mother_name}</StyledTableCell>
                <StyledTableCell align="right">{row.father_mobile}</StyledTableCell>
                <StyledTableCell align="right">{row.mother_mobile}</StyledTableCell>
                <StyledTableCell align="right">{row.gender}</StyledTableCell>
                <StyledTableCell align="right">{row.cast_name}</StyledTableCell>
                <StyledTableCell align="right">{row.religion}</StyledTableCell>
                <StyledTableCell align="right">{row.address}</StyledTableCell>
                <StyledTableCell align="right">{row.staff_name}</StyledTableCell>
                <StyledTableCell align="right">
                  <Button variant="contained" color="info" fullWidth startIcon={<EditIcon />}  onClick={()=>handleUpdate(row.stu_id)}>
                    Edit
                  </Button>
                  <Button variant="contained" color='error'  fullWidth startIcon={<DeleteIcon/>}  onClick={()=>handleDlt(row.stu_id)}>
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
        <Pagination count={Math.ceil(roleData.length / dataPerPage)} page={currentPage} onChange={handlePageChange} variant="outlined" />
      </Stack>
      </Grid>

      <Dialog open={openUpdate} onClose={()=>setOpenUpdate(false)}>
        <DialogContent>
          <UpdateStudent data ={updateData} onClose={()=>setOpenUpdate(false)}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenUpdate(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AllStudents;
