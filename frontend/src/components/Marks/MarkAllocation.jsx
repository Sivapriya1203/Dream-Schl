import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from 'config';

const MarkAllocation = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  const staff_id = sessionStorage.getItem('staff_id')
  // Fetch students on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await  axios.get(`${config.apiURL}/attenance/classstudents/${staff_id}`)
        const studentsWithMarks = response.data.map(student => ({
          ...student,
          english: '',
          hindi: '',
          mathematics: '',
          science: '',
          socialScience: '',
          total: 0,
          class: student.class || '', // Assuming the API response includes a 'class' field
        }));
        setStudents(studentsWithMarks);
        setFilteredStudents(studentsWithMarks);
      } catch (error) {
        console.log('Error:', error);
      }
    };
    fetchStudents();
  }, []);

  // Handle input changes for each student row
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedStudents = [...filteredStudents];
    updatedStudents[index][name] = value;
    updatedStudents[index].total = 
      (parseInt(updatedStudents[index].english, 10) || 0) +
      (parseInt(updatedStudents[index].hindi, 10) || 0) +
      (parseInt(updatedStudents[index].mathematics, 10) || 0) +
      (parseInt(updatedStudents[index].science, 10) || 0) +
      (parseInt(updatedStudents[index].socialScience, 10) || 0);
    setFilteredStudents(updatedStudents);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${config.apiURL}/students/saveStudentMarks`, filteredStudents);
      alert('Marks saved successfully!');
    } catch (error) {
      console.error('There was an error saving the marks!', error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterStudents(query, selectedClass);
  };

  const handleClassFilter = (e) => {
    const selectedClass = e.target.value;
    setSelectedClass(selectedClass);
    filterStudents(searchQuery, selectedClass);
  };

  const filterStudents = (query, classFilter) => {
    const filtered = students.filter(student => 
      (student.stu_name.toLowerCase().includes(query) || student.stu_id.toString().includes(query)) &&
      (classFilter === '' || student.class === classFilter)
    );
    setFilteredStudents(filtered);
  };

  const tableStyle = {
    border: '2px solid #333',
    borderRadius: '8px',
    backgroundColor: '#f8f9fa',
  };

  const cellStyle = {
    textAlign: 'center',
    verticalAlign: 'middle',
  };

  const theadStyle = {
    backgroundColor: '#343a40',
    color: '#fff',
  };

  return (
    <div className="container mt-5">
      <div className="d-flex mb-3">
        <input
          type="text"
          placeholder="Search by name or ID"
          value={searchQuery}
          onChange={handleSearch}
          className="form-control mr-2"
        />
        <select className="form-control" value={selectedClass} onChange={handleClassFilter}>
          <option value="">All Classes</option>
          <option value="Class 1">A</option>
          <option value="Class 2">B</option>
          <option value="Class 3">Class 3</option>
          {/* Add more class options as needed */}
        </select>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table className="table table-striped table-bordered table-hover" style={tableStyle}>
            <thead className="thead-dark" style={theadStyle}>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Class</th>
                <th>English</th>
                <th>Hindi</th>
                <th>Mathematics</th>
                <th>Science</th>
                <th>Social Science</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student.stu_id} style={cellStyle}>
                  <td>{student.stu_id}</td>
                  <td>{student.stu_name}</td>
                  <td>{student.class}</td>
                  <td><input type="number" name="english" value={student.english} onChange={(e) => handleInputChange(e, index)} /></td>
                  <td><input type="number" name="hindi" value={student.hindi} onChange={(e) => handleInputChange(e, index)} /></td>
                  <td><input type="number" name="mathematics" value={student.mathematics} onChange={(e) => handleInputChange(e, index)} /></td>
                  <td><input type="number" name="science" value={student.science} onChange={(e) => handleInputChange(e, index)} /></td>
                  <td><input type="number" name="socialScience" value={student.socialScience} onChange={(e) => handleInputChange(e, index)} /></td>
                  <td><input type="number" name="total" value={student.total} readOnly /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="submit" className="btn btn-primary mt-3">Save</button>
      </form>
    </div>
  );
};

export default MarkAllocation;
