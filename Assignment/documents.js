const express = require('express');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const { classifyDocument } = require('../utils/classifier');
const { redactText } = require('../utils/redactor');

const router = express.Router();
router.use(authenticate);

// Upload a document as text (simulates parsed document content).
// Runs automatic classification + PII redaction before storing.
router.post('/upload', authorize('admin', 'clerk', 'judge'), async (req, res) => {
  try {
    const { case_id, filename, text } = req.body;
    if (!case_id || !filename || !text) return res.status(400).json({ error: 'Missing required fields' });

    const { category, confidence } = classifyDocument(text);
    const { redacted, hits } = redactText(text);

    const [result] = await pool.query(
      `INSERT INTO documents (case_id, filename, original_text, redacted_text, category, confidence)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [case_id, filename, text, redacted, category, confidence]
    );

    res.status(201).json({
      id: result.insertId, category, confidence, redactionHits: hits, redacted_text: redacted
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/case/:caseId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, filename, category, confidence, redacted_text, uploaded_at FROM documents WHERE case_id = ? ORDER BY uploaded_at DESC',
      [req.params.caseId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
