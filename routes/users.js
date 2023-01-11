const express = require('express');
const bcrypt = require('bcrypt')
const router = express.Router();
const app = express();
const jwt = require('jsonwebtoken');
const pool = require('../db/database');

app.use(express.json());

// Crie uma rota para listar todos os usuários
router.get('/', async(req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users');
        return res.status(200).send(rows);
    } catch (err) {
        return res.status(400).send(err);
    }
});

// Register new account
router.post('/', async(req, res) => {
    const { user_name, password, email} = req.body; //isso se chama destructuring uma tecnica para definir objetos e trasformar em array dps
    const saltRounds = 7;
    const hashedPwd = await bcrypt.hash(password, saltRounds);

    try {
        const newSession = await pool.query(`INSERT INTO users(user_name, password, email) 
        VALUES ($1, $2, $3) RETURNING *`, [user_name, hashedPwd, email]);
        return res.status(200).send(newSession.rows);
    } catch(err) {
        return res.status(400).send(err);
    }
});

// Update
router.put('/:id_user', (req, res) => {
    const id_user = parseInt(req.params.id_user);
    const { user_name, password, email } = req.body;
    
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
router.delete('/:id_user', (req, res) => { // /:id_user == /users/:id_user
    const id_user = parseInt(req.params.id_user);

    pool.query('DELETE FROM users WHERE id_user = $1', [id_user], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).send(`User deleted with ID: ${id_user}`);
    });
});

module.exports = router;