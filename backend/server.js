const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'root',
  host: 'localhost',
  database: 'financialManager',
  password: 'root',
  port: 5432,
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Endpoints para usuários
app.post('/register', async (req, res) => {
  const { nome, email, senha, cpf, telefone } = req.body;
  try {
    const newUser = await pool.query(
      'INSERT INTO usuario (nome, email, senha, cpf, telefone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nome, email, senha, cpf, telefone]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const user = await pool.query(
      'SELECT * FROM usuario WHERE email = $1 AND senha = $2',
      [email, senha]
    );
    if (user.rows.length > 0) {
      res.json(user.rows[0]);
    } else {
      res.status(401).send('Invalid Credentials');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
