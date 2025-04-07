const { throwError } = require('../commons/error');

module.exports = (app, db, helpers) => {
    
    // API endpoints
    const getFornecedores = async (req, res) => {
        await helpers.waitForABit(3000);
        const consulta = req.query;
        try {
            let filtro;
            if (consulta && consulta.filtro) {
                filtro = [ `%${consulta.filtro}%`, `%${consulta.filtro}%` ]
            } else {
                filtro = [ '%', '%' ];
            }

            const query = `
                SELECT 
                    f.id,
                    f.empresa,
                    f.nome_representante AS nomeRepresentante,
                    f.telefone,
                    f.email,
                    f.endereco,
                    f.numero,
                    f.cidade_id AS cidadeId,
                    c.nome AS cidadeNome,
                    est.nome AS estadoNome,
                    est.uf AS estadoUF,
                    est.id AS estadoId,
                    f.cep,
                    f.site
                FROM tbl_fornecedores f
                INNER JOIN tbl_cidades c ON c.id = f.cidade_id
                INNER JOIN tbl_estados est ON est.id = c.estado_id
                WHERE f.nome_representante LIKE ? OR f.empresa LIKE ?
            `;

            const [results] = await db.query(query, filtro);
            return res.status(200).json({ fornecedores: results });
        } catch (e) {
            if (!e.statusCode) e.statusCode = 400;
            return res.status(e.statusCode).json({ error: e.message });
        }
    };

    const getFornecedoresSimples = async (req, res) => {
        try {

            const query = `
                SELECT 
                    f.id,
                    f.empresa
                FROM tbl_fornecedores f
                ORDER BY f.empresa ASC
            `;

            const [results] = await db.query(query);
            return res.status(200).json({ fornecedores: results });
        } catch (e) {
            if (!e.statusCode) e.statusCode = 400;
            return res.status(e.statusCode).json({ error: e.message });
        }
    };

    const getFornecedoresSimplesPorProduto = async (req, res) => {
        try {
            const { produtoId } = req.params;
            const query = `
                SELECT 
                    f.id,
                    f.empresa
                FROM tbl_fornecedores f
                INNER JOIN tbl_produto_fornecedor pf ON pf.fornecedor_id = f.id AND pf.produto_id = ?
                ORDER BY f.empresa ASC
            `;

            const [results] = await db.query(query, [produtoId]);
            return res.status(200).json({ fornecedores: results });
        } catch (e) {
            if (!e.statusCode) e.statusCode = 400;
            return res.status(e.statusCode).json({ error: e.message });
        }
    };

    const insertFornecedor = async (req, res) => {
        await helpers.waitForABit(3000);
        const fornecedor = req.body;
        try {
            if (!fornecedor) throw new Error('Por favor, envie os dados do fornecedor');
            if (fornecedor.cidadeId <= 0) throw new Error('Campo cidadeId deve ter um id válido');

            const insertFornecedorQuery = `
                INSERT INTO tbl_fornecedores (
                    empresa,
                    nome_representante,
                    telefone,
                    email,
                    endereco,
                    numero,
                    cidade_id,
                    cep,
                    site
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            await db.query(insertFornecedorQuery, [
                fornecedor.empresa,
                fornecedor.nomeRepresentante,
                fornecedor.telefone,
                fornecedor.email,
                fornecedor.endereco,
                fornecedor.numero,
                fornecedor.cidadeId,
                fornecedor.cep,
                fornecedor.site
            ]);
            return res.status(201).json({ message: 'Fornecedor cadastrado com sucesso!' });
        } catch (e) {
            if (!e.statusCode) e.statusCode = 400;
            return res.status(e.statusCode).json({ error: e.message });
        }
    };

    const updateFornecedor = async (req, res) => {
        await helpers.waitForABit(3000);
        const { id } = req.params;
        const fornecedor = req.body;

        try {
            const queryVerifyExists = `
                SELECT id
                FROM tbl_fornecedores
                WHERE id = ?
            `;

            const [resVerifyExists = results] = await db.query(queryVerifyExists, [ id ]);
            if (resVerifyExists.length == 0) {
                throwError('Fornecedor não encontrado', 404);
            }

            const query = `
                UPDATE tbl_fornecedores
                SET 
                    empresa = ?,
                    nome_representante = ?,
                    telefone = ?,
                    email = ?,
                    endereco = ?,
                    numero = ?,
                    cidade_id = ?,
                    cep = ?,
                    site = ?
                WHERE id = ?
            `;

            await db.query(query, [
                fornecedor.empresa,
                fornecedor.nomeRepresentante,
                fornecedor.telefone,
                fornecedor.email,
                fornecedor.endereco,
                fornecedor.numero,
                fornecedor.cidadeId,
                fornecedor.cep,
                fornecedor.site,
                id
            ]);

            return res.status(200).json({ message: `Fornecedor #${id} ${fornecedor.nomeRepresentante} da empresa ${fornecedor.empresa} foi atualizado com sucesso!` });
        } catch (e) {
            if (!e.statusCode) e.statusCode = 400;
            return res.status(e.statusCode).json({ error: e.message });
        }
    };

    const deleteFornecedor = async (req, res) => {
        await helpers.waitForABit(2000);
        const { id } = req.params;

        try {
            // deletando a relaçao de fornecedores do produto
            const queryDelRelacaoProduto = 'DELETE FROM tbl_produto_fornecedor WHERE fornecedor_id = ?';
            await db.query(queryDelRelacaoProduto, [id]);
            
            // deletando o produto selecionado
            const queryDelFornecedor = 'DELETE FROM tbl_fornecedores WHERE id = ?';
            await db.query(queryDelFornecedor, [id]);

            return res.status(200).json({ message: `Fornecedor #${id} removido com sucesso` });
        } catch (e) {
            if (!e.statusCode) e.statusCode = 400;
            return res.status(e.statusCode).json({ error: e.message });
        }
    };

    app.get('/api/fornecedores', getFornecedores);

    app.get('/api/fornecedores-simples', getFornecedoresSimples);

    app.get('/api/fornecedores-simples/:produtoId', getFornecedoresSimplesPorProduto);

    app.post('/api/fornecedor', insertFornecedor);

    app.put('/api/fornecedor/:id', updateFornecedor);

    app.delete('/api/fornecedor/:id', deleteFornecedor);

}