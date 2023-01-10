const express = require('express');
const pool = require('./db/database');

const app = express();
const port = 3000;

app.use(express.json());

// Crie uma rota para listar todos os usuários
app.get('/users', async(req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users');
        return res.status(200).send(rows);
    } catch (err) {
        return res.status(400).send(err);
    }
});

app.post('/users', async(req, res) => {
    const { user_name, password, email} = req.body; //isso se chama destructuring uma tecnica para definir objetos e trasformar em array dps

    try {
        const newSession = await pool.query(`INSERT INTO users(user_name, password, email) 
        VALUES ($1, $2, $3) RETURNING *`, [user_name, password, email]);
        return res.status(200).send(newSession.rows);
    } catch(err) {
        return res.status(400).send(err);
    }
});

// Update
app.put('/users/:id_user', (req, res) => {
    const id_user = parseInt(req.params.id_user);
    const {  user_name, password, email } = req.body;
    
    pool.query(
        'UPDATE users SET user_name = $1 "password" = $2, email = $3 WHERE id_user = $4',
        [ user_name, password, email, id_user ],
        (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).send(`User modified with ID: ${id_user}`);
        }
    );
});

// Crie uma rota para excluir um usuário existente
app.delete('/users/:id_user', (req, res) => {
    const id_user = parseInt(req.params.id_user);

    pool.query('DELETE FROM users WHERE id_user = $1', [id_user], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).send(`User deleted with ID: ${id_user}`);
    });
});

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});
