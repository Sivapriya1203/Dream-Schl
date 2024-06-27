// import React, { useEffect, useState } from 'react';
// import Axios from 'axios';
// import { styled } from '@mui/material/styles';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell, { tableCellClasses } from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import Pagination from '@mui/material/Pagination';
// import Stack from '@mui/material/Stack';
// import { Button, Dialog, DialogActions, DialogContent, Grid,FormControl,Select,TextField } from '@mui/material';

// import config from '../../config';
// import { Link } from 'react-router-dom';
// import { useParams } from 'react-router-dom';
// import UpdateStaffAllocation from './UpdateStaffAllocation';
// import axios from 'axios';
// import { Add, Delete, Edit } from '@mui/icons-material';

// function StaffAllocationIndex() {
//     const [staffData,setStaffData] = useState([])
//   const [dataPerPage, setDataPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchedVal, setSearchedVal] = useState('');
//   const [openUpdate, setOpenUpdate] = useState(false);
//   const [updateData,setUpdateData] = useState([]);
//   const [openDlt,setOpenDlt] = useState(false);
//   const [dltData,setDltData] = useState();
 

//   useEffect(() => {
    
//       Axios.get(`${config.apiURL}/staffAllocation/getStaffAllocation`)
//       .then((res) => {
//         setStaffData(res.data);
//       })
//       .catch((err) => {
//         console.log('Error:', err);
//       });
//   }, [openUpdate,openDlt]);
   
  

//   const StyledTableCell = styled(TableCell)(({ theme }) => ({
//     [`&.${tableCellClasses.head}`]: {
//       backgroundColor: theme.palette.common.black,
//       color: theme.palette.common.white,
//     },
//     [`&.${tableCellClasses.body}`]: {
//       fontSize: 14,
//     },
//   }));

//   const StyledTableRow = styled(TableRow)(({ theme }) => ({
//     '&:nth-of-type(odd)': {
//       backgroundColor: theme.palette.action.hover,
//     },
//     '&:last-child td, &:last-child th': {
//       border: 0,
//     },
//   }));

//   const handleChangeDataPerPage = (e) => {
//     const newDataPerPage = parseInt(e.target.value, 10);
//     setDataPerPage(newDataPerPage);
//     setCurrentPage(1);
//   };

//   const handlePageChange = (event, value) => {
//     setCurrentPage(value);
//   };

//   const search = (item) => {
//     const searchValue = searchedVal.toLowerCase();
//     return Object.values(item).some(
//       (value) => value && value.toString().toLowerCase().includes(searchValue)
//     );
//   };

//   const firstIndexOfData = (currentPage - 1) * dataPerPage;
//   const lastIndexOfData = currentPage * dataPerPage;
//   const currentData = staffData.slice(firstIndexOfData, lastIndexOfData);

//   const handleUpdate = (id) =>{
//     const selectData = staffData.find((staff)=>staff.staff_allocation_id === id);
//     if(selectData){
//       setUpdateData(selectData);
//       setOpenUpdate(true)
//     }
//   }


//   const handleDlt = (id) =>{
//     if(id){
//       setDltData(id);
//       setOpenDlt(true)
//     }
//   }

//   const confirmDlt = () =>{
//     if(dltData){
//       axios.delete(`${config.apiURL}/staffAllocation/deleteStaffAllocation/${dltData}`)
//       .then((res)=>{
//         setOpenDlt(false)
//       })
//       .catch((err)=>{
//         console.log("Error delete staff allocation.")
//       })
//     }
//   }


//   return (
//     <div>
              
//         <Grid container spacing={3}>
//         <Grid item xs={4}>
//         <Link to='/addStaffAllocation'> <Button variant="contained" color="primary"  startIcon={<Add/>} >Add</Button></Link>
//         </Grid>
//         <Grid item xs={4}>
//           <TextField label="Search" onChange={(e) => setSearchedVal(e.target.value)} value={searchedVal} />
//         </Grid>
//         <Grid item xs={4}>
//           <FormControl>
//             <Select value={dataPerPage} onChange={handleChangeDataPerPage}>
//               <option value={5}>5 Per Page</option>
//               <option value={10}>10 Per Page</option>
//               <option value={15}>15 Per Page</option>
//               <option value={20}>20 Per Page</option>
//               <option value={0}>All Per Page</option>
//             </Select>
//           </FormControl>
//         </Grid>
//       </Grid>
//       <TableContainer component={Paper} className='mt-3'>
//         <Table sx={{ minWidth: 700 }} aria-label="customized table">
//           <TableHead>
//             <TableRow>
//               <StyledTableCell align="right">S.No</StyledTableCell>
//               <StyledTableCell align="right">Staff Name</StyledTableCell>
//               <StyledTableCell align="right">Staff Image</StyledTableCell>
//               <StyledTableCell align="right">Class</StyledTableCell>
//               <StyledTableCell align="right">Section</StyledTableCell>
//               <StyledTableCell>Subject Name </StyledTableCell>
//               <StyledTableCell align="right">Academic Year</StyledTableCell>
//               <StyledTableCell align="right">Actions</StyledTableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//           {currentData.filter(search).map((staff,index) => (
              
//               <StyledTableRow key={staff.staff_allocation_id}>
//                 <StyledTableCell align="right">{index+1}</StyledTableCell>
//                 <StyledTableCell align="right">{staff.staff_name}</StyledTableCell>
//                 <StyledTableCell align="right">
//                     <img src={staff.staff_img} height='50' width='50'/>
//                 </StyledTableCell>
//                 <StyledTableCell align="right">{staff.cls_name}</StyledTableCell>
//                 <StyledTableCell align="right">{staff.sec_name}</StyledTableCell>
//                 <StyledTableCell align="right">{staff.sub_name}</StyledTableCell>
//                 <StyledTableCell align="right">{staff.academic_year}</StyledTableCell>
//                 <StyledTableCell align="right">
//                   <Button  variant="contained" color="info" startIcon={<Edit/>}onClick={()=>handleUpdate(staff.staff_allocation_id)}>Edit</Button>
//                   <Button variant="contained" color="error" startIcon={<Delete/>} onClick={()=>handleDlt(staff.staff_allocation_id)}>Delete</Button>
//                 </StyledTableCell>
//               </StyledTableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Grid container spacing={1} display='flex' justifyContent='center' className='mt-3'>
//       <Stack spacing={2}>
//         <Pagination count={Math.ceil(staffData.length / dataPerPage)} page={currentPage} onChange={handlePageChange} variant="outlined" />
//       </Stack>
//       </Grid>

//       <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)}>
//         <DialogContent>
//         <UpdateStaffAllocation data ={updateData} onClose={()=>setOpenUpdate(false)}/>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenUpdate(false)}>Close</Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={openDlt} onClose={() => setOpenDlt(false)}>
//         <DialogContent>
//         <p>Are you sure do you want to delete this allocation ?</p>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={confirmDlt} style={{backgroundColor:"red",color:"white"}}>Delete</Button>
//           <Button onClick={() => setOpenDlt(false)} style={{backgroundColor:"green",color:"white"}}>Cancel</Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }

// export default StaffAllocationIndex;

import { Button } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

function StaffAllocationIndex() {
  return (
    <div>
     <Link to={'/classteach'}> <Button>Class Teacher </Button> </Link>
     <Link> <Button>Subject Teacher</Button></Link>
      
    </div>
  )
}

export default StaffAllocationIndex

