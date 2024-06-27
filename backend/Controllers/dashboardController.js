const express = require('express');
const router = express.Router();
const moment = require('moment');

module.exports = (db) =>{

    router.get('/feesLogs/day', async (req, res) => {
        try {
            const dayQuery = `
            SELECT 
    days.day_name,
    IFNULL(SUM(fl.total_paid_amount), 0) AS total_paid_amount_current_week
FROM 
    (
        SELECT 'Sunday' AS day_name
        UNION SELECT 'Monday' UNION SELECT 'Tuesday' UNION SELECT 'Wednesday'
        UNION SELECT 'Thursday' UNION SELECT 'Friday' UNION SELECT 'Saturday'
    ) AS days
LEFT JOIN (
    SELECT 
        DAYNAME(fl.payment_date) AS day_name,
        SUM(fl.paid_amount) AS total_paid_amount
    FROM 
        fees_logs fl
    WHERE 
        fl.payment_date BETWEEN DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY) AND DATE_ADD(CURDATE(), INTERVAL 6 - WEEKDAY(CURDATE()) DAY)
    GROUP BY 
        DAYNAME(fl.payment_date)
) AS fl ON days.day_name = fl.day_name
GROUP BY 
    days.day_name
ORDER BY 
    CASE 
        WHEN days.day_name = 'Sunday' THEN 1
        WHEN days.day_name = 'Monday' THEN 2
        WHEN days.day_name = 'Tuesday' THEN 3
        WHEN days.day_name = 'Wednesday' THEN 4
        WHEN days.day_name = 'Thursday' THEN 5
        WHEN days.day_name = 'Friday' THEN 6
        ELSE 7
    END;
        
            `;
            const [results] = await db.query(dayQuery);
            res.status(200).json(results);
        } catch (err) {
            console.error("Error fetching day fees logs data:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    });

    router.get('/feesLogs/week', async (req, res) => {
        try {
            const weekQuery = `
                SELECT 
                    fa.roll_no,
                    fa.academic_year,
                    fa.fee_category,
                    fa.amount,
                    IFNULL(SUM(fl.paid_amount), 0) AS total_paid,
                    (fa.amount - IFNULL(SUM(fl.paid_amount), 0)) AS remaining_amount,
                    YEARWEEK(fl.payment_date, 1) AS week
                FROM 
                    fees_allocation fa
                LEFT JOIN 
                    fees_logs fl ON fa.fees_id = fl.fees_id
                GROUP BY 
                    fa.roll_no, fa.academic_year, fa.fee_category, fa.amount, week
                ORDER BY 
                    fa.roll_no, week;
            `;
            const [results] = await db.query(weekQuery);
            res.status(200).json(results);
        } catch (err) {
            console.error("Error fetching week-wise fees logs data:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    });

    router.get('/feesLogs/month', async (req, res) => {
        try {
            const monthQuery = `
                SELECT 
                    fa.roll_no,
                    fa.academic_year,
                    fa.fee_category,
                    fa.amount,
                    IFNULL(SUM(fl.paid_amount), 0) AS total_paid,
                    (fa.amount - IFNULL(SUM(fl.paid_amount), 0)) AS remaining_amount,
                    DATE_FORMAT(fl.payment_date, '%Y-%m') AS month
                FROM 
                    fees_allocation fa
                LEFT JOIN 
                    fees_logs fl ON fa.fees_id = fl.fees_id
                GROUP BY 
                    fa.roll_no, fa.academic_year, fa.fee_category, fa.amount, month
                ORDER BY 
                    fa.roll_no, month;
            `;
            const [results] = await db.query(monthQuery);
            res.status(200).json(results);
        } catch (err) {
            console.error("Error fetching month-wise fees logs data:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    });

    router.get('/feesLogs/combined', async (req, res) => {
        try {
            const combinedQuery = `
                SELECT 
                    fa.roll_no,
                    fa.academic_year,
                    fa.fee_category,
                    fa.amount,
                    IFNULL(SUM(fl.paid_amount), 0) AS total_paid,
                    (fa.amount - IFNULL(SUM(fl.paid_amount), 0)) AS remaining_amount,
                    DATE_FORMAT(fl.payment_date, '%Y-%m') AS month,
                    YEARWEEK(fl.payment_date, 1) AS week
                FROM 
                    fees_allocation fa
                LEFT JOIN 
                    fees_logs fl ON fa.fees_id = fl.fees_id
                GROUP BY 
                    fa.roll_no, fa.academic_year, fa.fee_category, fa.amount, month, week
                ORDER BY 
                    fa.roll_no, month, week;
            `;
            const [results] = await db.query(combinedQuery);
            res.status(200).json(results);
        } catch (err) {
            console.error("Error fetching combined fees logs data:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    });


    router.get('/totalPaidAmount/:academicYear', async (req, res) => {
        try {
            const academicYear = req.params.academicYear;
            const query = `
                SELECT 
                    SUM(fl.paid_amount) AS total_paid_amount,
                    IFNULL(fa.academic_year, ?) AS academic_year
                FROM 
                    fees_logs fl
                LEFT JOIN
                    fees_allocation fa ON fa.fees_id = fl.fees_id
                WHERE 
                    fa.academic_year = ?
                GROUP BY 
                    fa.academic_year;
            `;

            const [results] = await db.query(query, [academicYear, academicYear]);

            if (results.length === 0) {
                return res.status(200).json({ total_paid_amount: 0, academicYear });
            }

            return res.status(200).json(results[0]);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    });

    router.get('/feePendingStudents', async (req, res) => {
        try {
            const getQuery = `
            SELECT 
            fa.roll_no,
            fa.academic_year,
            fa.fee_category,
            fa.amount,
            fa.discount_amount,
            fa.remaining_amount,
            cls.cls_name,
            sec.sec_name,
            stu.stu_name,
            stu.stu_img
        FROM 
            fees_allocation fa
        INNER JOIN 
            students_allocation sa ON sa.roll_no = fa.roll_no
        INNER JOIN 
            students_master stu ON stu.stu_id = sa.stu_id
        INNER JOIN 
            class_allocation ca ON ca.cls_allocation_id = sa.cls_allocation_id
        INNER JOIN 
            class cls ON cls.cls_id = ca.cls_id
        INNER JOIN 
            sections sec ON sec.sec_id = ca.sec_id
        WHERE 
            fa.remaining_amount > 0;
            `;
            const [results] = await db.query(getQuery);
            const convertData = results.map((data)=>({
                ...data,
                stu_img : `http://localhost:3001/uploads/${data.stu_img}`
            }))
            res.status(200).json(convertData);
        } catch (err) {
            console.error("Error fetching Fees Pending students data:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    });
    
    return router;
}