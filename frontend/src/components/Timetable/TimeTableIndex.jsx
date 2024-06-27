import { Button, Grid, MenuItem, TextField } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config';
import { Link } from 'react-router-dom';
import { Add } from '@mui/icons-material';

const TimeTableIndex = () => {
    const [secData, setSecData] = useState([]);
    const [clsData, setClsData] = useState([]);
    const [timetableData, setTimetableData] = useState([]);
    const [filterData, setFilterData] = useState({
        cls_id: "",
        cls_allocation_id: "",
        academic_year: "",
    });
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get(`${config.apiURL}/clsAndSec/getClass`)
            .then((res) => {
                setClsData(res.data);
            })
            .catch((err) => {
                console.log("Error fetching class allocation data", err);
            });
    }, []);

    useEffect(() => {
        if (filterData.cls_id) {
            axios.get(`${config.apiURL}/clsAndSec/getClsAndSecAllocationByClsId?cls_id=${filterData.cls_id}`)
                .then((res) => {
                    setSecData(res.data);
                })
                .catch((err) => {
                    console.log("Error fetching section allocation data", err);
                });
        } else {
            setSecData([]);
        }
        setFilterData((prevState) => ({ ...prevState, cls_allocation_id: "" }));
    }, [filterData.cls_id]);

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setFilterData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const fetchTimetable = () => {
        if (!filterData.cls_id || !filterData.cls_allocation_id || !filterData.academic_year) {
            setError("Please select class, section, and academic year.");
            return;
        }
        axios.get(`${config.apiURL}/timeTable/getTimeTable?cls_allocation_id=${filterData.cls_allocation_id}&academic_year=${filterData.academic_year}`)
            .then((res) => {
                setTimetableData(res.data);
                setError("");
            })
            .catch((err) => {
                console.log("Error fetching timetable data", err);
                setError("Error fetching timetable data.");
            });
    };

    const curt_year = parseInt(moment().format("YYYY"), 10);
    const nxt_year = curt_year + 1;
    const prev_year = curt_year - 1;

    return (
        <div>
            <h1>Time Table</h1>

<Link to={'/timetable'}><Button variant='contained' startIcon={<Add/>} style={{marginBottom:"25px"}}color='primary'>Add</Button></Link>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <TextField
                        fullWidth
                        select
                        label="Select Class"
                        name="cls_id"
                        onChange={handleChangeInput}
                        value={filterData.cls_id}
                    >
                        {clsData.map((cls) => (
                            <MenuItem key={cls.cls_id} value={cls.cls_id}>{cls.cls_name}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        fullWidth
                        select
                        label="Select Section"
                        name="cls_allocation_id"
                        onChange={handleChangeInput}
                        value={filterData.cls_allocation_id}
                    >
                        {secData.map((sec) => (
                            <MenuItem key={sec.cls_allocation_id} value={sec.cls_allocation_id}>{sec.sec_name}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        fullWidth
                        select
                        label="Select Academic Year"
                        name="academic_year"
                        onChange={handleChangeInput}
                        value={filterData.academic_year}
                    >
                        <MenuItem value={`${prev_year}-${curt_year}`}>{prev_year}-{curt_year}</MenuItem>
                        <MenuItem value={`${curt_year}-${nxt_year}`}>{curt_year}-{nxt_year}</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={fetchTimetable} variant='contained' color='success' >Fetch Timetable</Button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </Grid>
            </Grid>
            <div>
                {timetableData.length > 0 ? (
                    <div style={{marginLeft:'200px',marginTop:'30px'}} >
                        <img src={timetableData[0].t_table} alt="Timetable" style={{height:'400px',width:'700px'}}/>
                    </div>
                ) : (
                    <p>No timetable data found.</p>
                )}
            </div>
        </div>
    );
};

export default TimeTableIndex;
