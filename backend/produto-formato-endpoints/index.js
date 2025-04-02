const { throwError } = require('../commons/error');

module.exports = (app, db, helpers) => {
    
    const getProdutoFormatos = async (req, res) => {
        try {
            const query = `
                SELECT 
                    id,
                    nome
                FROM tbl_produto_formatos
                ORDER BY nome ASC
            `;

            const [results] = await db.query(query);
            return res.status(200).json({ produtoFormatos: results });
        } catch (e) {
            if (!e.statusCode) e.statusCode = 400;
            return res.status(e.statusCode).json({ error: e.message });
        }
    };

    const insertProdutoFormato = async (req, res) => {
        try {
            const formato = req.body;
            if (!formato.nome || formato.nome && formato.nome.trim()) {
                throwError("Campo 'nome' é obrigatório", 203);
            }

            // verificar se produto existe
            const queryVerifyExists = `
                SELECT *
                FROM tbl_produto_formatos
                WHERE nome = ?
            `;

            const [formatoFromDB = results] = await db.query(queryVerifyExists, [ formato.nome.trim() ]);
            if (formatoFromDB.length > 0) {
                throwError('Formato já existe', 203);
            }

            // Insert into main table
            const insertProdutoFormatoQuery = `
                INSERT INTO tbl_produto_formatos (nome)
                VALUES (?)
            `;

            await db.query(insertProdutoFormatoQuery, [
                formato.nome
            ]);

            return res.status(201).json({ message: 'Formato registrado com sucesso!' });
        } catch (e) {
            if (!e.statusCode) e.statusCode = 400;
            return res.status(e.statusCode).send({ error: e.message });
        }
    };

    const updateProdutoFormato = async (req, res) => {
        try {
            const formato = req.body;
            const id = req.query;
            
            if (!id || Number(id) == NaN) {
                throwError("O 'id' é obrigatório", 203);
            }

            if (!formato.nome || formato.nome && formato.nome.trim()) {
                throwError("Campo 'nome' é obrigatório", 203);
            }

            const updateProdutoFormatoQuery = `
                UPDATE tbl_produto_formatos
                SET nome = ?
                WHERE id = ?
            `;

            await db.query(updateProdutoFormatoQuery, [formato.nome, id]);

            return res.status(201).json({ message: 'Formato atualizado com sucesso!' });
        } catch (e) {
            if (!e.statusCode) e.statusCode = 400;
            return res.status(e.statusCode).send({ error: e.message });
        }
    };

    app.get('/api/produto/formatos', getProdutoFormatos);
    app.post('/api/produto/formato', insertProdutoFormato);
    app.put('/api/produto/formato/:id', updateProdutoFormato);
}