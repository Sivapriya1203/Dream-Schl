// const express = require('express');
// const router = express.Router();
// const moment = require('moment');
// const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

// module.exports = (db) => {

   
//     router.get(`/classstudents/:staff_id`,async(req,res)=>{
//         try{
//             const getQuery =` select stu.* from students_master as stu
//              inner join class_teachers as cls
//               on stu.cls_allocation_id = cls.cls_allocation_id	where cls.staff_id = ?`
//               const id = req.params.staff_id;
//                console.log(id)
//               const [results] = await db.query(getQuery,[id]);
//               if (results.length == 0) {
//                 return res.status(404).json({ message: "Students data not found." });
//               } else {
//                 const convertData = results.map((result) => ({
//                   ...result,
//                   stu_img: `http://localhost:3001/uploads/${result.stu_img}`,
//                 }));
//                 return res.status(200).json(convertData);
//               }
//             } catch (error) {
//               console.error("Error fetching Students data:", error);
//               return res.status(500).json({ message: "Internal server error." });      
//         }
//     })
//     router.post('/saveStudents', async (req, res) => {
//       try {
//           const { student_id, student_name, date, status, } = req.body;

//           // Assuming the student_attendance table has columns: student_id, date, status
//           const insertQuery = `INSERT INTO student_attendance (student_id, student_name, date, status)
//                                VALUES (?, ?, ? ,?)
//                                ON DUPLICATE KEY UPDATE status = VALUES(status)`;

//           await db.query(insertQuery, [student_id, student_name, date, status]);

//           return res.status(200).json({ message: "Attendance updated successfully." });
        
//       } catch (error) {
//           console.error("Error updating attendance data:", error);
//           return res.status(500).json({ message: "Internal server error." });
//       }
//   });

    
    
//     return router;
// };



// const express = require('express');
// const router = express.Router();
// const moment = require('moment');
// const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

// module.exports = (db) => {

//     // GET method to retrieve students associated with a specific staff member
//     router.get('/classstudents/:staff_id', async (req, res) => {
//         try {
//             const getQuery = `
//                 SELECT stu.*
//                 FROM students_master AS stu
//                 INNER JOIN class_teachers AS cls
//                 ON stu.cls_allocation_id = cls.cls_allocation_id
//                 WHERE cls.staff_id = ?
//             `;
//             const id = req.params.staff_id;
//             console.log(id);

//             const [results] = await db.query(getQuery, [id]);

//             if (results.length === 0) {
//                 return res.status(404).json({ message: "Students data not found." });
//             } else {
//                 const convertData = results.map((result) => ({
//                     ...result,
//                     stu_img: `http://localhost:3001/uploads/${result.stu_img}`,
//                 }));
//                 return res.status(200).json(convertData);
//             }
//         } catch (error) {
//             console.error("Error fetching Students data:", error);
//             return res.status(500).json({ message: "Internal server error." });
//         }
//     });

//     // POST method to save or update student attendance
//     router.post('/saveStudents', async (req, res) => {
//         try {
//             const { student_id, student_name, date, status } = req.body;

//             const insertQuery = `
//                 INSERT INTO student_attendance (student_id, student_name, date, status)
//                 VALUES (?, ?, ?, ?)
//                 ON DUPLICATE KEY UPDATE status = VALUES(status)
//             `;

//             await db.query(insertQuery, [student_id, student_name, date, status]);

//             return res.status(200).json({ message: "Attendance updated successfully." });
//         } catch (error) {
//             console.error("Error updating attendance data:", error);
//             return res.status(500).json({ message: "Internal server error." });
//         }
//     });

//     return router;
// };


// const express = require('express');
// const router = express.Router();
// const moment = require('moment');
// const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

// module.exports = (db) => {

//     // GET method to retrieve students associated with a specific staff member
//     router.get('/classstudents/:staff_id', async (req, res) => {
//         try {
//             const getQuery = `
//                 SELECT stu.*
//                 FROM students_master AS stu
//                 INNER JOIN class_teachers AS cls
//                 ON stu.cls_allocation_id = cls.cls_allocation_id
//                 WHERE cls.staff_id = ?
//             `;
//             const id = req.params.staff_id;
//             console.log(id);

//             const [results] = await db.query(getQuery, [id]);

//             if (results.length === 0) {
//                 return res.status(404).json({ message: "Students data not found." });
//             } else {
//                 const convertData = results.map((result) => ({
//                     ...result,
//                     stu_img: `http://localhost:3001/uploads/${result.stu_img}`,
//                 }));
//                 return res.status(200).json(convertData);
//             }
//         } catch (error) {
//             console.error("Error fetching Students data:", error);
//             return res.status(500).json({ message: "Internal server error." });
//         }
//     });

//     // POST method to save or update student attendance
//     router.post('/saveAttendance', async (req, res) => {
//         try {
//             const { student_id, student_name, date, status } = req.body;

//             const insertQuery = `
//                 INSERT INTO attanance_detail (student_id, student_name, date, status)
//                 VALUES (?, ?, ?, ?)
//                 ON DUPLICATE KEY UPDATE status = VALUES(status)
//             `;

//             await db.query(insertQuery, [student_id, student_name, date, status]);

//             return res.status(200).json({ message: "Attendance updated successfully." });
//         } catch (error) {
//             console.error("Error updating attendance data:", error);
//             return res.status(500).json({ message: "Internal server error." });
//         }
//     });

//     return router;
// };

const express = require('express');
const router = express.Router();
const moment = require('moment');
const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

module.exports = (db) => {

    // GET method to retrieve students associated with a specific staff member
    router.get('/classstudents/:staff_id', async (req, res) => {
        try {
            const getQuery = `
                SELECT stu.*
                FROM students_master AS stu
                INNER JOIN class_teachers AS cls
                ON stu.cls_allocation_id = cls.cls_allocation_id
                WHERE cls.staff_id = ?
            `;
            const id = req.params.staff_id;
            console.log(id);

            const [results] = await db.query(getQuery, [id]);

            if (results.length === 0) {
                return res.status(404).json({ message: "Students data not found." });
            } else {
                const convertData = results.map((result) => ({
                    ...result,
                    stu_img: `http://localhost:3001/uploads/${result.stu_img}`,
                }));
                return res.status(200).json(convertData);
            }
        } catch (error) {
            console.error("Error fetching Students data:", error);
            return res.status(500).json({ message: "Internal server error." });
        }
    });

    // POST method to save or update student attendance
    router.post('/saveAttendance', async (req, res) => {
        try {
            const { student_id, student_name, date, status } = req.body;

            const insertQuery = `
                INSERT INTO attendance_detail (student_id, student_name, date, status)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE status = VALUES(status)
            `;

            await db.query(insertQuery, [student_id, student_name, date, status]);

            return res.status(200).json({ message: "Attendance updated successfully." });
        } catch (error) {
            console.error("Error updating attendance data:", error);
            return res.status(500).json({ message: "Internal server error." });
        }
    });

    return router;
};

