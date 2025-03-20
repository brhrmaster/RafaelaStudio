require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

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
/*
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
*/

// Open the database connection
db.connect((err) => {
    if (err) throw err;
    console.log('Database connected...');
});

// API endpoints

// POST endpoint to create a new produto
app.post('/api/produtos', (req, res) => {
    const { produto, preco, formato, Fornecedores } = req.body;

    // Use transaction for data integrity
    db.beginTransaction((err, trx) => {
        if (err) return res.status(500).send({ error: err.message });

        // Insert into main table
        const insertProdutoQuery = `
            INSERT INTO produtos (produto, preco)
            VALUES (?, ?)
        `;
        trx.query(insertProdutoQuery, [produto, preco], (err, produtoInsertResult) => {
            if (err) return res.status(500).send({ error: err.message });

            const produtoId = produtoInsertResult.insertId;

            // Insert formatos
            formato.forEach(formatoItem => {
                const insertFormatoQuery = `
                    INSERT INTO formato_produtos (produto_id, formato_id)
                    VALUES (?, ?)
                `;
                trx.query(insertFormatoQuery, [produtoId, formatoItem.id], (err, result) => {
                    if (err) return res.status(500).send({ error: err.message });
                });
            });

            // Insert fornecedores
            Fornecedores.forEach(fornecedorItem => {
                const insertFornecedorQuery = `
                    INSERT INTO fornecedores_produtos (produto_id, fornecedor_id)
                    VALUES (?, ?)
                `;
                trx.query(insertFornecedorQuery, [produtoId, fornecedorItem.id], (err, result) => {
                    if (err) return res.status(500).send({ error: err.message });
                });
            });

            // Commit the transaction
            trx.commit((err) => {
                if (err) return res.status(500).send({ error: err.message });
                res.status(201).json({ message: 'Produto created successfully' });
            });
        });
    });
});

// GET endpoint to get produtos by ID or Product
app.get('/api/produtos/:idOrProduct?', (req, res) => {
    const { idOrProduct } = req.params;

    let query;
    if (isNaN(idOrProduct)) {
        // Search by product name
        query = `
            SELECT p.*,
                   f.nome AS formato,
                   fo.nome AS fornecedor
            FROM produtos p
            LEFT JOIN formato_produtos fp ON p.id = fp.produto_id
            LEFT JOIN formatos f ON fp.formato_id = f.id
            LEFT JOIN fornecedores_produtos fpo ON p.id = fpo.produto_id
            LEFT JOIN fornecedores fo ON fpo.fornecedor_id = fo.id
            WHERE p.produto LIKE ?
        `;
        const likeQuery = idOrProduct;
        db.query(query, [ `%${likeQuery}%` ], (err, results) => {
            if (err) return res.status(500).send({ error: err.message });
            res.json(results);
        });
    } else {
        // Search by ID
        query = `
            SELECT p.*,
                   f.nome AS formato,
                   fo.nome AS fornecedor
            FROM produtos p
            LEFT JOIN formato_produtos fp ON p.id = fp.produto_id
            LEFT JOIN formatos f ON fp.formato_id = f.id
            LEFT JOIN fornecedores_produtos fpo ON p.id = fpo.produto_id
            LEFT JOIN fornecedores fo ON fpo.fornecedor_id = fo.id
            WHERE p.id = ?
        `;
        const idQuery = idOrProduct;
        db.query(query, [idQuery], (err, result) => {
            if (err) return res.status(500).send({ error: err.message });
            res.json(result);
        });
    }
});

// DELETE endpoint
app.delete('/api/produtos/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM produtos WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).send({ error: err.message });
        res.json({ message: `Produto ${id} deleted successfully` });
    });
});

// PUT endpoint to update a produto
app.put('/api/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { produto, preco } = req.body;

    // Update main table
    const query = 'UPDATE produtos SET produto = ?, preco = ? WHERE id = ?';
    db.query(query, [produto, preco, id], (err, result) => {
        if (err) return res.status(500).send({ error: err.message });
        res.json({ message: `Produto ${id} updated successfully` });
    });
});


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});