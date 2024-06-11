const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'financial_user',
    host: '192.168.18.244',
    database: 'financialManager',
    password: 'admin123',
    port: 5432,
});

pool.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.stack);
    } else {
        console.log('Conectado ao banco de dados');
        checkPermissions();
    }
});

const checkPermissions = async () => {
    try {
        await pool.query('SELECT 1 FROM lancamento LIMIT 1');
        console.log('Permissão de SELECT na tabela lancamento verificada');
        await pool.query('SELECT 1 FROM categoria LIMIT 1');
        console.log('Permissão de SELECT na tabela categoria verificada');
        await pool.query('SELECT 1 FROM usuario LIMIT 1');
        console.log('Permissão de SELECT na tabela usuario verificada');
    } catch (err) {
        console.error('Erro ao verificar permissões:', err.message);
    }
};

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.post('/register', async (req, res) => {
    const { nome, email, senha, cpf, telefone } = req.body;
    try {
        console.log('Dados recebidos para registro:', req.body);
        const newUser = await pool.query(
            'INSERT INTO usuario (nome, email, senha, cpf, telefone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nome, email, senha, cpf, telefone]
        );
        console.log('Usuário registrado:', newUser.rows[0]);

        // Adicionar categorias padrão para o novo usuário
        await addDefaultCategoriesForUser(newUser.rows[0].id);

        res.json(newUser.rows[0]);
    } catch (err) {
        console.error('Erro no registro:', err.message);
        res.status(500).send('Erro no servidor');
    }
});

const addDefaultCategoriesForUser = async (userId) => {
    const defaultCategories = [
        { nome: 'Transporte', tipo: 'Despesa', icon: 'car' },
        { nome: 'Comida', tipo: 'Despesa', icon: 'utensils' },
        { nome: 'Hobby', tipo: 'Despesa', icon: 'gamepad' },
        { nome: 'Roupas', tipo: 'Despesa', icon: 'tshirt' },
        { nome: 'Beleza', tipo: 'Despesa', icon: 'spa' },
        { nome: 'Social', tipo: 'Despesa', icon: 'users' },
        { nome: 'Salário', tipo: 'Receita', icon: 'money-bill-wave' },
        { nome: 'Bônus', tipo: 'Receita', icon: 'gift' },
        { nome: 'Investimentos', tipo: 'Receita', icon: 'chart-line' },
    ];

    try {
        console.log(`Adicionando categorias padrão para o usuário ${userId}`);
        for (const category of defaultCategories) {
            console.log(`Adicionando categoria: ${category.nome}`);
            await pool.query(
                'INSERT INTO CATEGORIA (nome, tipo, icon, user_id) VALUES ($1, $2, $3, $4)',
                [category.nome, category.tipo, category.icon, userId]
            );
        }
        console.log(`Categorias padrão adicionadas para o usuário ${userId}.`);
    } catch (err) {
        console.error(`Erro ao adicionar categorias padrão para o usuário ${userId}:`, err.message);
    }
};

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

// Rotas para categorias
app.post('/categorias', async (req, res) => {
    const { nome, tipo, icon, user_id } = req.body;
    try {
        const result = await pool.query('INSERT INTO CATEGORIA (nome, tipo, icon, user_id) VALUES ($1, $2, $3, $4) RETURNING *', [nome, tipo, icon, user_id]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao adicionar categoria:', err.message);
        res.status(500).send('Erro no servidor');
    }
});

app.delete('/categorias/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM CATEGORIA WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error('Erro ao remover categoria:', err.message);
        res.status(500).send('Erro no servidor');
    }
});

app.get('/categorias/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM CATEGORIA WHERE user_id = $1', [user_id]);
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar categorias:', err.message);
        res.status(500).send('Erro no servidor');
    }
});

// Rota para excluir o usuário
app.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Excluir as dependências (categorias e lançamentos) primeiro
        await pool.query('DELETE FROM lancamento WHERE usuario_id = $1', [id]);
        await pool.query('DELETE FROM categoria WHERE user_id = $1', [id]);

        // Excluir o usuário
        await pool.query('DELETE FROM usuario WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error('Erro ao excluir usuário:', err.message);
        res.status(500).send('Erro no servidor');
    }
});

// Rota para adicionar um lançamento
app.post('/lancamentos', async (req, res) => {
    const { descricao, tipo, data, valor, categoria_id, usuario_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO lancamento (descricao, tipo, data, valor, categoria_id, usuario_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [descricao, tipo, data, valor, categoria_id, usuario_id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao adicionar lançamento:', err.message);
        res.status(500).send('Erro no servidor');
    }
});

app.get('/lancamentos/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM lancamento WHERE usuario_id = $1 ORDER BY data DESC', [user_id]);
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar lançamentos:', err.message);
        res.status(500).send('Erro no servidor');
    }
});

app.delete('/lancamentos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM lancamento WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error('Erro ao excluir lançamento:', err.message);
        res.status(500).send('Erro no servidor');
    }
});

// Rota para calcular o saldo mensal
app.get('/saldo-mensal/:user_id/:mes/:ano', async (req, res) => {
    const { user_id, mes, ano } = req.params;
    try {
        const result = await pool.query(
            'SELECT tipo, SUM(valor) as total FROM lancamento WHERE usuario_id = $1 AND EXTRACT(MONTH FROM data) = $2 AND EXTRACT(YEAR FROM data) = $3 GROUP BY tipo',
            [user_id, mes, ano]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao calcular saldo mensal:', err.message);
        res.status(500).send('Erro no servidor');
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
