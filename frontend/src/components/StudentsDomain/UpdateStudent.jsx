import React, { useEffect, useState } from 'react';
import { Grid, MenuItem, Select, TextField, Button, Box } from '@mui/material';
import axios from 'axios';
import config from '../../config';
import { Done } from '@mui/icons-material';

function UpdateStudent({ data, onClose }) {
    const [staffData, setStaffData] = useState([]);
    const [clsData, setClsData] = useState([]);
    const [secData, setSecData] = useState([]);
    const [studentinfo, setStudentinfo] = useState({
        staff_id: data ? data.staff_id : '',
        cls_id: data ? data.cls_id : '',
        sec_id: data ? data.sec_id : '',
        stu_name: data ? data.stu_name : '',
        stu_aadhar: data ? data.stu_aadhar : '',
        gender: data ? data.gender : '',
        dob: data ? data.dob : '',
        community: data ? data.community : '',
        cast_name: data ? data.cast_name : '',
        religion: data ? data.religion : '',
        father_name: data ? data.father_name : '',
        father_mobile: data ? data.father_mobile : '',
        father_occupation: data ? data.father_occupation : '',
        father_annual_income: data ? data.father_annual_income : '',
        mother_name: data ? data.mother_name : '',
        mother_mobile: data ? data.mother_mobile : '',
        mother_occupation: data ? data.mother_occupation : '',
        mother_annual_income: data ? data.mother_annual_income : '',
        address: data ? data.address : '',
        stu_img: null,
    });

    const [errors, setErrors] = useState({
        staff_id: '',
        cls_id: '',
        sec_id: '',
        stu_name: '',
        stu_aadhar: '',
        gender: '',
        dob: '',
        community: '',
        cast_name: '',
        religion: '',
        father_name: '',
        father_mobile: '',
        father_occupation: '',
        father_annual_income: '',
        mother_name: '',
        mother_mobile: '',
        mother_occupation: '',
        mother_annual_income: '',
        address: '',
        stu_img: '',
    });

    const handleValidation = (name, value) => {
        const trimmedValue = value && typeof value === 'string' ? value.trim() : value;
        let errmsg = '';
        const validatePhoneNumber = (phone) => /^[6-9]\d{9}$/.test(phone);
        const validateAadhar = (aadhar) => /^\d{12}$/.test(aadhar);
        const validateAnnualIncome = (income) => /^\d+(\.\d{1,2})?$/.test(income);
        const validateDate = (date) => {
            const datePattern = /^\d{4}-\d{2}-\d{2}$/;
            return datePattern.test(date);
        };

        // Validation for each field
        switch (name) {
            case 'staff_id':
                if (!trimmedValue) errmsg = 'Please select Staff Name';
                break;
            case 'cls_id':
                if (!trimmedValue) errmsg = 'Please select Class';
                break;
            case 'sec_id':
                if (!trimmedValue) errmsg = 'Please select Section';
                break;
            case 'stu_name':
                if (!trimmedValue) errmsg = 'Please enter Student Name';
                break;
            case 'stu_aadhar':
                if (!validateAadhar(trimmedValue)) errmsg = 'Please enter a valid 12-digit Aadhar number';
                break;
            case 'gender':
                if (!trimmedValue) errmsg = 'Please select Gender';
                break;
            case 'dob':
                if (!validateDate(trimmedValue)) errmsg = 'Please enter a valid Date of Birth';
                break;
            case 'community':
                if (!trimmedValue) errmsg = 'Please enter Community';
                break;
            case 'cast_name':
                if (!trimmedValue) errmsg = 'Please enter Caste Name';
                break;
            case 'religion':
                if (!trimmedValue) errmsg = 'Please enter Religion';
                break;
            case 'father_name':
                if (!trimmedValue) errmsg = "Please enter Father's Name";
                break;
            case 'father_mobile':
                if (!validatePhoneNumber(trimmedValue)) errmsg = 'Please enter a valid mobile number';
                break;
            case 'father_occupation':
                if (!trimmedValue) errmsg = "Please enter Father's Occupation";
                break;
            case 'father_annual_income':
                if (!validateAnnualIncome(trimmedValue)) errmsg = 'Please enter a valid annual income';
                break;
            case 'mother_name':
                if (!trimmedValue) errmsg = "Please enter Mother's Name";
                break;
            case 'mother_mobile':
                if (!validatePhoneNumber(trimmedValue)) errmsg = 'Please enter a valid mobile number';
                break;
            case 'mother_occupation':
                if (!trimmedValue) errmsg = "Please enter Mother's Occupation";
                break;
            case 'mother_annual_income':
                if (!validateAnnualIncome(trimmedValue)) errmsg = 'Please enter a valid annual income';
                break;
            case 'address':
                if (!trimmedValue) errmsg = 'Please enter Address';
                break;
            case 'stu_img':
                if (!value) errmsg = 'Please upload Student Image';
                break;
            default:
                break;
        }

        return errmsg;
    };

    useEffect(() => {
        axios
            .get(`${config.apiURL}/staffs/getStaffs`)
            .then((res) => {
                setStaffData(res.data);
            })
            .catch((err) => {
                console.log('Error fetching staff data:', err);
            });

        axios
            .get(`${config.apiURL}/clsAndSec/getClass`)
            .then((res) => {
                setClsData(res.data);
            })
            .catch((err) => {
                console.log('Error fetching Class data', err);
            });

        axios
            .get(`${config.apiURL}/clsAndSec/getSection`)
            .then((res) => {
                setSecData(res.data);
            })
            .catch((err) => {
                console.log('error in fetching section data :', err);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        const newValue = files ? files[0] : value; // If it's a file input, get the file, otherwise get the value
        const error = handleValidation(name, value);
        setErrors({ ...errors, [name]: error });
        setStudentinfo({ ...studentinfo, [name]: newValue });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formerrors = {};
        Object.keys(studentinfo).forEach((name) => {
            const value = studentinfo[name];
            const error = handleValidation(name, value);
            if (error) {
                formerrors[name] = error;
            }
        });

        if (Object.keys(formerrors).length > 0) {
            setErrors(formerrors);
        }

        const formData = new FormData();

        // Append all fields to the FormData object
        Object.entries(studentinfo).forEach(([key, value]) => {
            // Check if the value is a File object (for the image)
            if (value instanceof File) {
                formData.append(key, value, value.name); // Append the file with its name
            } else {
                formData.append(key, value); // Append other fields as they are
            }
        });

        axios
            .put(`${config.apiURL}/students/updateStudent/${data.stu_id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((res) => {
                console.log('Success');
                console.log('Data:', studentinfo);
                onClose();
            })
            .catch((err) => {
                console.log('Error:', err);
                console.log('Data:', studentinfo);
            });
    };

    return (
        <div>
            <h1>Update Admission form</h1>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            name="staff_id"
                            label="Select Staff"
                            onChange={handleChange}
                            error={!!errors.staff_id}
                            helperText={errors.staff_id}
                            value={studentinfo.staff_id}
                        >
                            {staffData.map((staff) => (
                                <MenuItem key={staff.staff_id} value={staff.staff_id}>
                                    {staff.staff_name}
                                </MenuItem>
                            ))}
                        </TextField>
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
                                <MenuItem key={cls.cls_id} value={cls.cls_id}>
                                    {cls.cls_name}
                                </MenuItem>
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
                                <MenuItem key={sec.sec_id} value={sec.sec_id}>
                                    {sec.sec_name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Student name"
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
                            label="Aadhar number"
                            type="number"
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
                            label="Date of Birth"
                            InputLabelProps={{ shrink: true }}
                            type="date"
                            name="dob"
                            onChange={handleChange}
                            value={studentinfo.dob}
                            variant="outlined"
                            error={!!errors.dob}
                            helperText={errors.dob}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Select
                            labelId="gender-select-label"
                            id="gender-select"
                            value={studentinfo.gender}
                            onChange={handleChange}
                            name="gender"
                            label="Gender"
                            fullWidth
                            error={!!errors.gender}
                            helperText={errors.gender}
                        >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="others">Others</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="cast_name"
                            name="cast_name"
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
                            label="Religion"
                            name="religion"
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
                            name="community"
                            value={studentinfo.community}
                            variant="outlined"
                            error={!!errors.community}
                            helperText={errors.community}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ width: '100%', maxWidth: '100%' }}>
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
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
                            label="Father name"
                            name="father_name"
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
                            name="father_mobile"
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
                            name="father_occupation"
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
                            name="father_annual_income"
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
                            label="Mother name"
                            name="mother_name"
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
                            name="mother_mobile"
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
                            name="mother_occupation"
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
                            name="mother_annual_income"
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
                            type="file"
                            label="Student image"
                            name="stu_img"
                            accept="image/*"
                            variant="outlined"
                            error={!!errors.stu_img}
                            helperText={errors.stu_img}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button type="submit" variant="contained" startIcon={<Done/>} color="success">
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
}

export default UpdateStudent;
