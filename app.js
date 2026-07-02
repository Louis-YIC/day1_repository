const express = require('express');
const itemsRouter = require('./routes/items');

const app = express();
app.use(express.json());

// GET /healthz — liveness check
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/items', itemsRouter);

module.exports = app;
