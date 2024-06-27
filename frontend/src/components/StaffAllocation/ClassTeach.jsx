import axios from 'axios';
import React, { useEffect, useState } from 'react';
import config from '../../config';
import { Button, Grid, MenuItem, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Done } from '@mui/icons-material';

const ClassTeach = () => {
    const [clsData, setClsData] = useState([]);
    const [secData, setSecData] = useState([]);
    const [staffData, setStaffData] = useState([]);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        staff_id: "",
        cls_id: "",
        cls_allocation_id: "",
        academic_year: "",
    });
    const [errData, setErrData] = useState({
        staff_id: "",
        cls_id: "",
        cls_allocation_id: "",
        academic_year: "",
    });

    const handleValidation = (name, value) => {
        const trimmedValue = value && typeof value === "string" ? value.trim() : value;
        let errmsg = "";

        switch (name) {
            case "staff_id":
                if (!trimmedValue) {
                    errmsg = "Please enter staff name";
                }
                break;
            case "cls_id":
                if (!trimmedValue) {
                    errmsg = "Please enter class name";
                }
                break;
            case "sec_id":
                if (!trimmedValue) {
                    errmsg = "Please enter section name";
                }
                break;
            case "academic_year":
                if (!trimmedValue) {
                    errmsg = "Please enter academic year";
                }
                break;
            default:
                break;
        }
        return errmsg;
    };

    useEffect(() => {
        axios.get(`${config.apiURL}/staffs/getStaffs`)
            .then((res) => {
                setStaffData(res.data);
            })
            .catch((err) => {
                console.log('The error is:', err);
            });
    }, []);

    useEffect(() => {
        axios.get(`${config.apiURL}/clsAndSec/getClass`)
            .then((res) => {
                setClsData(res.data);
            })
            .catch((err) => {
                console.log('The error is:', err);
            });
    }, []);

    useEffect(() => {
        setFormData(prevFormData => ({ ...prevFormData, cls_allocation_id: "" }));
        if (formData.cls_id) {
            axios.get(`${config.apiURL}/clsAndSec/getClsAndSecAllocationByClsId?cls_id=${formData.cls_id}`)
                .then((res) => {
                    setSecData(res.data);
                })
                .catch((err) => {
                    console.log('The error is:', err);
                });
        }
    }, [formData.cls_id]);

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        const error = handleValidation(name, value);
        setErrData({ ...errData, [name]: error });
        setFormData({ ...formData, [name]: value });
    };

    const curt_year = parseInt(moment().format("YYYY"), 10);
    const prev_year = curt_year - 1;
    const nxt_year = curt_year + 1;

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        const formerror = {};
        Object.keys(formData).forEach((name) => {
            const value = formData[name];
            const error = handleValidation(name, value);
            if (error) {
                formerror[name] = error;
            }
        });

        if (Object.keys(formerror).length > 0) {
            setErrData(formerror);
            return;
        }

        axios.post(`${config.apiURL}/staffAllocation/postclassteacher`, formData)
            .then((res) => {
                navigate('/staffAllocationIndex');
                console.log(res.data);
            })
            .catch((err) => {
                console.log("Error saving staff allocation", err);
            });
    };

    return (
        <div>
            <h1>Staff Allocation Form</h1>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        select
                        fullWidth
                        label="Select Class"
                        name="cls_id"
                        error={!!errData.cls_id}
                        helperText={errData.cls_id}
                        onChange={handleChangeInput}
                        value={formData.cls_id}
                    >
                        {clsData.map((cls) => (
                            <MenuItem key={cls.cls_id} value={cls.cls_id}>{cls.cls_name}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        select
                        fullWidth
                        label="Select Section"
                        name="cls_allocation_id"
                        onChange={handleChangeInput}
                        error={!!errData.cls_allocation_id}
                        helperText={errData.cls_allocation_id}
                        value={formData.cls_allocation_id}
                    >
                        {secData.map((sec) => (
                            <MenuItem key={sec.cls_allocation_id} value={sec.cls_allocation_id}>{sec.sec_name}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        select
                        fullWidth
                        label="Select Staff"
                        name="staff_id"
                        onChange={handleChangeInput}
                        error={!!errData.staff_id}
                        helperText={errData.staff_id}
                        value={formData.staff_id}
                    >
                        {staffData.map((staff) => (
                            <MenuItem key={staff.staff_id} value={staff.staff_id}>{staff.staff_name}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        select
                        fullWidth
                        label="Academic Year"
                        name="academic_year"
                        onChange={handleChangeInput}
                        error={!!errData.academic_year}
                        helperText={errData.academic_year}
                        value={formData.academic_year}
                    >
                        <MenuItem value={`${prev_year}-${curt_year}`}>{prev_year}-{curt_year}</MenuItem>
                        <MenuItem value={`${curt_year}-${nxt_year}`}>{curt_year}-{nxt_year}</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} display='flex' justifyContent='center'>
                    <Button variant='contained' color='success' startIcon={<Done />} onClick={handleSubmit}>Submit</Button>
                </Grid>
            </Grid>
        </div>
    );
}

export default ClassTeach;
