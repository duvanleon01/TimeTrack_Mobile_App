   const db = require('../config/config');
   const bcrypt = require('bcryptjs');
   const User = {};
 
   User.findById = (id, result) => {
     const sql = `SELECT id, email, name, lastname, image, password FROM users WHERE id = ?`;
     db.query(sql,
         [id], (err, user) => {
             if (err) {
                 console.log('Error al consultar por ID: ', err);
                 result(err, null);
             }
             else {
                 console.log('Usuario consultado por ID: ',  user[0] );
                 result(null, user[0]);
 
             }
         }
     );
   }
 
   User.findByEmail = (email, result) => {
     const sql = `SELECT id, email, name, lastname, image, phone, password FROM users WHERE email = ?`;
     db.query(
         sql,
         [email], 
         (err, user) => {
             if (err) {
                 console.log('Error al consultar por Email: ', err);
                 result(err, null);
             }
             else {
                 console.log('Usuario consultado por Email: ',  user[0] );
                 result(null, user[0]);
             }
        }
     );
   }

   User.findAll = (result) => {
    const sql = `SELECT id, email, name, lastname, image, phone, created_at, updated_at FROM users ORDER BY name ASC`;
    db.query(
        sql,
        (err, users) => {
            if (err) {
                console.log('Error al consultar todos los usuarios: ', err);
                result(err, null);
            } else {
                console.log('Todos los usuarios consultados: ', users.length);
                result(null, users);
            }
        }
    );
};

   User.create = async (user, result) => {
        try {
            const hash = await bcrypt.hash(user.password, 10);
            const sql = `INSERT INTO users(
                            email,
                            name,
                            lastname,
                            phone,
                            image,
                            password,
                            created_at,
                            updated_at
                        ) VALUES (?,?,?,?,?,?,?,?)`;
            db.query(
                sql,
                [
                    user.email,
                    user.name,
                    user.lastname,
                    user.phone,
                    user.image,
                    hash,
                    new Date(),
                    new Date()
                ],
                (err, res) => {
                    if (err) {
                        console.log('Error al crear el Usuario: ', err);
                        result(err, null);
                    } else {
                        console.log('Usuario creado: ', { id: res.insertId, ...user });
                        result(null, { id: res.insertId, ...user });
                    }
                }
            );
        } catch (error) {
            console.log('Error en User.create (hashing/DB): ', error); // Captura errores del bcrypt o antes del db.query
            result(error, null);
        }
    };

    User.update = (user, result) => {
        const sql = `UPDATE
                        users
                    SET
                        email = ?,
                        name = ?,
                        lastname = ?,
                        phone = ?,
                        image = ?,
                        updated_at = ?
                    WHERE
                        id = ?`;
        db.query(
            sql,
            [
                user.email,
                user.name,
                user.lastname,
                user.phone,
                user.image,
                new Date(),
                user.id // Se requiere el ID del usuario para la actualización
            ],
            (err, res) => {
                if (err) {
                    console.log('Error al actualizar el Usuario: ', err);
                    result(err, null);
                } else {
                    // 'changedRows' indica si alguna fila fue realmente modificada
                    if (res.changedRows > 0) {
                        console.log('Usuario actualizado: ', user.id);
                        result(null, user.id); // Devolver el ID o un objeto actualizado
                    } else {
                        console.log('Usuario no encontrado o sin cambios: ', user.id);
                        // Retornar un error específico o null si el usuario no existe para actualizar
                        result(null, null);
                    }
                }
            }
        );
    };

    User.delete = (id, result) => {
        const sql = `DELETE FROM users WHERE id = ?`;
        db.query(
            sql,
            [id],
            (err, res) => {
                if (err) {
                    console.log('Error al eliminar el Usuario: ', err);
                    result(err, null);
                } else {
                    // 'affectedRows' indica cuántas filas fueron eliminadas
                    if (res.affectedRows > 0) {
                        console.log('Usuario eliminado: ', id);
                        result(null, id); // Devolver el ID del usuario eliminado
                    } else {
                        console.log('Usuario no encontrado para eliminar: ', id);
                        // Retornar un error específico o null si el usuario no existe para eliminar
                        result(null, null);
                    }
                }
            }
        );
    };
 
   module.exports = User;