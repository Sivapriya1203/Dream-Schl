const express = require("express");
const router = express.Router();
const moment = require("moment");
const multer = require("multer");
const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
module.exports = (db, upload) => {

  router.post("/saveStudents", upload.single("stu_img"), async (req, res) => {
    try {
      const {
        staff_id,
        cls_id,
        sec_id,
        stu_name,
        stu_aadhar,
        gender,
        dob,
        community,
        cast_name,
        religion,
        father_name,
        father_mobile,
        father_occupation,
        father_annual_income,
        mother_name,
        mother_mobile,
        mother_occupation,
        mother_annual_income,
        address,
      } = req.body;

      const stu_img = req.file ? req.file.filename : null;

      if (
        !staff_id ||
        !cls_id ||
        !sec_id ||
        !stu_name ||
        !stu_aadhar ||
        !gender ||
        !dob ||
        !community ||
        !cast_name ||
        !religion ||
        !father_name ||
        !father_mobile ||
        !father_occupation ||
        !father_annual_income ||
        !mother_name ||
        !mother_mobile ||
        !mother_occupation ||
        !mother_annual_income ||
        !address ||
        !stu_img
      ) {
        return res.status(400).json({ message: "All fields are required." });
      }

      const existingStudentQuery = `SELECT * FROM students_master WHERE stu_aadhar = ?`;
      const [existingStudentResult] = await db.query(existingStudentQuery, [
        stu_aadhar,
      ]);

      if (existingStudentResult.length > 0) {
        return res
          .status(400)
          .json({
            message: "Student already exists with the same Aadhar number.",
          });
      }

      const apply_date = moment().format("YYYY-MM-DD");

      const saveQuery = `
              INSERT INTO students_master 
              (staff_id, cls_id, sec_id, stu_name, stu_aadhar, stu_img, gender, dob, community, cast_name, religion, 
              father_name, father_mobile, father_occupation, father_annual_income, mother_name, mother_mobile, 
              mother_occupation, mother_annual_income, address, apply_date, created_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

      const saveParams = [
        staff_id,
        cls_id,
        sec_id,
        stu_name,
        stu_aadhar,
        stu_img,
        gender,
        dob,
        community,
        cast_name,
        religion,
        father_name,
        father_mobile,
        father_occupation,
        father_annual_income,
        mother_name,
        mother_mobile,
        mother_occupation,
        mother_annual_income,
        address,
        apply_date,
        currentDate,
      ];

      const [results] = await db.query(saveQuery, saveParams);

      if (results.affectedRows === 1) {
        return res
          .status(200)
          .json({ message: "Student data saved successfully." });
      } else {
        return res
          .status(500)
          .json({ message: "Failed to save student data." });
      }
    } catch (err) {
      console.log("Error saving student data:", err);
      return res.status(500).json({ message: "Internal server error." });
    }
  });

  router.get("/getStudentsReg", async (req, res) => {
    try {
      const getQuery = `select students_master.*,staff.staff_name,cls.cls_name,sec.sec_name from students_master inner join staffs_master staff on staff.staff_id = students_master.staff_id inner join class cls on students_master.cls_id = cls.cls_id 
          inner join sections sec on students_master.sec_id = sec.sec_id where students_master.isAllocated = 0 `;
      const [results] = await db.query(getQuery);
      if (results.length == 0) {
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

  router.get("/getStudents", async (req, res) => {
    try {
      const getQuery = `select * from students_master`;
      const [results] = await db.query(getQuery);
      if (results.length == 0) {
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

  router.put(
    "/updateStudent/:stu_id",
    upload.single("stu_img"),
    async (req, res) => {
      try {
        const stuId = req.params.stu_id;
        const {
          staff_id,
          cls_id,
          sec_id,
          stu_name,
          stu_aadhar,
          gender,
          dob,
          community,
          cast_name,
          religion,
          father_name,
          father_mobile,
          father_occupation,
          father_annual_income,
          mother_name,
          mother_mobile,
          mother_occupation,
          mother_annual_income,
          address,
        } = req.body;
        const stu_img = req.file ? req.file.filename : null;

        if (
          !staff_id ||
          !cls_id ||
          !sec_id ||
          !stu_name ||
          !stu_aadhar ||
          !gender ||
          !dob ||
          !community ||
          !cast_name ||
          !religion ||
          !father_name ||
          !father_mobile ||
          !father_occupation ||
          !father_annual_income ||
          !mother_name ||
          !mother_mobile ||
          !mother_occupation ||
          !mother_annual_income ||
          !address
        ) {
          return res.status(400).json({ message: "All fields are required." });
        }

        const existingStudentQuery = `SELECT * FROM students_master WHERE stu_aadhar = ? AND stu_id != ?`;
        const [existingStudentResult] = await db.query(existingStudentQuery, [
          stu_aadhar,
          stuId,
        ]);

        if (existingStudentResult.length > 0) {
          return res
            .status(400)
            .json({
              message: "Student already exists with the same Aadhar number.",
            });
        }

        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");

        let updateQuery = ``;
        let updateParams = [];

        if (stu_img) {
          updateQuery = `
                    UPDATE students_master 
                    SET staff_id = ?, cls_id = ?, sec_id = ?, stu_name = ?, stu_aadhar = ?, stu_img = ?, gender = ?, dob = ?, 
                        community = ?, cast_name = ?, religion = ?, father_name = ?, father_mobile = ?, father_occupation = ?, 
                        father_annual_income = ?, mother_name = ?, mother_mobile = ?, mother_occupation = ?, 
                        mother_annual_income = ?, address = ?, updated_at = ? 
                    WHERE stu_id = ?
                `;
          updateParams = [
            staff_id,
            cls_id,
            sec_id,
            stu_name,
            stu_aadhar,
            stu_img,
            gender,
            dob,
            community,
            cast_name,
            religion,
            father_name,
            father_mobile,
            father_occupation,
            father_annual_income,
            mother_name,
            mother_mobile,
            mother_occupation,
            mother_annual_income,
            address,
            currentDate,
            stuId,
          ];
        } else {
          updateQuery = `
                    UPDATE students_master 
                    SET staff_id = ?, cls_id = ?, sec_id = ?, stu_name = ?, stu_aadhar = ?, gender = ?, dob = ?, 
                        community = ?, cast_name = ?, religion = ?, father_name = ?, father_mobile = ?, father_occupation = ?, 
                        father_annual_income = ?, mother_name = ?, mother_mobile = ?, mother_occupation = ?, 
                        mother_annual_income = ?, address = ?, updated_at = ? 
                    WHERE stu_id = ?
                `;
          updateParams = [
            staff_id,
            cls_id,
            sec_id,
            stu_name,
            stu_aadhar,
            gender,
            dob,
            community,
            cast_name,
            religion,
            father_name,
            father_mobile,
            father_occupation,
            father_annual_income,
            mother_name,
            mother_mobile,
            mother_occupation,
            mother_annual_income,
            address,
            currentDate,
            stuId,
          ];
        }

        const [results] = await db.query(updateQuery, updateParams);

        if (results.affectedRows === 0) {
          return res
            .status(404)
            .json({ message: "Student data not found or no changes made." });
        } else {
          return res
            .status(200)
            .json({ message: "Student data updated successfully." });
        }
      } catch (err) {
        console.log("Error updating student data:", err);
        return res.status(500).json({ message: "Internal server error." });
      }
    }
  );

  router.delete("/deleteStudent/:stuId", async (req, res) => {
    try {
      const stuId = req.params.stuId;
      if (!stuId) {
        return res.status(400).json({ message: "Student ID is required." });
      }
      const deleteQuery = `delete from students_master where stu_id = ?`;
      const [results] = await db.query(deleteQuery, [stuId]);
      if (results.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Student data not found or no data deleted" });
      } else {
        return res
          .status(200)
          .json({ message: "Student data deleted successfully." });
      }
    } catch (err) {
      console.log("Error deleting staff data :", err);
      return res.status(500).json({ message: "Internal server error." });
    }
  });

  router.get("/getSiblings", async (req, res) => {
    try {
        const getQuery = `
            SELECT 
                sm.stu_name,
                sm.stu_img,
                sa.roll_no,
                sm.father_name,
                sm.mother_name,
                sa.stu_allocation_id,
                c.cls_name,
                s.sec_name
            FROM 
                students_master sm
            JOIN 
                students_allocation sa ON sm.stu_id = sa.stu_id
            JOIN 
                class_allocation ca ON ca.cls_allocation_id = sa.cls_allocation_id
            JOIN 
                class c ON c.cls_id = ca.cls_id
            JOIN
                sections s ON s.sec_id = ca.sec_id
            JOIN 
                students_master sibling ON sibling.father_name = sm.father_name 
                                       AND sibling.mother_name = sm.mother_name 
                                       AND sibling.father_mobile = sm.father_mobile 
                                       AND sibling.mother_mobile = sm.mother_mobile 
                                       AND sibling.stu_id != sm.stu_id
            ORDER BY 
                sa.academic_year ASC`;
                
        const [getResult] = await db.query(getQuery);
        
        const siblingsCount = getResult.length;
        
        if (siblingsCount > 0) {
            const convertData = getResult.map((result)=>({
                ...result,
                stu_img :`http://localhost:3001/uploads/${result.stu_img}`,
            }))
            res.status(200).json({ siblingsCount, siblingsData: convertData });
        } else {
            // No siblings found
            res.status(200).json({ siblingsCount: 0, siblingsData: [] });
        }
    } catch (err) {
        console.log("Error fetching siblings data:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
return router;

};
