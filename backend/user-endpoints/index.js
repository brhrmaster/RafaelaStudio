const md5 = require('md5');
const { throwError } = require('../commons/error');

const validateUserId = (id) => {
    if (!id || Number(id) == NaN) {
        throwError('id é obrigatório', 400);
    }

    if (id <= 1 ) {
        throwError('id inválido', 400);
    }
};

const validateUserNome = (nome) => {
    if (!nome || nome.length === 0) {
        throwError('nome é obrigatório', 400);
    }
}

const validateUserLogin = (login) => {
    if (!login || login.length === 0) {
        throwError('login é obrigatório', 400);
    }
}

const validateUserPassword = (password) => {
    if (!password || password.length === 0) {
        throwError('password é obrigatório', 400);
    }
}

module.exports = (app, db, helpers) => {

    const insertUser = async (req, res) => {

        await helpers.waitForABit(1500);

        const { nome, login, password } = req.body;

        try {
            validateUserNome(nome);
            validateUserLogin(login);
            validateUserPassword(password);

            const queryVerifyExists = `
                SELECT u.*
                FROM tbl_usuarios u
                WHERE u.login LIKE ? AND is_active = 1
            `;

            const [resVerifyExists = results] = await db.query(queryVerifyExists, [ login ]);

            if (resVerifyExists.length > 0) {
                throwError('Usuário já existe!', 203);
            }

            const queryVerifyExistsInactive = `
                SELECT u.*
                FROM tbl_usuarios u
                WHERE u.login LIKE ? AND is_active = 0
            `;

            const [resVerifyInactive = results] = await db.query(queryVerifyExistsInactive, [ login ]);

            if (resVerifyInactive.length > 0) {
                const currentInactiveUser = resVerifyInactive[0];

                // Insert into main table
                const updateUsuarioQuery = `
                    UPDATE tbl_usuarios
                    SET nome = ?, login = ?, password = ?, is_active = 1
                    WHERE login LIKE ?
                `;

                const newPassword = md5(password);

                await db.query(updateUsuarioQuery, [nome, login, newPassword, login]);
                return res.status(201).json({ message: 'Usuário adicionado com sucesso' });
            }

            // Insert into main table
            const insertUsuarioQuery = `
                INSERT INTO tbl_usuarios (nome, login, password)
                VALUES (?, ?, ?)
            `;

            const newPassword = md5(password);

            await db.query(insertUsuarioQuery, [nome, login, newPassword]);
            return res.status(201).json({ message: 'Usuário adicionado com sucesso' });
        } catch (e) {
            if (!e.statusCode) e.statusCode = 400;
            return res.status(e.statusCode).json({ error: e.message });
        }
    };

    const updateUser = async (req, res) => {

        await helpers.waitForABit(2000);

        const { id } = req.params;
        const { nome, login } = req.body;

        try {
            validateUserId(id);
            validateUserNome(nome);
            validateUserLogin(login);

            // Verify if login is for the right person
            const queryVerifyOwner = `
                SELECT u.*
                FROM tbl_usuarios u
                WHERE u.login LIKE ? AND u.id <> ?
            `;

            const [resVerifyOwner = results] = await db.query(queryVerifyOwner, [ login, id ]);
                
            if (resVerifyOwner.length > 0) {
                throwError('Usuário já existe com este login!', 203);
            }

            // Verify if login is exists based on the ID
            const queryExists = `
                SELECT u.*
                FROM tbl_usuarios u
                WHERE u.id = ?
            `;

            const [resVerifyExists = results] = await db.query(queryExists, [ id ]);

            if (resVerifyExists.length == 0) {
                throwError('id inválido!', 400);
            }

            // Insert into main table
            const updateUsuarioQuery = `
                UPDATE tbl_usuarios
                SET nome = ?, login = ?
                WHERE id = ?
            `;

            await db.query(updateUsuarioQuery, [nome, login, id]);
            return res.status(201).json({ message: 'Usuário atualizado com sucesso' });
        } catch (e) {
            if (!e.statusCode) e.statusCode = 400;
            return res.status(e.statusCode).json({ error: e.message });
        }
    };

    const deleteUser = async (req, res) => {

        await helpers.waitForABit(2000);

        const { id } = req.params;

        try {
            validateUserId(id);

            // Verify if login is exists based on the ID
            const queryExists = `
                SELECT u.*
                FROM tbl_usuarios u
                WHERE u.id = ? AND u.id <> 1 AND is_active = 1
            `;

            const [resVerifyExists = results] = await db.query(queryExists, [ id ]);

            if (resVerifyExists.length == 0) {
                throwError('id inválido!', 400);
            }

            // Insert into main table
            const softDeleteUsuarioQuery = `
                UPDATE tbl_usuarios
                SET is_active = 0
                WHERE id = ?
            `;

            await db.query(softDeleteUsuarioQuery, [id]);

            return res.status(201).json({ message: 'Usuário removido com sucesso' });
        } catch (e) {
            if (!e.statusCode) e.statusCode = 400;
            return res.status(e.statusCode).json({ error: e.message });
        }
    };

    const getUsers = async (req, res) => {

        await helpers.waitForABit(3000);

        const consulta = req.query;
        try {
            let filtro;
            if (consulta && consulta.filtro) {
                filtro = [ `%${consulta.filtro}%`, `%${consulta.filtro}%` ]
            } else {
                filtro = [ '%', '%' ];
            }

            const queryUsers = `
                SELECT u.id, u.nome, u.login
                FROM tbl_usuarios u
                WHERE is_active = 1 AND (u.nome LIKE ? OR u.login LIKE ?)
            `;

            const [results] = await db.query(queryUsers, filtro);

            return res.status(200).json({ users: results });
        } catch (e) {
            if (!e.statusCode) e.statusCode = 400;
            return res.status(e.statusCode).json({ error: e.message });
        }
    };

    const loginUser = async (req, res) => {

        await helpers.waitForABit(3000);

        const { login, password } = req.body;

        try {
            const queryUsers = `
                SELECT u.id, u.nome, u.login
                FROM tbl_usuarios u
                WHERE u.is_active = 1 AND u.login LIKE ? AND password = ?
            `;

            const newPassword = md5(password);

            const [results] = await db.query(queryUsers, [login, newPassword]);
            if (results.length > 0) {
                return res.status(200).json(results[0]);
            }

            return res.status(401).json({ });

        } catch (e) {
            if (!e.statusCode) e.statusCode = 400;
            return res.status(e.statusCode).json({ error: e.message });
        }
    };

    app.post('/api/usuario/login', loginUser);

    app.get('/api/usuarios', getUsers);

    app.post('/api/usuario', insertUser);

    app.put('/api/usuario/:id', updateUser);
    
    app.delete('/api/usuario/:id', deleteUser);
}