const express = require('express');
const bcrypt = require('bcrypt')
const router = express.Router();
const app = express();
const jwt = require('jsonwebtoken');
const pool = require('../db/database');

app.use(express.json());

// Login function
router.post('/', async(req, res) => {
    const { user_name, password } = req.body;

    try {
        const { rows } = await pool.query('SELECT user_name, password FROM users WHERE user_name = $1', [req.body.user_name]);
        if (rows.length === 0) {
            return res.status(404).send({ message: 'User Not Found' });
        }
        const match = await bcrypt.compare(password, rows[0].password);
        if (!match) {
            return res.status(401).send({ message: 'Incorrect Password' });
        }
        const SECRET = '56b4b39501bfa91efb8343c653e407ab220559a4539b0a18078fc8b0d41612a6'; //move to dotEnv later
        const token = jwt.sign({ user_name: rows[0].user_name }, SECRET, { expiresIn: '1h' });
        res.status(200).send({ token });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router
