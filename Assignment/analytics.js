const express = require('express');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

// Judicial workload — active case count per judge
router.get('/workload', authorize('admin', 'judge', 'clerk'), async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.id AS judge_id, u.name AS judge_name,
        SUM(CASE WHEN c.status != 'closed' THEN 1 ELSE 0 END) AS active_cases,
        SUM(CASE WHEN c.status = 'closed' THEN 1 ELSE 0 END) AS closed_cases,
        COUNT(c.id) AS total_cases
      FROM users u
      LEFT JOIN cases c ON c.judge_id = u.id
      WHERE u.role = 'judge'
      GROUP BY u.id, u.name
      ORDER BY active_cases DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Overall summary + case-type distribution + avg resolution days
router.get('/summary', async (req, res) => {
  try {
    const [statusDist] = await pool.query(`SELECT status, COUNT(*) AS count FROM cases GROUP BY status`);
    const [typeDist] = await pool.query(`SELECT case_type, COUNT(*) AS count FROM cases GROUP BY case_type`);
    const [priorityDist] = await pool.query(`SELECT priority, COUNT(*) AS count FROM cases GROUP BY priority`);
    const [avgRes] = await pool.query(`
      SELECT AVG(DATEDIFF(actual_completion_date, filed_date)) AS avg_days
      FROM cases WHERE actual_completion_date IS NOT NULL
    `);
    const [totals] = await pool.query(`SELECT COUNT(*) AS total_cases FROM cases`);
    const [docTotals] = await pool.query(`SELECT COUNT(*) AS total_documents FROM documents`);
    const [hearingTotals] = await pool.query(`SELECT COUNT(*) AS total_hearings FROM hearings`);

    res.json({
      totalCases: totals[0].total_cases,
      totalDocuments: docTotals[0].total_documents,
      totalHearings: hearingTotals[0].total_hearings,
      avgResolutionDays: avgRes[0].avg_days ? Math.round(avgRes[0].avg_days) : null,
      statusDistribution: statusDist,
      typeDistribution: typeDist,
      priorityDistribution: priorityDist
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
