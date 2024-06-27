import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Checkbox, FormControl, FormControlLabel, TextField } from '@mui/material';

function Students() {
    const staff_id = sessionStorage.getItem('staff_id');
    const [studentData, setStudentData] = useState([]);
    const [attendanceState, setAttendanceState] = useState({
        attendanceData: {},
        attendanceDate: new Date().toISOString().slice(0, 10),
    });
    const [markAllPresent, setMarkAllPresent] = useState(false);

    useEffect(() => {
        axios.get(`${config.apiURL}/attenance/classstudents/${staff_id}`)
            .then((res) => {
                setStudentData(res.data);
            })
            .catch((err) => {
                console.error('Error fetching student data:', err);
            });
    }, [staff_id,config.apiURL]);

    const handleAttendanceChange = (studentId, status) => {
        setAttendanceState((prevState) => ({
            ...prevState,
            attendanceData: {
                ...prevState.attendanceData,
                [studentId]: status,
            },
        }));
    };

    const handleMarkAllPresentChange = (e) => {
        const isChecked = e.target.checked;
        setMarkAllPresent(isChecked);

        const updatedAttendanceData = {};
        studentData.forEach((student) => {
            updatedAttendanceData[student.stu_id] = isChecked ? 'present' : 'absent';
        });
        setAttendanceState((prevState) => ({
            ...prevState,
            attendanceData: updatedAttendanceData,
        }));
    };
    const handleSubmit = (e) => {
      e.preventDefault();
      const { attendanceData, attendanceDate } = attendanceState;
  
      Object.keys(attendanceData).forEach((studentId) => {
          const status = attendanceData[studentId];
          const student = studentData.find((s) => s.stu_id === parseInt(studentId));
          
          axios.post(`${config.apiURL}/students/saveAttendance`, {
              student_id: studentId,
              student_name: student.stu_name,
              date: attendanceDate,
              status
          })
          .then((res) => {
              console.log(`Updated attendance for student ${studentId}:`, res.data);
              
          })
          .catch((err) => {
          console.log('Error saving :', err);
              // Handle error scenario
          });
      });
  };
  

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
            <form onSubmit={handleSubmit}>
                <TextField
                    type="date"
                    label="Attendance Date"
                    value={attendanceState.attendanceDate}
                    onChange={(e) => setAttendanceState({ ...attendanceState, attendanceDate: e.target.value })}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    className="mb-3"
                />
                <TableContainer component={Paper} className="mt-3">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">STUDENT ID</StyledTableCell>
                                <StyledTableCell align="center">STUDENT NAME</StyledTableCell>
                                <StyledTableCell align='center'>DATE</StyledTableCell>
                                <StyledTableCell align="center">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={markAllPresent}
                                                onChange={handleMarkAllPresentChange}
                                            />
                                        }
                                        label="Mark All Present"
                                    />
                                </StyledTableCell>
                                <StyledTableCell align="center">ABSENT</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {studentData.map((data) => (
                                <StyledTableRow key={data.stu_id}>
                                    <StyledTableCell component="th" scope="row" align="center">
                                        {data.stu_id}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{data.stu_name}</StyledTableCell>
                                    <StyledTableCell align='center'>
                                        <TextField
                                            type="date"
                                            value={attendanceState.attendanceDate}
                                            onChange={(e) => setAttendanceState({ ...attendanceState, attendanceDate: e.target.value })}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <FormControl component="fieldset">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={attendanceState.attendanceData[data.stu_id] === 'present'}
                                                        onChange={(e) =>
                                                            handleAttendanceChange(data.stu_id, e.target.checked ? 'present' : 'absent')
                                                        }
                                                        name={`attendance-${data.stu_id}`}
                                                    />
                                                }
                                                label="Present"
                                            />
                                        </FormControl>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <FormControl component="fieldset">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={attendanceState.attendanceData[data.stu_id] === 'absent'}
                                                        onChange={(e) =>
                                                            handleAttendanceChange(data.stu_id, e.target.checked ? 'absent' : 'present')
                                                        }
                                                        name={`attendance-${data.stu_id}`}
                                                    />
                                                }
                                                label="Absent"
                                            />
                                        </FormControl>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button variant="contained" color="success" type="submit" className="mt-4">
                    Submit
                </Button>
            </form>
        </div>
    );
}

export default Students;





// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import config from '../../config';
// import { styled } from '@mui/material/styles';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell, { tableCellClasses } from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import { Button, Checkbox, FormControl, FormControlLabel, TextField, MenuItem, Select, InputLabel } from '@mui/material';

// function Students() {
//     const staff_id = sessionStorage.getItem('staff_id');
//     const [studentData, setStudentData] = useState([]);
//     const [attendanceState, setAttendanceState] = useState({
//         attendanceData: {},
//         attendanceDate: new Date().toISOString().slice(0, 10),
//     });
//     const [markAllPresent, setMarkAllPresent] = useState(false);
//     const [filterDate, setFilterDate] = useState(new Date().toISOString().slice(0, 10));
//     const [filterClass, setFilterClass] = useState('');

//     useEffect(() => {
//         fetchStudentData();
//     }, [staff_id, filterDate, filterClass]);

//     const fetchStudentData = () => {
//         axios.get(`${config.apiURL}/attenance/classstudents/${staff_id}`, {
//             params: { date: filterDate, className: filterClass }
//         })
//             .then((res) => {
//                 setStudentData(res.data);
//             })
//             .catch((err) => {
//                 console.error('Error fetching student data:', err);
//             });
//     };

//     const handleAttendanceChange = (studentId, status) => {
//         setAttendanceState((prevState) => ({
//             ...prevState,
//             attendanceData: {
//                 ...prevState.attendanceData,
//                 [studentId]: status,
//             },
//         }));
//     };

//     const handleMarkAllPresentChange = (e) => {
//         const isChecked = e.target.checked;
//         setMarkAllPresent(isChecked);

//         const updatedAttendanceData = {};
//         studentData.forEach((student) => {
//             updatedAttendanceData[student.stu_id] = isChecked ? 'present' : 'absent';
//         });
//         setAttendanceState((prevState) => ({
//             ...prevState,
//             attendanceData: updatedAttendanceData,
//         }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const { attendanceData, attendanceDate } = attendanceState;

//         Object.keys(attendanceData).forEach((studentId) => {
//             const status = attendanceData[studentId];
//             const student = studentData.find((s) => s.stu_id === parseInt(studentId));

//             axios.post(`${config.apiURL}/students/saveAttendance`, {
//                 student_id: studentId,
//                 student_name: student.stu_name,
//                 date: attendanceDate,
//                 status
//             })
//                 .then((res) => {
//                     console.log(`Updated attendance for student ${studentId}:`, res.data);
//                 })
//                 .catch((err) => {
//                     console.log('Error saving :', err);
//                     // Handle error scenario
//                 });
//         });
//     };

//     const StyledTableCell = styled(TableCell)(({ theme }) => ({
//         [`&.${tableCellClasses.head}`]: {
//             backgroundColor: theme.palette.common.black,
//             color: theme.palette.common.white,
//         },
//         [`&.${tableCellClasses.body}`]: {
//             fontSize: 14,
//         },
//     }));

//     const StyledTableRow = styled(TableRow)(({ theme }) => ({
//         '&:nth-of-type(odd)': {
//             backgroundColor: theme.palette.action.hover,
//         },
//         '&:last-child td, &:last-child th': {
//             border: 0,
//         },
//     }));

//     return (
//         <div>
//             <FormControl fullWidth margin="normal">
//                 <TextField
//                     type="date"
//                     label="Filter Date"
//                     value={filterDate}
//                     onChange={(e) => setFilterDate(e.target.value)}
//                     InputLabelProps={{
//                         shrink: true,
//                     }}
//                 />
//             </FormControl>
//             <FormControl fullWidth margin="normal">
//                 <InputLabel>Filter Class</InputLabel>
//                 <Select
//                     value={filterClass}
//                     onChange={(e) => setFilterClass(e.target.value)}
//                 >
                    
//                     <MenuItem value="">
                    
//                     </MenuItem>
//                     <MenuItem value="">PRE KG</MenuItem>
//                     <MenuItem value="1">LKG</MenuItem>
//                     <MenuItem value="2">UKG</MenuItem>
//                     <MenuItem value="3">1st Std</MenuItem>
//                     <MenuItem value="1">2nd Std</MenuItem>
//                     <MenuItem value="2">3rd Std</MenuItem>
//                     <MenuItem value="3">4th Std</MenuItem>
//                     <MenuItem value="1">5th Std</MenuItem>
//                     <MenuItem value="2">6th Std</MenuItem>
//                     <MenuItem value="3">7th Std</MenuItem>
//                     <MenuItem value="">8th Std</MenuItem>
//                     <MenuItem value="2">9th Std</MenuItem>
//                     <MenuItem value="3">10th Std</MenuItem>
//            </Select>
//             </FormControl>
//             <form onSubmit={handleSubmit}>
//                 <TextField
//                     type="date"
//                     label="Attendance Date"
//                     value={attendanceState.attendanceDate}
//                     onChange={(e) => setAttendanceState({ ...attendanceState, attendanceDate: e.target.value })}
//                     InputLabelProps={{
//                         shrink: true,
//                     }}
//                     className="mb-3"
//                 />
//                 <TableContainer component={Paper} className="mt-3">
//                     <Table>
//                         <TableHead>
//                             <TableRow>
//                                 <StyledTableCell align="center">STUDENT ID</StyledTableCell>
//                                 <StyledTableCell align="center">STUDENT NAME</StyledTableCell>
//                                 <StyledTableCell align="center">DATE</StyledTableCell>
//                                 <StyledTableCell align="center">
//                                     <FormControlLabel
//                                         control={
//                                             <Checkbox
//                                                 checked={markAllPresent}
//                                                 onChange={handleMarkAllPresentChange}
//                                             />
//                                         }
//                                         label="Mark All Present"
//                                     />
//                                 </StyledTableCell>
//                                 <StyledTableCell align="center">ABSENT</StyledTableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {studentData.map((data) => (
//                                 <StyledTableRow key={data.stu_id}>
//                                     <StyledTableCell component="th" scope="row" align="center">
//                                         {data.stu_id}
//                                     </StyledTableCell>
//                                     <StyledTableCell align="center">{data.stu_name}</StyledTableCell>
//                                     <StyledTableCell align="center">
//                                         <TextField
//                                             type="date"
//                                             value={attendanceState.attendanceDate}
//                                             onChange={(e) => setAttendanceState({ ...attendanceState, attendanceDate: e.target.value })}
//                                             InputLabelProps={{
//                                                 shrink: true,
//                                             }}
//                                         />
//                                     </StyledTableCell>
//                                     <StyledTableCell align="center">
//                                         <FormControl component="fieldset">
//                                             <FormControlLabel
//                                                 control={
//                                                     <Checkbox
//                                                         checked={attendanceState.attendanceData[data.stu_id] === 'present'}
//                                                         onChange={(e) =>
//                                                             handleAttendanceChange(data.stu_id, e.target.checked ? 'present' : 'absent')
//                                                         }
//                                                         name={`attendance-${data.stu_id}`}
//                                                     />
//                                                 }
//                                                 label="Present"
//                                             />
//                                         </FormControl>
//                                     </StyledTableCell>
//                                     <StyledTableCell align="center">
//                                         <FormControl component="fieldset">
//                                             <FormControlLabel
//                                                 control={
//                                                     <Checkbox
//                                                         checked={attendanceState.attendanceData[data.stu_id] === 'absent'}
//                                                         onChange={(e) =>
//                                                             handleAttendanceChange(data.stu_id, e.target.checked ? 'absent' : 'present')
//                                                         }
//                                                         name={`attendance-${data.stu_id}`}
//                                                     />
//                                                 }
//                                                 label="Absent"
//                                             />
//                                         </FormControl>
//                                     </StyledTableCell>
//                                 </StyledTableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//                 <Button variant="contained" color="success" type="submit" className="mt-4">
//                     Submit
//                 </Button>
//             </form>
//         </div>
//     );
// }

// export default Students;

