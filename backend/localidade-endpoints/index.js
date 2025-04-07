const { throwError } = require('../commons/error');

module.exports = (app, db, helpers) => {
    
    // API endpoints
    const getCidades = async (req, res) => {
        await helpers.waitForABit(3000);
        const params = req.params;
        try {
            const query = `
                SELECT 
                    c.id,
                    c.nome,
                    c.estado_id
                FROM tbl_cidades c
                WHERE c.estado_id = ?
                ORDER BY c.nome ASC
            `;

            const [results] = await db.query(query, [params.uf_id]);
            return res.status(200).json({ cidades: results });
        } catch (e) {
            if (!e.statusCode) e.statusCode = 400;
            return res.status(e.statusCode).json({ error: e.message });
        }
    };

    const getEstados = async (req, res) => {
        try {

            const query = `
                SELECT 
                    e.id,
                    e.nome,
                    e.uf
                FROM tbl_estados e
                ORDER BY e.nome ASC
            `;

            const [results] = await db.query(query);
            return res.status(200).json({ estados: results });
        } catch (e) {
            if (!e.statusCode) e.statusCode = 400;
            return res.status(e.statusCode).json({ error: e.message });
        }
    };

    app.get('/api/cidades/:uf_id', getCidades);

    app.get('/api/estados', getEstados);
}