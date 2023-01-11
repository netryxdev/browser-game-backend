const express = require('express');
const pool = require('./db/database');

const app = express();
const port = 3000;

app.use(express.json());

// Import Routes
const loginRoute = require('./routes/login')
const usersRoute = require('./routes/users')

app.use('/users', usersRoute);
app.use('/login', loginRoute);

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});
