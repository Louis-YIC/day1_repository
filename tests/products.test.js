const request = require('supertest');
const app = require('../app');

describe('GET /products', () => {
  it('returns an array', async () => {
    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('POST /products', () => {
  it('creates a product with name and price', async () => {
    const res = await request(app)
      .post('/products')
      .send({ name: 'Widget', price: 9.99 });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'Widget', price: 9.99 });
    expect(res.body.id).toBeDefined();
  });

  it('returns the created product in subsequent GET /products', async () => {
    await request(app).post('/products').send({ name: 'Gadget', price: 5 });
    const res = await request(app).get('/products');
    const names = res.body.map((p) => p.name);
    expect(names).toContain('Gadget');
  });

  it('rejects a missing name', async () => {
    const res = await request(app).post('/products').send({ price: 1 });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/name/);
  });

  it('rejects an empty name', async () => {
    const res = await request(app)
      .post('/products')
      .send({ name: '  ', price: 1 });
    expect(res.status).toBe(400);
  });

  it('rejects a missing price', async () => {
    const res = await request(app).post('/products').send({ name: 'NoPrice' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/price/);
  });

  it('rejects a non-numeric price', async () => {
    const res = await request(app)
      .post('/products')
      .send({ name: 'BadPrice', price: 'free' });
    expect(res.status).toBe(400);
  });

  it('rejects a negative price', async () => {
    const res = await request(app)
      .post('/products')
      .send({ name: 'Negative', price: -1 });
    expect(res.status).toBe(400);
  });
});
