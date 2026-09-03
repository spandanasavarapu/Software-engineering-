require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const caseRoutes = require('./routes/cases');
const documentRoutes = require('./routes/documents');
const hearingRoutes = require('./routes/hearings');
const analyticsRoutes = require('./routes/analytics');
const precedentRoutes = require('./routes/precedents');

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'court-platform-backend' }));

app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/hearings', hearingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/precedents', precedentRoutes);

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Court platform backend running on port ${PORT}`));
