const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'financial_user',
    host: '192.168.18.244', // IP do notebook
    database: 'financialManager',
    password: 'admin123',
    port: 5432,
});

pool.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.stack);
    } else {
        console.log('Conectado ao banco de dados');
    }
});

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Endpoint de registro
app.post('/register', async (req, res) => {
    const { nome, email, senha, cpf, telefone } = req.body;
    try {
        console.log('Dados recebidos para registro:', req.body);
        const newUser = await pool.query(
            'INSERT INTO usuario (nome, email, senha, cpf, telefone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nome, email, senha, cpf, telefone]
        );
        console.log('Usuário registrado:', newUser.rows[0]);
        res.json(newUser.rows[0]);
    } catch (err) {
        console.error('Erro no registro:', err.message);
        res.status(500).send('Erro no servidor');
    }
});

// Endpoint de login
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        console.log('Dados recebidos para login:', req.body);
        const user = await pool.query(
            'SELECT * FROM usuario WHERE email = $1 AND senha = $2',
            [email, senha]
        );
        if (user.rows.length > 0) {
            console.log('Login bem-sucedido para o usuário:', user.rows[0]);
            res.json(user.rows[0]);
        } else {
            console.log('Credenciais inválidas para o usuário:', email);
            res.status(401).send('Credenciais inválidas');
        }
    } catch (err) {
        console.error('Erro no login:', err.message);
        res.status(500).send('Erro no servidor');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
