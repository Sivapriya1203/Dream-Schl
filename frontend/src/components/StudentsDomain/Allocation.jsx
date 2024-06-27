// import React, { useEffect, useState } from 'react';
// import { Grid, MenuItem, TextField, Button } from '@mui/material';
// import axios from 'axios';
// import moment from 'moment';
// import config from '../../config'
// import { useNavigate } from 'react-router';
// import { Done } from '@mui/icons-material';

// function Allocation() {
//     const navigate = useNavigate()
//     const [staffData, setStaffData] = useState([]);
//     const [academicYears, setAcademicYears] = useState([]);
//      const [allstudentAlloc, setAllStudentAlloc] = useState([]);
//      const [clsData,setClsData] = useState([])
//      const [secData,setSecData] = useState([]);
//     const [stu_allocInfo, setStu_allocInfo] = useState({
//         staff_id: "",
//         academic_year: "",
//         stu_id: "",
//         roll_no: "",
//         cls_id:"",
//         cls_allocation_id : ""
//     });
//     const [err_allocInfo, setErr_allocInfo] = useState({
//         staff_id: "",
//         academic_year: "",
//         stu_id: "",
//         roll_no: "",
//         cls_id:"",
//         cls_allocation_id : ""
//     });

//     let curnt_year = moment().format("YYYY");
//     let prev_year = parseInt(curnt_year) - 1;
//     let nxt_year = parseInt(curnt_year) + 1;

//     const handleValidation = (name,value) =>{
//      const trimmedValue = value && typeof value === "string" ? value.trim() :value;
//      let errmsg = ""
     
//      switch(name){
//         case "staff_id" :
//             if (!trimmedValue){
//                 errmsg = "please enter Staff id"
//             }
//             break;
//         case "academic_year" :
//             if (!trimmedValue){
//                 errmsg = "please enter academic_year "
//             }
//             break;
//         case "stu_id" :
//             if (!trimmedValue){
//                 errmsg = "please enter stu_id"
//             }
//             break;
//         case "roll_no" :
//             if (!trimmedValue){
//                 errmsg = "please enter roll_no"
//             }
//             break;
//         case "cls_id" :
//             if (!trimmedValue){
//                 errmsg = "please enter cls_id"
//             }
//             break;
//         case "cls_allocation_id" :
//             if (!trimmedValue){
//                 errmsg = "please enter cls_allocation_id"
//             }
//             break;
//         default:
//           break;

//           }
//         return errmsg;

//     } 

//     useEffect(() => {
//         axios.get(`${config.apiURL}/staffs/getStaffs`)
//             .then((res) => {
//                 setStaffData(res.data);
//             })
//             .catch((err) => {
//                 console.log("Error fetching staff data:", err);
//             });
//             axios.get(`${config.apiURL}/students/getStudents`)
//             .then((res)=>{
//               setAllStudentAlloc(res.data)
//             })
//             .catch((err)=>{
//               console.log('The error is :',err);
//             })
//             axios.get(`${config.apiURL}/clsAndSec/getClass`)
//             .then((res)=>{
//               setClsData(res.data)
//             })
//             .catch((err)=>{
//               console.log('The error is :',err);
//             })

    
//     }, []);

//     useEffect(() => {
        
//         setStu_allocInfo({ ...stu_allocInfo, cls_allocation_id: "" }); 
//         if(stu_allocInfo.cls_id){
//             axios.get(`${config.apiURL}/clsAndSec/getClsAndSecAllocationByClsId?cls_id=${stu_allocInfo.cls_id}`)
//             .then((res) => {
//                 setSecData(res.data);
//                 console.log("Sec Data :",secData)
//             })
//             .catch((err) => {
//                 console.log('The error is :', err);
//             });
//         }
//     }, [stu_allocInfo.cls_id]);
    

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         const error = handleValidation(name,value)
//         setErr_allocInfo({...err_allocInfo,[name]:error})
//         setStu_allocInfo({ ...stu_allocInfo, [name]: value });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const formerrors = {}

//         Object.keys(stu_allocInfo).forEach((name)=>{
//             const value = stu_allocInfo[name]
//             const error = handleValidation(name,value)
//             if(error){
//                 formerrors[name] = error
//             }
//         })
//          if(Object.keys(formerrors).length > 0){
//             setErr_allocInfo(formerrors)
//             return;
//          }

//         axios.post(`${config.apiURL}/stuAllocation/saveStuAllocation`,stu_allocInfo)
//             .then((res) => {
//                 console.log("Success");
//                 console.log("Data:", stu_allocInfo);
//             })
//             .catch((err) => {
//                 console.log("Error:", err);
//                 console.log("Data:", stu_allocInfo);
//             });
//             navigate(-1)
//     };

//     return (
//         <div>
//             <h1>Student Allocation form</h1>
//             <form onSubmit={handleSubmit}>
//                 <Grid container spacing={3}>
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             fullWidth
//                             select
//                             name="staff_id"
//                             label="Select Staff"
//                             onChange={handleChange}
//                             error={!!err_allocInfo.staff_id}
//                             helperText ={err_allocInfo.staff_id}
//                             value={stu_allocInfo.staff_id}
//                         >
//                             {staffData.map((staff) => (
//                                 <MenuItem key={staff.staff_id} value={staff.staff_id}>{staff.staff_name}</MenuItem>
//                             ))}
//                         </TextField>
//                     </Grid>
                  
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             fullWidth
//                             label="Student Name"
//                             variant="outlined"
//                             name="stu_id"
//                             select
//                             error={!!err_allocInfo.stu_id}
//                             helperText ={err_allocInfo.stu_id}
//                             value={stu_allocInfo.stu_id}
//                             onChange={handleChange}
//                         >{allstudentAlloc.map((stud)=>(
//                             <MenuItem key={stud.stu_id} value={stud.stu_id}>{stud.stu_name}</MenuItem>
//                         ))}</TextField>
//                     </Grid>

//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             fullWidth
//                             label="Class"
//                             variant="outlined"
//                             name="cls_id"
//                             select
//                             error={!!err_allocInfo.cls_id}
//                             helperText ={err_allocInfo.cls_id}
//                             value={stu_allocInfo.cls_name}
//                             onChange={handleChange}
//                         >{clsData.map((cls)=>(
//                             <MenuItem key={cls.cls_id} value={cls.cls_id}>{cls.cls_name}</MenuItem>
//                         ))}</TextField>
//                     </Grid>
                  
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             fullWidth
//                             label="Section"
//                             variant="outlined"
//                             name="cls_allocation_id"
//                             select
//                             error={!!err_allocInfo.cls_allocation_id}
//                             helperText ={err_allocInfo.cls_allocation_id}
//                             value={stu_allocInfo.cls_allocation_id}
//                             onChange={handleChange}
//                         >{secData.map((sec)=>(
//                             <MenuItem key={sec.cls_allocation_id} value={sec.cls_allocation_id}>{sec.sec_name}</MenuItem>
//                         ))}</TextField>
//                     </Grid>
                  
                    
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             fullWidth
//                             label="Role Number"
//                             variant="outlined"
//                             name="roll_no"
//                             error={!!err_allocInfo.roll_no}
//                             helperText ={err_allocInfo.roll_no}
//                             value={stu_allocInfo.roll_no}
//                             onChange={handleChange}
//                         />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                         select
//                         fullWidth
//                         name='academic_year'
//                         label = "Select Academic Year"
//                         error={!!err_allocInfo.academic_year}
//                         helperText={err_allocInfo.academic_year}
//                         onChange={handleChange}
//                         >
//                             <MenuItem value={`${prev_year}-${curnt_year}`}>{prev_year}-{curnt_year}</MenuItem>
//                             <MenuItem value={`${curnt_year}-${nxt_year}`}>{curnt_year}-{nxt_year}</MenuItem>
//                         </TextField>
//                     </Grid>
//                     <Grid item xs={12}>
//                         <Button
//                             type="submit"
//                             variant="contained"
                        
//                            color='success'
//                            startIcon={<Done/>}
//                         >
//                             Submit
//                         </Button>
//                     </Grid>
//                 </Grid>
//             </form>
//         </div>
//     );
// }

// export default Allocation;
import Cardalloc from 'components/cards/Cardalloc'
import config from '../../config'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { Box } from '@mui/system';

function Allocation() {
  const [classes, setClasses] = useState([]); // Initialize with an empty array

  useEffect(() => {
    axios.get(`${config.apiURL}/clsAndSec/getclass`)
      .then((res) => {
        setClasses(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log("classes err :",err);
      });
  }, []); // Add dependency array to run the effect only once

  return (
    <Grid container spacing={2}>
      {classes.map((cls) => (
        <Grid item xs={12} sm={6} md={4} key={cls.cls_id}>
        <Link to={`/studentalloc/${cls.cls_id}`}> <Box>{cls.cls_name}</Box> </Link> 
        </Grid>
      ))}
    </Grid>
  );
}

export default Allocation;



