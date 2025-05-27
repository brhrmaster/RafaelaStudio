const { throwError } = require('../commons/error');

module.exports = (app, db, helpers) => {

    const getTotalProdutosPorFornecedor = async () => {
        // Fornecedores e o total de produtos relacionados
        const queryTotalProdutosPorFornecedor = `
            SELECT
                f.empresa,
                (SELECT COUNT(0) FROM tbl_produto_fornecedor WHERE fornecedor_id = f.id) AS totalProdutos
            FROM tbl_fornecedores f
            WHERE (SELECT COUNT(0) FROM tbl_produto_fornecedor WHERE fornecedor_id = f.id) > 0
            ORDER BY (SELECT COUNT(0) FROM tbl_produto_fornecedor WHERE fornecedor_id = f.id) DESC
        `;

        const [totalProdutosPorFornecedor = results] = await db.query(queryTotalProdutosPorFornecedor);

        return totalProdutosPorFornecedor;
    }

    const getTotalFornecedoresCadastradosNoMes = async () => {
        // Total fornecedores cadastrados no ultimo mes
        const queryFornecedoresRecentementeCriados = `
            SELECT COUNT(0) AS total
            FROM tbl_fornecedores f
            WHERE created_at >= (SELECT NOW() - INTERVAL 1 MONTH)
        `;

        const [totalFornecedoresRecentementeCriados = results] = await db.query(queryFornecedoresRecentementeCriados);
        return totalFornecedoresRecentementeCriados[0].total;
    }

    const getTotalProdutosCadastradosNoMes = async () => {

        // Total produtos cadastrados no ultimo mes
        const queryProdutosRecentementeCriados = `
            SELECT COUNT(0) as total
            FROM tbl_produtos f
            WHERE created_at >= (SELECT NOW() - INTERVAL 1 MONTH)
        `;

        const [totalProdutosRecentementeCriados = results] = await db.query(queryProdutosRecentementeCriados);
        return totalProdutosRecentementeCriados[0].total;
    }

    const getTotalEntradasSaidasProdutos = async () => {

        // Entradas e saídas de estoque
        const queryEntradaSaidaProdutos = `
            SELECT
                DATE_FORMAT(created_at, "%Y-%m-%d") AS dayOfMonth,
                tipo,
                CAST(SUM(total) AS UNSIGNED) AS total
            FROM tbl_produto_estoque
            WHERE created_at >= (SELECT NOW() - INTERVAL 1 MONTH)
            GROUP BY dayOfMonth, tipo
            ORDER BY dayOfMonth;
        `;

        const [totalEntradaSaidaProdutos = results] = await db.query(queryEntradaSaidaProdutos);
        return totalEntradaSaidaProdutos;
    }

    const getProdutosVencidosVencendo = async () => {
        // 1. Consultar entradas (agrupadas por validade)
        const queryEntradas = `
            SELECT
                p.id,
                p.nome,
                e.validade,
                SUM(e.total) AS total_entrada
            FROM tbl_produtos p
            JOIN tbl_produto_estoque e ON p.id = e.produto_id
            WHERE
                p.is_validade_definida = 1
                AND e.tipo = 1
                AND e.validade IS NOT NULL
            GROUP BY p.id, p.nome, e.validade
            ORDER BY p.id, e.validade ASC
        `;
        const [entradas] = await db.query(queryEntradas);

        // 2. Consultar saídas totais por produto
        const querySaidas = `
            SELECT
                produto_id,
                SUM(total) AS total_saida
            FROM tbl_produto_estoque
            WHERE tipo = 0
            GROUP BY produto_id
        `;
        const [saidasRows] = await db.query(querySaidas);
        const saidas = {};
        for (const row of saidasRows) {
            saidas[row.produto_id] = Number(row.total_saida) || 0;
        }

        // Agrupar entradas por produto para processar FIFO
        const produtosLotes = {};
        for (const entrada of entradas) {
            if (!produtosLotes[entrada.id]) produtosLotes[entrada.id] = [];
            produtosLotes[entrada.id].push({
                validade: entrada.validade,
                nome: entrada.nome,
                total_entrada: Number(entrada.total_entrada)
            });
        }

        const dateToYMD = date => {
            // Aceita Date ou string no formato YYYY-MM-DD
            if (typeof date === "string") return date.slice(0, 10);
            return date.toISOString().slice(0, 10);
        };

        const hoje = new Date();
        const daqui30dias = new Date();
        daqui30dias.setDate(hoje.getDate() + 30);
        const hojeYMD = dateToYMD(hoje);
        const daqui30diasYMD = dateToYMD(daqui30dias);

        // resultado parcial: id -> saldo por lote vencido e saldo por lote vencendo
        const vencidosMap = new Map();
        const vencendoMap = new Map();

        for (const [produtoId, lotes] of Object.entries(produtosLotes)) {
            let saidaRestante = saidas[produtoId] || 0;
            // Sempre processar os lotes na ordem da validade ASC (importante para FIFO!)
            lotes.sort((a, b) => dateToYMD(b.validade).localeCompare(dateToYMD(a.validade)));

            for (const lote of lotes) {
                let saldo = lote.total_entrada;
                if (saidaRestante >= saldo) {
                    saidaRestante -= saldo;
                    saldo = 0;
                } else {
                    saldo -= saidaRestante;
                    saidaRestante = 0;
                }
                if (saldo > 0) {
                    const validadeYMD = dateToYMD(lote.validade);
                    
                    if (validadeYMD < hojeYMD) {
                        // Vencido
                        if (!vencidosMap.has(produtoId)) vencidosMap.set(produtoId, { id: Number(produtoId), nome: lote.nome, total: 0 });
                        vencidosMap.get(produtoId).total += saldo;
                    } else if (validadeYMD >= hojeYMD && validadeYMD <= daqui30diasYMD) {
                        // Vencendo em 30 dias
                        if (!vencendoMap.has(produtoId)) vencendoMap.set(produtoId, { id: Number(produtoId), nome: lote.nome, total: 0 });
                        vencendoMap.get(produtoId).total += saldo;
                    }
                }
            }
        }

        const vencidos = Array.from(vencidosMap.values());
        const vencendo = Array.from(vencendoMap.values());

        return {
            vencidos,
            vencendo
        };
    }

    // API endpoints
    const getReports = async (req, res) => {
        try {
            return res.status(200).json({
                totalFornecedoresRecentementeCriados: await getTotalFornecedoresCadastradosNoMes(),
                totalProdutosRecentementeCriados: await getTotalProdutosCadastradosNoMes(),
                totalProdutosPorFornecedor: await getTotalProdutosPorFornecedor(),
                totalEntradaSaidaProdutos: await getTotalEntradasSaidasProdutos(),
                produtosVencimento: await getProdutosVencidosVencendo(),
            });
        } catch (e) {
            if (!e.statusCode) e.statusCode = 400;
            return res.status(e.statusCode).json({ error: e.message });
        }
    };

    const getReportsVencimento = async (req, res) => {
        try {
            return res.status(200).json({
                produtosVencimento: await getProdutosVencidosVencendo(),
            });
        } catch (e) {
            if (!e.statusCode) e.statusCode = 400;
            return res.status(e.statusCode).json({ error: e.message });
        }
    }

    app.get('/api/reports', getReports);
    app.get('/api/reports-vencimento', getReportsVencimento);
}