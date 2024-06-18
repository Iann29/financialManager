const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const tinyurl = require('tinyurl');

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

const adminPool = new Pool({
    user: 'postgres',
    host: '192.168.18.244',
    database: 'financialManager',
    password: 'root',
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
        await pool.query('SELECT 1 FROM usuario LIMIT 1');
        console.log('Permissão de SELECT na tabela usuario verificada');
        await pool.query('SELECT 1 FROM categoria LIMIT 1');
        console.log('Permissão de SELECT na tabela categoria verificada');
        await pool.query('SELECT 1 FROM lancamento LIMIT 1');
        console.log('Permissão de SELECT na tabela lancamento verificada');
    } catch (err) {
        console.error('Erro ao verificar permissões:', err.message);
    }
};

app.get('/', (req, res) => {
    res.send('API is running...');
});

const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z]).{8,}$/;
    return regex.test(password);
};

const validateCPF = (cpf) => {
    const regex = /^\d{11}$/;
    return regex.test(cpf);
};

app.post('/register', async (req, res) => {
    const { nome, email, senha, cpf, telefone } = req.body;

    if (!validatePassword(senha)) {
        return res.status(400).send('A senha deve ter no mínimo 8 dígitos e pelo menos uma letra maiúscula.');
    }

    if (!validateCPF(cpf)) {
        return res.status(400).send('O CPF deve ter exatamente 11 números.');
    }

    try {
        console.log('Dados recebidos para registro:', req.body);
        const newUser = await pool.query(
            'INSERT INTO usuario (nome, email, senha, cpf, telefone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nome, email, senha, cpf, telefone]
        );
        console.log('Usuário registrado:', newUser.rows[0]);

        await addDefaultCategoriesForUser(newUser.rows[0].id);

        res.json(newUser.rows[0]);
    } catch (err) {
        console.error('Erro no registro:', err.message);
        res.status(500).send('Erro no servidor');
    }
});

const addDefaultCategoriesForUser = async (userId) => {
    const defaultCategories = [
        { nome: 'Transporte', tipo: 'Despesa', icon: 'transporte.png' },
        { nome: 'Comida', tipo: 'Despesa', icon: 'comidai.png' },
        { nome: 'Hobby', tipo: 'Despesa', icon: 'hobby.png' },
        { nome: 'Roupas', tipo: 'Despesa', icon: 'roupas.png' },
        { nome: 'Beleza', tipo: 'Despesa', icon: 'beleza.png' },
        { nome: 'Social', tipo: 'Despesa', icon: 'social.png' },
        { nome: 'Salário', tipo: 'Receita', icon: 'dinheiro.png' },
        { nome: 'Bônus', tipo: 'Receita', icon: 'bonus.png' },
        { nome: 'Investimentos', tipo: 'Receita', icon: 'investimento.png' },
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
    const { email, senha, otp } = req.body;
    try {
        console.log('Dados recebidos para login:', req.body);
        const userResult = await pool.query(
            'SELECT * FROM usuario WHERE email = $1 AND senha = $2',
            [email, senha]
        );
        const user = userResult.rows[0];
        if (user) {
            if (user.otp_secret) {
                // Se o OTP for necessário, retornar isso na resposta
                if (!otp) {
                    return res.json({ otpRequired: true });
                }

                const verified = speakeasy.totp.verify({
                    secret: user.otp_secret,
                    encoding: 'base32',
                    token: otp
                });

                if (!verified) {
                    return res.status(401).send('Código OTP inválido');
                }
            }

            console.log('Login bem-sucedido para o usuário:', user);
            res.json(user);
        } else {
            console.log('Credenciais inválidas para o usuário:', email);
            res.status(401).send('Credenciais inválidas');
        }
    } catch (err) {
        console.error('Erro no login:', err.message);
        res.status(500).send('Erro no servidor');
    }
});

// Rota para gerar o QR code para OTP
app.post('/generate-otp/:userId', async (req, res) => {
    const { userId } = req.params;
    const secret = speakeasy.generateSecret({ length: 20 });

    await pool.query(
        'UPDATE usuario SET otp_secret = $1 WHERE id = $2',
        [secret.base32, userId]
    );

    const otpAuthUrl = `otpauth://totp/FinancialManager:${userId}?secret=${secret.base32}&issuer=FinancialManager`;

    QRCode.toDataURL(otpAuthUrl, (err, data_url) => {
        if (err) {
            console.error('Erro ao gerar QR code:', err.message);
            return res.status(500).send('Erro ao gerar QR code');
        }
        res.json({ otpSecret: secret.base32, data_url });
    });
});

// Rota para verificar o OTP
app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const userResult = await pool.query(
            'SELECT * FROM usuario WHERE email = $1',
            [email]
        );

        const user = userResult.rows[0];

        if (!user || !user.otp_secret) {
            return res.status(400).send('Usuário ou segredo OTP não encontrado');
        }

        const verified = speakeasy.totp.verify({
            secret: user.otp_secret,
            encoding: 'base32',
            token: otp
        });

        if (verified) {
            res.json({ success: true, user });
        } else {
            res.status(401).send('Código OTP inválido');
        }
    } catch (err) {
        console.error('Erro ao verificar OTP:', err.message);
        res.status(500).send('Erro no servidor');
    }
});

// Rota para remover o OTP
app.post('/remove-otp', async (req, res) => {
    const { userId } = req.body;

    try {
        await pool.query('UPDATE usuario SET otp_secret = NULL WHERE id = $1', [userId]);
        res.send('OTP removido com sucesso');
    } catch (err) {
        console.error('Erro ao remover OTP:', err.message);
        res.status(500).send('Erro ao remover OTP');
    }
});

app.get('/get-otp-secret/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await pool.query('SELECT otp_secret FROM usuario WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).send('Usuário não encontrado');
        }

        res.json({ otpSecret: result.rows[0].otp_secret });
    } catch (err) {
        console.error('Erro ao buscar OTP secret:', err.message);
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

const resetDatabase = async () => {
    try {
        const dropTables = `
            DROP TABLE IF EXISTS lancamento;
            DROP TABLE IF EXISTS categoria;
            DROP TABLE IF EXISTS usuario;
        `;
        
        const createTables = `
            CREATE SEQUENCE IF NOT EXISTS usuario_id_seq START 1;
            CREATE SEQUENCE IF NOT EXISTS categoria_id_seq START 1;
            CREATE SEQUENCE IF NOT EXISTS lancamento_id_seq START 1;

            CREATE TABLE IF NOT EXISTS public.usuario (
                id integer NOT NULL DEFAULT nextval('usuario_id_seq'::regclass),
                nome character varying(255) COLLATE pg_catalog."default" NOT NULL,
                email character varying(255) COLLATE pg_catalog."default" NOT NULL,
                senha character varying(45) COLLATE pg_catalog."default" NOT NULL,
                cpf character varying(11) COLLATE pg_catalog."default" NOT NULL,
                telefone character varying(14) COLLATE pg_catalog."default" NOT NULL,
                otp_secret character varying(255) COLLATE pg_catalog."default",
                CONSTRAINT usuario_pkey PRIMARY KEY (id),
                CONSTRAINT usuario_cpf_key UNIQUE (cpf)
            );

            CREATE TABLE IF NOT EXISTS public.categoria (
                id integer NOT NULL DEFAULT nextval('categoria_id_seq'::regclass),
                nome character varying(100) COLLATE pg_catalog."default" NOT NULL,
                tipo character varying(10) COLLATE pg_catalog."default" NOT NULL,
                icon character varying(100) COLLATE pg_catalog."default",
                user_id integer,
                CONSTRAINT categoria_pkey PRIMARY KEY (id),
                CONSTRAINT categoria_user_id_fkey FOREIGN KEY (user_id)
                    REFERENCES public.usuario (id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION
            );

            CREATE TABLE IF NOT EXISTS public.lancamento (
                id integer NOT NULL DEFAULT nextval('lancamento_id_seq'::regclass),
                descricao character varying(255) COLLATE pg_catalog."default",
                tipo character varying(255) COLLATE pg_catalog."default" NOT NULL,
                data timestamp without time zone NOT NULL,
                valor numeric(10,2) NOT NULL,
                categoria_id integer NOT NULL,
                usuario_id integer NOT NULL,
                CONSTRAINT lancamento_pkey PRIMARY KEY (id),
                CONSTRAINT lancamento_categoria_id_fkey FOREIGN KEY (categoria_id)
                    REFERENCES public.categoria (id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION,
                CONSTRAINT lancamento_usuario_id_fkey FOREIGN KEY (usuario_id)
                    REFERENCES public.usuario (id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION
            );

            GRANT ALL PRIVILEGES ON TABLE public.usuario TO financial_user;
            GRANT ALL PRIVILEGES ON TABLE public.categoria TO financial_user;
            GRANT ALL PRIVILEGES ON TABLE public.lancamento TO financial_user;

            GRANT USAGE, SELECT, UPDATE ON SEQUENCE usuario_id_seq TO financial_user;
            GRANT USAGE, SELECT, UPDATE ON SEQUENCE categoria_id_seq TO financial_user;
            GRANT USAGE, SELECT, UPDATE ON SEQUENCE lancamento_id_seq TO financial_user;

            -- Reseta as sequências para 1
            ALTER SEQUENCE usuario_id_seq RESTART WITH 1;
            ALTER SEQUENCE categoria_id_seq RESTART WITH 1;
            ALTER SEQUENCE lancamento_id_seq RESTART WITH 1;
        `;

        await adminPool.query(dropTables);
        await adminPool.query(createTables);

        console.log('Banco de dados resetado com sucesso.');

        const verifyReset = async () => {
            try {
                const usuarioCount = await adminPool.query('SELECT COUNT(*) FROM usuario');
                const categoriaCount = await adminPool.query('SELECT COUNT(*) FROM categoria');
                const lancamentoCount = await adminPool.query('SELECT COUNT(*) FROM lancamento');
                const usuarioSeq = await adminPool.query("SELECT last_value FROM usuario_id_seq");
                const categoriaSeq = await adminPool.query("SELECT last_value FROM categoria_id_seq");
                const lancamentoSeq = await adminPool.query("SELECT last_value FROM lancamento_id_seq");

                console.log(`Verificação pós-reset:
                Usuários: ${usuarioCount.rows[0].count}
                Categorias: ${categoriaCount.rows[0].count}
                Lançamentos: ${lancamentoCount.rows[0].count}
                Sequência de Usuário: ${usuarioSeq.rows[0].last_value}
                Sequência de Categoria: ${categoriaSeq.rows[0].last_value}
                Sequência de Lançamento: ${lancamentoSeq.rows[0].last_value}`);
            } catch (err) {
                console.error('Erro na verificação pós-reset:', err.message);
            }
        };

        await verifyReset();
    } catch (err) {
        console.error('Erro ao resetar banco de dados:', err.message);
    }
};

app.post('/reset-database', async (req, res) => {
    await resetDatabase();
    res.send('Banco de dados resetado.');
});

// Monitora entrada do usuário no console
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.on('line', (input) => {
    if (input.trim() === 'reset-db') {
        console.log('Resetando o banco de dados...');
        resetDatabase().then(() => {
            console.log('Banco de dados resetado via comando do console.');
        }).catch((err) => {
            console.error('Erro ao resetar banco de dados:', err);
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
