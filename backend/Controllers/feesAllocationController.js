const express = require("express");
const router = express.Router();
const moment = require("moment");
const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
module.exports = (db) => {
  router.post("/saveFeesAllocation", async (req, res) => {
    try {
      const { roll_no, academic_year, fee_category, amount } = req.body;
      if (!roll_no) {
        return res.status(400).json({ message: "Roll number is required." });
      }
      if (!academic_year) {
        return res.status(400).json({ message: "Academic year is required." });
      }
      if (!fee_category) {
        return res.status(400).json({ message: "Fee category is required." });
      }
      if (!amount) {
        return res.status(400).json({ message: "Amount is required." });
      }
      const rollNoCheckQuery = `
                SELECT COUNT(*) AS count 
                FROM students_allocation 
                WHERE roll_no = ? AND academic_year = ?
            `;
      const [rollNoCheckResults] = await db.query(rollNoCheckQuery, [
        roll_no,
        academic_year,
      ]);
      if (rollNoCheckResults[0].count === 1) {
        const checkFeesForRollQuery = `
                    SELECT COUNT(*) AS count 
                    FROM fees_allocation 
                    WHERE roll_no = ? AND academic_year = ? AND fee_category = ?
                `;
        const [checkFeesForRollResults] = await db.query(
          checkFeesForRollQuery,
          [roll_no, academic_year, fee_category]
        );

        if (checkFeesForRollResults[0].count > 0) {
          return res.status(400).json({
            message: `Roll number ${roll_no} is already allocated this fee category (${fee_category}) for the academic year ${academic_year}.`,
          });
        } else {
          const insertQuery = `
                        INSERT INTO fees_allocation (roll_no, academic_year, fee_category, amount,remaining_amount, created_at) 
                        VALUES (?, ?, ?, ?, ?, ?)
                    `;
          await db.query(insertQuery, [
            roll_no,
            academic_year,
            fee_category,
            amount,
            amount,
            currentDate,
          ]);

          return res
            .status(200)
            .json({ message: "Fees allocation saved successfully." });
        }
      } else {
        return res.status(404).json({
          message: "Roll number not found for the given academic year.",
        });
      }
    } catch (err) {
      console.error("Error saving fees allocation data:", err);
      return res.status(500).json({ message: "Internal server error." });
    }
  });

  router.post("/saveFeesAllocationForClass", async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
  
    try {
      const feesAllocations = req.body; // Assuming req.body is an array of fees allocation objects
  
      if (!Array.isArray(feesAllocations) || feesAllocations.length === 0) {
        return res.status(400).json({ message: "No fees allocations provided." });
      }
  
      for (const allocation of feesAllocations) {
        const { roll_no, academic_year, fee_category, amount } = allocation;
  
        if (!roll_no || !academic_year || !fee_category || !amount) {
          await connection.rollback();
          return res.status(400).json({ message: "All fields are required." });
        }
  
        const rollNoCheckQuery = `
          SELECT COUNT(*) AS count 
          FROM students_allocation 
          WHERE roll_no = ? AND academic_year = ?
        `;
        const [rollNoCheckResults] = await connection.query(rollNoCheckQuery, [roll_no, academic_year]);
  
        if (rollNoCheckResults[0].count !== 1) {
          await connection.rollback();
          return res.status(404).json({ message: `Roll number ${roll_no} not found for the given academic year.` });
        }
  
        const checkFeesForRollQuery = `
          SELECT COUNT(*) AS count 
          FROM fees_allocation 
          WHERE roll_no = ? AND academic_year = ? AND fee_category = ?
        `;
        const [checkFeesForRollResults] = await connection.query(checkFeesForRollQuery, [roll_no, academic_year, fee_category]);
  
        if (checkFeesForRollResults[0].count > 0) {
          await connection.rollback();
          return res.status(400).json({ message: `Roll number ${roll_no} is already allocated this fee category (${fee_category}) for the academic year ${academic_year}.` });
        }
  
        const insertQuery = `
          INSERT INTO fees_allocation (roll_no, academic_year, fee_category, amount, remaining_amount, created_at) 
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        await connection.query(insertQuery, [roll_no, academic_year, fee_category, amount, amount, new Date()]);
      }
  
      await connection.commit();
      return res.status(200).json({ message: "Fees allocations saved successfully." });
    } catch (err) {
      await connection.rollback();
      console.error("Error saving fees allocation data:", err);
      return res.status(500).json({ message: "Internal server error." });
    } finally {
      connection.release();
    }
  });
  

  router.get("/getFeesAllocation", async (req, res) => {
    try {
      const getQuery = `
    SELECT 
    fee_all.fees_id,
    fee_all.roll_no,
    fee_all.academic_year,
    fee_all.fee_category,
    fee_all.amount,
    fee_all.remaining_amount,
    stu.stu_name,
    stu.stu_img,
    cls.cls_name,
    sec.sec_name
FROM 
    fees_allocation fee_all
INNER JOIN 
    students_allocation stu_all ON stu_all.roll_no = fee_all.roll_no
INNER JOIN 
    students_master stu ON stu.stu_id = stu_all.stu_id
INNER JOIN 
    class_allocation cls_all ON cls_all.cls_allocation_id = stu_all.cls_allocation_id
INNER JOIN 
    class cls ON cls.cls_id = cls_all.cls_id
INNER JOIN 
    sections sec ON sec.sec_id = cls_all.sec_id`;
      const [results] = await db.query(getQuery);
      if (results.length == 0) {
        return res
          .status(404)
          .json({ message: "Fees Allocation data not found." });
      } else {
        const convertData = results.map((result) => ({
          ...result,
          stu_img: `http://localhost:3001/uploads/${result.stu_img}`,
        }));
        return res.status(200).json(convertData);
      }
    } catch (error) {
      console.error("Error fetching Fees Allocation data:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  });

  router.put("/updateFeesAllocation/:fees_id", async (req, res) => {
    try {
      const feeId = req.params.fees_id;
      const { roll_no, academic_year, fee_category, amount } = req.body;
      if (!roll_no) {
        return res.status(400).json({ message: "Roll number is required." });
      }
      if (!academic_year) {
        return res.status(400).json({ message: "Academic year is required." });
      }
      if (!fee_category) {
        return res.status(400).json({ message: "Fee category is required." });
      }
      if (!amount) {
        return res.status(400).json({ message: "Amount is required." });
      }
      const rollNoCheckQuery = `
                SELECT COUNT(*) AS count 
                FROM students_allocation 
                WHERE roll_no = ? AND academic_year = ?
            `;
      const [rollNoCheckResults] = await db.query(rollNoCheckQuery, [
        roll_no,
        academic_year,
      ]);
      if (rollNoCheckResults[0].count === 1) {
        const checkFeesForRollQuery = `
                    SELECT COUNT(*) AS count 
                    FROM fees_allocation 
                    WHERE roll_no = ? AND academic_year = ? AND fee_category = ? and fees_id !=?
                `;
        const [checkFeesForRollResults] = await db.query(
          checkFeesForRollQuery,
          [roll_no, academic_year, fee_category, feeId]
        );

        if (checkFeesForRollResults[0].count > 0) {
          return res.status(400).json({
            message: `Roll number ${roll_no} is already allocated this fee category (${fee_category}) for the academic year ${academic_year}.`,
          });
        } else {
          const insertQuery = `
                        update fees_allocation set roll_no = ?,academic_year = ?, fee_category = ?, amount = ? ,updated_at =? where fees_id = ?
                    `;
          await db.query(insertQuery, [
            roll_no,
            academic_year,
            fee_category,
            amount,
            currentDate,
            feeId,
          ]);

          return res
            .status(200)
            .json({ message: "Fees allocation Updated successfully." });
        }
      } else {
        return res.status(404).json({
          message: "Roll number not found for the given academic year.",
        });
      }
    } catch (err) {
      console.log("Error update fees allocation data :", err);
      return res.status(500).json({ message: "Internal server error." });
    }
  });

  router.delete("/deleteFeesAllocation/:fees_id", async (req, res) => {
    try {
      const feeId = req.params.fees_id;
      if (!feeId) {
        return res.status(400).json({ message: "Fees ID is required." });
      }
      const deleteQuery = `delete from fees_allocation where fees_id = ?`;
      const [results] = await db.query(deleteQuery, [feeId]);
      if (results.affectedRows === 0) {
        return res.status(404).json({
          message: "Fees Allocation data not found or no data deleted",
        });
      } else {
        return res
          .status(200)
          .json({ message: "Fees Allocation deleted successfully." });
      }
    } catch (err) {
      console.log("Error delete fees allocation data :", err);
      return res.status(500).json({ message: "Internal server error." });
    }
  });

  return router;
};
