const { throwError } = require('../commons/error');

module.exports = (app, db, helpers) => {

    const getProdutoFormatos = async (req, res) => {
        try {
            const query = `
                SELECT
                    pf.id,
                    pf.nome,
	                (SELECT p.id FROM RAFAELA_STUDIO_DB.tbl_produtos p WHERE p.formato_id = pf.id LIMIT 1) AS produtoId
                FROM tbl_produto_formatos pf
                ORDER BY nome ASC
            `;

            const [results] = await db.query(query);
            return res.status(200).json({ produtoFormatos: results });
        } catch (e) {
            if (!e.statusCode) e.statusCode = 400;
            return res.status(e.statusCode).json({ error: e.message });
        }
    };

    const getProdutoFormatoById = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id || Number(id) === 'NaN') {
                throwError("O 'id' é obrigatório", 203);
            }

            const query = `
                SELECT
                    id,
                    nome
                FROM tbl_produto_formatos
                WHERE id = ?
            `;

            const [response] = await db.query(query, [id]);

            if (response.length > 0) {
                return res.status(200).json(response[0]);
            } else
                return res.status(404).json({ message: 'Formato indisponível' });

        } catch (e) {
            if (!e.statusCode) e.statusCode = 400;
            return res.status(e.statusCode).json({ error: e.message });
        }
    };

    const insertProdutoFormato = async (req, res) => {
        try {
            const formato = req.body;

            if (!formato.nome || formato.nome.trim() === '') {
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
            const { id } = req.params;

            if (!id || Number(id) === 'NaN') {
                throwError("O 'id' é obrigatório", 203);
            }

            if (!formato.nome || formato.nome === '' && formato.nome.trim() === '') {
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

    const deleteProdutoFormato = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id || Number(id) === 'NaN') {
                throwError("O 'id' é obrigatório", 203);
            }

            const deleteProdutoFormatoQuery = `
                DELETE FROM tbl_produto_formatos
                WHERE id = ?
            `;

            await db.query(deleteProdutoFormatoQuery, [id]);

            return res.status(201).json({ message: 'Formato removido com sucesso!' });
        } catch (e) {
            console.log(e);
            if (!e.statusCode) e.statusCode = 400;
            return res.status(e.statusCode).send({ error: e.message });
        }
    };

    app.get('/api/produto-formatos', getProdutoFormatos);
    app.get('/api/produto-formato/:id', getProdutoFormatoById);
    app.post('/api/produto-formato', insertProdutoFormato);
    app.put('/api/produto-formato/:id', updateProdutoFormato);
    app.delete('/api/produto-formato/:id', deleteProdutoFormato);
}