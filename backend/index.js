require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const healthEndpoints = require('./health-check');
const productEndpoints = require('./product-endpoints');
const userEndpoints = require('./user-endpoints');
const fornecedoresEndpoints = require('./fornecedores-endpoints');

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

const DB_CONFIG = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'latin1_bin'
};

console.log(DB_CONFIG);

const startApp = async () => {
    
    // Database connection
    const db = await mysql.createConnection(DB_CONFIG);

    // Open the database connection
    db.connect((err) => {
        if (err) throw err;
        console.log('Database connected...');
    });

    healthEndpoints(app, db);

    userEndpoints(app, db);

    productEndpoints(app, db);

    fornecedoresEndpoints(app, db);

    // outrosEndpoints(app, db);

    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
};

startApp();