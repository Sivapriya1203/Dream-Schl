const express = require('express');
const router = express.Router();
const moment = require('moment');
const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');


module.exports = (db) => {
router.post('/saveStudentMarks', async (req, res) => {
  try {
    const { studentId, studentName, english, hindi, mathematics, science, socialScience } = req.body;

    if (
      !studentId ||
      !studentName ||
      english === undefined ||
      hindi === undefined ||
      mathematics === undefined ||
      science === undefined ||
      socialScience === undefined
    ) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const total = english + hindi + mathematics + science + socialScience;
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

    const existingMarksQuery = `SELECT * FROM student_marks WHERE student_id = ?`;
    const [existingMarksResult] = await db.query(existingMarksQuery, [studentId]);

    let query;
    let queryParams;

    if (existingMarksResult.length > 0) {
      // Update existing marks
      query = `
        UPDATE student_marks
        SET student_name = ?, english = ?, hindi = ?, mathematics = ?, science = ?, social_science = ?, total = ?, updated_at = ?
        WHERE student_id = ?
      `;
      queryParams = [studentName, english, hindi, mathematics, science, socialScience, total, currentDate, studentId];
    } else {
      // Insert new marks
      query = `
        INSERT INTO student_marks (student_id, student_name, english, hindi, mathematics, science, social_science, total, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      queryParams = [studentId, studentName, english, hindi, mathematics, science, socialScience, total, currentDate, currentDate];
    }

    const [result] = await db.query(query, queryParams);

    if (result.affectedRows === 1) {
      return res.status(200).json({ message: 'Student marks saved successfully.' });
    } else {
      return res.status(500).json({ message: 'Failed to save student marks.' });
    }
  } catch (err) {
    console.error('Error saving student marks:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

router.get('/students/getStudents/:staff_id', (req, res) => {
  const { staff_id } = req.params;
  const query = 'SELECT * FROM students WHERE staff_id = ?';

  connection.query(query, [staff_id], (err, results) => {
      if (err) {
          console.error('Error fetching students:', err);
          res.status(500).json({ error: 'Failed to fetch students' });
          return;
      }
      res.status(200).json(results);
  });
});
return router;
}


 




