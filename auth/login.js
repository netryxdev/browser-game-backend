// app.post('/login', (req, res) => {
//     const { username, password } = req.body;

//     // Check if login credentials are correct
//     const user = getUserFromDB(username, password);
//     if (user) {
//       // Generate JWT and send it back to the pool
//         const jwt = generateJWT(user);
//         res.send({ jwt });
//     } else {
//         res.status(401).send({ error: 'Invalid login credentials' });
//     }
// });

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const pool = require('../db/database');

// Replace with your own database connection details
// const connectionString = 'postgresql://username:password@localhost/database';

app.use(express.json());

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if login credentials are correct
    const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    const values = [username, password];
    pool.query(query, values, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send({ error: 'An unexpected error occurred' });
        } else {
            if (result.rowCount > 0) {
                // Generate JWT
                const token = jwt.sign({ username }, 'secret', { expiresIn: '1h' });
                res.send({ token });
            } else {
                res.status(401).send({ error: 'Invalid login credentials' });
            }
        }
    });
});
