const express = require('express');
const pool = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

// Instant precedent retrieval — keyword relevance search over title/category/keywords
router.get('/search', async (req, res) => {
  try {
    const q = (req.query.q || '').toLowerCase();
    if (!q) {
      const [all] = await pool.query('SELECT * FROM precedents ORDER BY id DESC LIMIT 20');
      return res.json(all);
    }
    const [rows] = await pool.query('SELECT * FROM precedents');
    const scored = rows
      .map(p => {
        const haystack = `${p.title} ${p.category} ${p.summary} ${p.keywords}`.toLowerCase();
        const terms = q.split(/\s+/).filter(Boolean);
        let score = 0;
        terms.forEach(t => { if (haystack.includes(t)) score += 1; });
        return { ...p, relevance: score };
      })
      .filter(p => p.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance);
    res.json(scored);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
