const { throwError } = require('../commons/error');

module.exports = (app, db, helpers) => {
    
    // API endpoints
    const getProdutos = async (req, res) => {

        await helpers.waitForABit(3000);

        const consulta = req.query;
        try {
            let filtro;
            if (consulta && consulta.filtro) {
                filtro = [ `%${consulta.filtro}%` ]
            } else {
                filtro = [ '%' ];
            }

            const query = `
                SELECT 
                    p.id,
                    p.nome,
                    p.preco,
                    p.is_validade_definida=1 AS isValidadeDefinida,
                    p.formato_id AS formatoId,
                    pf.nome AS formatoNome,
                    p.estoque_total AS estoqueTotal,
                    p.estoque_cursos AS estoqueCursos,
                    p.estoque_clientes AS estoqueClientes,
                    pe.validade
                FROM tbl_produtos p
                LEFT JOIN tbl_produto_formatos pf ON p.formato_id = pf.id
                LEFT JOIN tbl_produto_estoque pe ON pe.produto_id = p.id
                    and pe.id = (select pe2.id
                                    from tbl_produto_estoque pe2
                                    where pe2.produto_id = p.id AND pe2.tipo = 1
                                    ORDER BY pe2.created_at DESC
                                    LIMIT 1)
                WHERE p.nome LIKE ?
            `;

            const [results] = await db.query(query, filtro);
            return res.status(200).json({ produtos: results });
        } catch (e) {
            if (!e.statusCode) e.statusCode = 400;
            return res.status(e.statusCode).json({ error: e.message });
        }
    };

    const insertProduto = async (req, res) => {

        await helpers.waitForABit(2000);

        const produto = req.body;
        try {
            // verificar se já existe um produto com o mesmo nome
            const queryVerifyExists = `
                SELECT id
                FROM tbl_produtos
                WHERE nome LIKE ?
            `;

            const [resVerifyExists = results] = await db.query(queryVerifyExists, [ produto.nome ]);
            if (resVerifyExists.length > 0) {
                throwError('Já existe um produto cadastrado com este nome', 203);
            }
            
            const insertProdutoQuery = `
                INSERT INTO tbl_produtos (
                    nome,
                    preco,
                    is_validade_definida,
                    formato_id
                )
                VALUES (?, ?, ?, ?)
            `;

            const [produtoInsertResult = result] = await db.query(insertProdutoQuery, [
                produto.nome,
                produto.preco,
                produto.isValidadeDefinida,
                produto.formatoId
            ]);
            const produtoId = produtoInsertResult.insertId;

            if (produto.fornecedores && Array.isArray(produto.fornecedores)) {
                let errorFornecedorCount = 0;
                for (let i=0; i < produto.fornecedores.length; i++) {
                    const fornecedorId = produto.fornecedores[i];
                    try {
                        const insertFornecedorQuery = `
                            INSERT INTO tbl_produto_fornecedor (produto_id, fornecedor_id)
                            VALUES (?, ?)
                        `;
                        await db.query(insertFornecedorQuery, [produtoId, fornecedorId]);
                    } catch (e) {
                        errorFornecedorCount++;
                    }
                };

                if (errorFornecedorCount > 0) {
                    return res.status(203).json({ message: 'Produto cadastrado com sucesso, mas falhou ao relacionar um ou mais fornecedores' });
                }
            }

            return res.status(201).json({ message: 'Produto cadastrado com sucesso!' });
        } catch (e) {
            if (!e.statusCode) e.statusCode = 400;
            return res.status(e.statusCode).json({ error: e.message });
        }
    };

    const updateProduto = async (req, res) => {

        await helpers.waitForABit(2000);

        const { id } = req.params;
        const produto = req.body;

        try {
            // verificar se já existe um produto com o mesmo nome
            const queryVerifyExists = `
                SELECT id
                FROM tbl_produtos
                WHERE nome LIKE ? AND id <> ?
            `;

            const [resVerifyExists = results] = await db.query(queryVerifyExists, [ produto.nome, id ]);
            if (resVerifyExists.length > 0) {
                throwError('Já existe outro produto cadastrado com este nome', 203);
            }

            const query = `
                UPDATE tbl_produtos
                SET 
                    nome = ?,
                    preco = ?,
                    is_validade_definida = ?,
                    formato_id = ?
                WHERE id = ?
            `;

            await db.query(query, [
                produto.nome,
                produto.preco,
                produto.isValidadeDefinida,
                produto.formatoId,
                id
            ]);

            if (produto.fornecedores && Array.isArray(produto.fornecedores)) {
                const deleteFornecedorProdutoQuery = `
                    DELETE FROM tbl_produto_fornecedor
                    WHERE produto_id = ?
                `;
                await db.query(deleteFornecedorProdutoQuery, [id]);

                let errorFornecedorCount = 0;
                for (let i=0; i < produto.fornecedores.length; i++) {
                    const fornecedorId = produto.fornecedores[i];
                    try {
                        const insertFornecedorQuery = `
                            INSERT INTO tbl_produto_fornecedor (produto_id, fornecedor_id)
                            VALUES (?, ?)
                        `;
                        await db.query(insertFornecedorQuery, [id, fornecedorId]);
                    } catch (e) {
                        errorFornecedorCount++;
                    }
                };

                if (errorFornecedorCount > 0) {
                    return res.status(203).json({ message: `Produto #${id} ${produto.nome} atualizado com sucesso, mas falhou ao relacionar um ou mais fornecedores` });
                }
            }

            return res.status(200).json({ message: `Produto #${id} ${produto.nome} atualizado com sucesso!` });
        } catch (e) {
            if (!e.statusCode) e.statusCode = 400;
            return res.status(e.statusCode).json({ error: e.message });
        }
    };

    const deleteProduto = async (req, res) => {

        await helpers.waitForABit(2000);

        const { id } = req.params;

        try {
            // deletando a relaçao de fornecedores do produto
            const queryDelFornecedores = 'DELETE FROM tbl_produto_fornecedor WHERE produto_id = ?';
            await db.query(queryDelFornecedores, [id]);
            
            // deletando o historico de estoque
            const queryDelHistoricoEstoque = 'DELETE FROM tbl_produto_estoque WHERE produto_id = ?';
            await db.query(queryDelHistoricoEstoque, [id]);

            // deletando o produto selecionado
            const queryDelProduto = 'DELETE FROM tbl_produtos WHERE id = ?';
            await db.query(queryDelProduto, [id]);

            return res.status(200).json({ message: `Produto #${id} removido com sucesso` });
        } catch (e) {
            if (!e.statusCode) e.statusCode = 400;
            return res.status(e.statusCode).json({ error: e.message });
        }
    };

    app.get('/api/produtos', getProdutos);

    app.post('/api/produto', insertProduto);

    app.put('/api/produto/:id', updateProduto);

    app.delete('/api/produto/:id', deleteProduto);

    
    // controle estoques
    const insertProdutoStock = async (req, res) => {

        await helpers.waitForABit(2000);

        try {
            const estoque = req.body;
            const { id } = req.params;

            // verificar se produto existe
            const queryVerifyExists = `
                SELECT *
                FROM tbl_produtos
                WHERE id = ?
            `;

            const [produtoFromDB = results] = await db.query(queryVerifyExists, [ id ]);
            if (produtoFromDB.length == 0) {
                throwError('Produto indísponível', 404);
            }

            const produto = produtoFromDB[0];

            // update produtos com novos valores de estoque
            const isEntrada = estoque.tipo == 1;
            let queryUpdateProduto;

            if (isEntrada) {
                queryUpdateProduto = `
                    UPDATE tbl_produtos
                    SET
                        estoque_total = estoque_total + ?,
                        estoque_clientes = estoque_clientes + ?,
                        estoque_cursos = estoque_cursos + ?
                    WHERE id = ?
                `;
            } else {
                if (produto.estoque_total - estoque.total < 0) {
                    throwError(`Valor de estoque inválido! Estoque atual deste produto: ${produto.estoque_total}`, 203);
                }

                queryUpdateProduto = `
                    UPDATE tbl_produtos
                    SET
                        estoque_total = estoque_total - ?,
                        estoque_clientes = estoque_clientes - ?,
                        estoque_cursos = estoque_cursos - ?
                    WHERE id = ?
                `;
            }

            await db.query(queryUpdateProduto, [
                estoque.total,
                estoque.qtdClientes,
                estoque.qtdCursos,
                id
            ]);

            // Insert into main table
            const insertProdutoEstoqueQuery = `
                INSERT INTO tbl_produto_estoque (
                    tipo,
                    total,
                    validade,
                    qtd_clientes,
                    qtd_cursos,
                    produto_id
                )
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            await db.query(insertProdutoEstoqueQuery, [
                estoque.tipo,
                estoque.total,
                estoque.validade || null,
                estoque.qtdClientes,
                estoque.qtdCursos,
                id
            ]);

            return res.status(201).json({ message: 'Estoque registrado com sucesso!' });
        } catch (e) {
            if (!e.statusCode) e.statusCode = 400;
            return res.status(e.statusCode).send({ error: e.message });
        }
    };

    const getProdutoStock = async (req, res) => {

        await helpers.waitForABit(3000);

        const consulta = req.query;
        try {
            let query = `
                SELECT
                    pe.tipo,
                    IF(tipo = 1, 'Entrada', 'Saída') AS tipoNome,
                    pe.total,
                    pe.validade,
                    pe.qtd_clientes AS qtdClientes,
                    pe.qtd_cursos AS qtdCursos,
                    pe.created_at as createdAt,
                    p.id AS produtoId,
                    p.nome AS produtoNome,
                    p.is_validade_definida=1 AS isValidadeDefinida
                FROM tbl_produto_estoque pe
                INNER JOIN tbl_produtos p ON p.id = pe.produto_id 
                WHERE 1=1
            `;

            let filtros;
            if (consulta) {
                filtros = [];

                if (consulta.produto) {
                    filtros.push(`%${consulta.produto}%`);
                    query += ' AND p.nome LIkE ? ';
                }

                if (consulta.produtoId) {
                    filtros.push(consulta.produtoId);
                    query += ' AND p.id = ? ';
                }
            }

            query += "ORDER BY pe.created_at DESC";

            const [results] = await db.query(query, filtros);
            return res.status(200).json({ atividadesEstoque: results });
        } catch (e) {
            if (!e.statusCode) e.statusCode = 400;
            return res.status(e.statusCode).json({ error: e.message });
        }
    };

    app.get('/api/produto/estoque', getProdutoStock);
    app.post('/api/produto/estoque/:id', insertProdutoStock);
}