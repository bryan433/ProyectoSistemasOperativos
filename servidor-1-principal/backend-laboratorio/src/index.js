import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://admin_salud:SaludSegura2025!@haproxy:5432/db_laboratorio'
});

const PORT = process.env.PORT || 3003;

app.get('/api/laboratorio/machines', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Machine" ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching machines', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/laboratorio/exams/:machineId', async (req, res) => {
  try {
    const machineId = parseInt(req.params.machineId);
    const result = await pool.query('SELECT * FROM "Exam" WHERE "machineId" = $1 ORDER BY id ASC', [machineId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching exams', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/api/laboratorio/orders', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.*, e.name as "examName", m.name as "machineName"
      FROM "ExamOrder" o
      JOIN "Exam" e ON o."examId" = e.id
      JOIN "Machine" m ON e."machineId" = m.id
      ORDER BY o.id DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/laboratorio/orders', async (req, res) => {
  try {
    const { patientName, examId } = req.body;
    const result = await pool.query(
      'INSERT INTO "ExamOrder" ("patientName", "examId") VALUES ($1, $2) RETURNING *',
      [patientName, examId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating order', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/laboratorio/orders/:id', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { resultText } = req.body;
    const result = await pool.query(
      'UPDATE "ExamOrder" SET status = $1, result = $2 WHERE id = $3 RETURNING *',
      ['Completado', resultText, orderId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating order', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'laboratorio' });
});

app.listen(PORT, () => {
  console.log(`Backend laboratorio running on port ${PORT}`);
});
