require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const productEndpoints = require('./product-endpoints');

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Open the database connection
db.connect((err) => {
    if (err) throw err;
    console.log('Database connected...');
});

productEndpoints(app, db);

// fornecedorEndpoints(app, db);

// outrosEndpoints(app, db);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});