import React, { useEffect, useState } from 'react';
import { Grid, Box, Button, MenuItem, TextField } from '@mui/material';
import axios from 'axios';
import config from '../../config';
import { useNavigate } from 'react-router';
import { Done } from '@mui/icons-material';

function StudentApplication() {
    const navigate = useNavigate();
    const [staffData, setStaffData] = useState([]);
    const [clsData, setClsData] = useState([]);
    const [secData, setSecData] = useState([]);
    const [studentinfo, setStudentinfo] = useState({
        staff_id: "",
        cls_id: "",
        sec_id: "",
        stu_name: "",
        stu_aadhar: "",
        gender: "",
        dob: "",
        community: "",
        cast_name: "",
        religion: "",
        father_name: "",
        father_mobile: "",
        father_occupation: "",
        father_annual_income: "",
        mother_name: "",
        mother_mobile: "",
        mother_occupation: "",
        mother_annual_income: "",
        address: "",
        stu_img: null
    });
    const [errors, setErrors] = useState({
        staff_id: "",
        cls_id: "",
        sec_id: "",
        stu_name: "",
        stu_aadhar: "",
        gender: "",
        dob: "",
        community: "",
        cast_name: "",
        religion: "",
        father_name: "",
        father_mobile: "",
        father_occupation: "",
        father_annual_income: "",
        mother_name: "",
        mother_mobile: "",
        mother_occupation: "",
        mother_annual_income: "",
        address: "",
        stu_img: ""
    });

    // Validation rules
    const handleValidation = (name, value) => {
        let errmsg = "";
        const trimmedValue = value && typeof value === "string" ? value.trim() : value;

        const validatePhoneNumber = (phone) => /^[6-9]\d{9}$/.test(phone);
        const validateAadhar = (aadhar) => /^\d{12}$/.test(aadhar);
        const validateAnnualIncome = (income) => /^\d+(\.\d{1,2})?$/.test(income);
        const validateDate = (date) => {
            const datePattern = /^\d{4}-\d{2}-\d{2}$/;
            return datePattern.test(date);
        };

        // Validation for each field
        switch (name) {
            case "staff_id":
                if (!trimmedValue) errmsg = "Please select Staff Name";
                break;
            case "cls_id":
                if (!trimmedValue) errmsg = "Please select Class";
                break;
            case "sec_id":
                if (!trimmedValue) errmsg = "Please select Section";
                break;
            case "stu_name":
                if (!trimmedValue) errmsg = "Please enter Student Name";
                break;
            case "stu_aadhar":
                if (!validateAadhar(trimmedValue)) errmsg = "Please enter a valid 12-digit Aadhar number";
                break;
            case "gender":
                if (!trimmedValue) errmsg = "Please select Gender";
                break;
            case "dob":
                if (!validateDate(trimmedValue)) errmsg = "Please enter a valid Date of Birth";
                break;
            case "community":
                if (!trimmedValue) errmsg = "Please enter Community";
                break;
            case "cast_name":
                if (!trimmedValue) errmsg = "Please enter Caste Name";
                break;
            case "religion":
                if (!trimmedValue) errmsg = "Please enter Religion";
                break;
            case "father_name":
                if (!trimmedValue) errmsg = "Please enter Father's Name";
                break;
            case "father_mobile":
                if (!validatePhoneNumber(trimmedValue)) errmsg = "Please enter a valid mobile number";
                break;
            case "father_occupation":
                if (!trimmedValue) errmsg = "Please enter Father's Occupation";
                break;
            case "father_annual_income":
                if (!validateAnnualIncome(trimmedValue)) errmsg = "Please enter a valid annual income";
                break;
            case "mother_name":
                if (!trimmedValue) errmsg = "Please enter Mother's Name";
                break;
            case "mother_mobile":
                if (!validatePhoneNumber(trimmedValue)) errmsg = "Please enter a valid mobile number";
                break;
            case "mother_occupation":
                if (!trimmedValue) errmsg = "Please enter Mother's Occupation";
                break;
            case "mother_annual_income":
                if (!validateAnnualIncome(trimmedValue)) errmsg = "Please enter a valid annual income";
                break;
            case "address":
                if (!trimmedValue) errmsg = "Please enter Address";
                break;
            case "stu_img":
                if (!value) errmsg = "Please upload Student Image";
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
                console.log("Error fetching staff data:", err);
            });

        axios.get(`${config.apiURL}/clsAndSec/getClass`)
            .then((res) => {
                setClsData(res.data);
            })
            .catch((err) => {
                console.log("Error fetching Class data", err);
            });

        axios.get(`${config.apiURL}/clsAndSec/getSection`)
            .then((res) => {
                setSecData(res.data);
            })
            .catch((err) => {
                console.log('Error fetching section data:', err);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        const newValue = files ? files[0] : value;
        const error = handleValidation(name, newValue);

        setErrors({...errors,[name]:error});

        setStudentinfo({...studentinfo,[name]:newValue});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let formErrors = {};
        Object.keys(studentinfo).forEach((name) => {
            const value = studentinfo[name];
            const error = handleValidation(name, value);
            if (error) {
                formErrors[name] = error;
            }
        });

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);  
            return;
        }

        const formData = new FormData();
        Object.entries(studentinfo).forEach(([key, value]) => {
            formData.append(key, value instanceof File ? value : value.toString());
        });

        axios.post(`${config.apiURL}/students/saveStudents`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
            .then((res) => {
                console.log("Success");
                navigate(-1);
                // Reset form after submission
                setStudentinfo({
                    staff_id: "",
                    cls_id: "",
                    sec_id: "",
                    stu_name: "",
                    stu_aadhar: "",
                    gender: "",
                    dob: "",
                    community: "",
                    cast_name: "",
                    religion: "",
                    father_name: "",
                    father_mobile: "",
                    father_occupation: "",
                    father_annual_income: "",
                    mother_name: "",
                    mother_mobile: "",
                    mother_occupation: "",
                    mother_annual_income: "",
                    address: "",
                    stu_img: null
                });
                setErrors({});
            })
            .catch((err) => {
                console.log("Error:", err);
            });
    };


    return (
        <div>
            <h1>Student Admission Form</h1>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            name="staff_id"
                            label="Select Staff"
                            onChange={handleChange}
                            value={studentinfo.staff_id}
                            error={!!errors.staff_id}
                            helperText={errors.staff_id}
                        >
                            {staffData.map((staff) => (
                                <MenuItem key={staff.staff_id} value={staff.staff_id}>{staff.staff_name}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Student Name"
                            variant="outlined"
                            name="stu_name"
                            value={studentinfo.stu_name}
                            error={!!errors.stu_name}
                            helperText={errors.stu_name}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Aadhar Number"
                            type='number'
                            name="stu_aadhar"
                            value={studentinfo.stu_aadhar}
                            variant="outlined"
                            error={!!errors.stu_aadhar}
                            helperText={errors.stu_aadhar}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            name="cls_id"
                            label="Class"
                            onChange={handleChange}
                            value={studentinfo.cls_id}
                            error={!!errors.cls_id}
                            helperText={errors.cls_id}
                        >
                            {clsData.map((cls) => (
                                <MenuItem key={cls.cls_id} value={cls.cls_id}>{cls.cls_name}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            name="sec_id"
                            label="Section"
                            onChange={handleChange}
                            value={studentinfo.sec_id}
                            error={!!errors.sec_id}
                            helperText={errors.sec_id}
                        >
                            {secData.map((sec) => (
                                <MenuItem key={sec.sec_id} value={sec.sec_id}>{sec.sec_name}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Date of Birth"
                            InputLabelProps={{ shrink: true }}
                            type='date'
                            name='dob'
                            onChange={handleChange}
                            value={studentinfo.dob}
                            variant="outlined"
                            error={!!errors.dob}
                            helperText={errors.dob}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            name='gender'
                            label="Gender"
                            onChange={handleChange}
                            value={studentinfo.gender}
                            error={!!errors.gender}
                            helperText={errors.gender}
                        >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="others">Others</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            name='cast_name'
                            label="Caste Name"
                            value={studentinfo.cast_name}
                            variant="outlined"
                            error={!!errors.cast_name}
                            helperText={errors.cast_name}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            name='religion'
                            label="Religion"
                            value={studentinfo.religion}
                            variant="outlined"
                            error={!!errors.religion}
                            helperText={errors.religion}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Community"
                            name='community'
                            value={studentinfo.community}
                            variant="outlined"
                            error={!!errors.community}
                            helperText={errors.community}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box
                            sx={{
                                width: '100%',
                                maxWidth: '100%',
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Address"
                                name='address'
                                onChange={handleChange}
                                id="fullWidth"
                                value={studentinfo.address}
                                variant="outlined"
                                error={!!errors.address}
                                helperText={errors.address}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Father Name"
                            name='father_name'
                            value={studentinfo.father_name}
                            variant="outlined"
                            error={!!errors.father_name}
                            helperText={errors.father_name}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Father Mobile"
                            name='father_mobile'
                            value={studentinfo.father_mobile}
                            variant="outlined"
                            error={!!errors.father_mobile}
                            helperText={errors.father_mobile}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Father Occupation"
                            name='father_occupation'
                            value={studentinfo.father_occupation}
                            variant="outlined"
                            error={!!errors.father_occupation}
                            helperText={errors.father_occupation}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Father Annual Income"
                            name='father_annual_income'
                            value={studentinfo.father_annual_income}
                            variant="outlined"
                            error={!!errors.father_annual_income}
                            helperText={errors.father_annual_income}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Mother Name"
                            name='mother_name'
                            value={studentinfo.mother_name}
                            variant="outlined"
                            error={!!errors.mother_name}
                            helperText={errors.mother_name}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Mother Mobile"
                            name='mother_mobile'
                            value={studentinfo.mother_mobile}
                            variant="outlined"
                            error={!!errors.mother_mobile}
                            helperText={errors.mother_mobile}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Mother Occupation"
                            name='mother_occupation'
                            value={studentinfo.mother_occupation}
                            variant="outlined"
                            error={!!errors.mother_occupation}
                            helperText={errors.mother_occupation}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Mother Annual Income"
                            name='mother_annual_income'
                            value={studentinfo.mother_annual_income}
                            variant="outlined"
                            error={!!errors.mother_annual_income}
                            helperText={errors.mother_annual_income}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            type='file'
                            label="Student Image"
                            name='stu_img'
                            variant="outlined"
                            error={!!errors.stu_img}
                            helperText={errors.stu_img}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color='success'
                            startIcon={<Done/>}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
}

export default StudentApplication;