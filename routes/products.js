const express = require('express');

const router = express.Router();

// In-memory store — resets on server restart.
const products = [];
let nextId = 1;

// GET /products — return all products
router.get('/', (req, res) => {
  res.json(products);
});

// POST /products — create a product { name, price }
router.post('/', (req, res) => {
  const { name, price } = req.body || {};

  if (typeof name !== 'string' || name.trim() === '') {
    return res
      .status(400)
      .json({ error: 'name is required and must be a non-empty string' });
  }
  if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
    return res
      .status(400)
      .json({ error: 'price is required and must be a non-negative number' });
  }

  const product = {
    id: nextId++,
    name: name.trim(),
    price,
    created_at: new Date().toISOString(),
  };
  products.push(product);

  res.status(201).json(product);
});

module.exports = router;
