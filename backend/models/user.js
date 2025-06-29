const db = require('../config/config');
const bcrypt = require('bcryptjs');
const User = {};

// 1. READ: Buscar un usuario por ID
User.findById = (id, result) => {
  const sql = `SELECT id, email, name, lastname, rol, image, password, created_at, updated_at FROM users WHERE id = ?`;
  db.query(sql,
      [id], (err, user) => {
          if (err) {
              console.log('Error al consultar por ID: ', err);
              result(err, null);
          }
          else {
              console.log('Usuario consultado por ID: ', user[0]);
              result(null, user[0]);
          }
      }
  );
}

// 2. READ: Buscar un usuario por Email
User.findByEmail = (email, result) => {
  const sql = `SELECT id, email, name, lastname, phone, image, password, rol, created_at, updated_at FROM users WHERE email = ?`;
  db.query(
      sql,
      [email], 
      (err, user) => {
          if (err) {
              console.log('Error al consultar por Email: ', err);
              result(err, null);
          }
          else {
              console.log('Usuario consultado por Email: ', user[0]);
              result(null, user[0]);
          }
      }
  );
}

// 3. READ: Obtener todos los usuarios
User.findAll = (result) => {
  const sql = `SELECT id, email, name, lastname, phone, rol, image, created_at, updated_at FROM users ORDER BY name ASC`;
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

// 4. CREATE: Crear un nuevo usuario
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
                        rol,               
                        created_at,
                        updated_at
                    ) VALUES (?,?,?,?,?,?,?,?,?)`;
        db.query(
            sql,
            [
                user.email,
                user.name,
                user.lastname,
                user.phone,
                user.image,
                hash,
                user.rol || 'usuario',
                new Date(),
                new Date()
            ],
            (err, res) => {
                if (err) {
                    console.log('Error al crear al Usuario: ', err);
                    result(err, null);
                } else {
                    console.log('Usuario creado: ', { id: res.insertId, ...user });
                    result(null, { id: res.insertId, ...user });
                }
            }
        );
    } catch (error) {
        console.log('Error en User.create (hashing/DB): ', error);
        result(error, null);
    }
};

// 5. UPDATE: Actualizar un usuario existente
User.update = async (user, result) => { 
    let passwordHash = user.password; 
    if (passwordHash && passwordHash.length < 50) { 
        passwordHash = await bcrypt.hash(passwordHash, 10);
        console.log('User.update: Password hasheado con éxito. Nuevo hash:', passwordHash); 
    } else {
        console.log('User.update: No se proporcionó nueva contraseña o ya está hasheada.');
    }

    const sql = `UPDATE users
                 SET email = ?, name = ?, lastname = ?, phone = ?, image = ?, password = ?, rol = ?, updated_at = ?
                 WHERE id = ?`;
    db.query(
        sql,
        [
            user.email,
            user.name,
            user.lastname,
            user.phone,
            user.image,
            passwordHash,
            user.rol, 
            new Date(),
            user.id
        ],
        (err, res) => {
            if (err) {
                console.log('Error al actualizar el Usuario en: ', err);
                result(err, null);
            } else {
                if (res.changedRows > 0) {
                    console.log('Usuario actualizado: ', user.id);
                    result(null, user.id);
                } else {
                    console.log('Usuario no encontrado o sin cambios: ', user.id);
                    result(null, null);
                }
            }
        }
    );
};

// 6. DELETE: Eliminar un usuario
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
                if (res.affectedRows > 0) {
                    console.log('Usuario eliminado: ', id);
                    result(null, id);
                } else {
                    console.log('Usuario no encontrado para eliminar: ', id);
                    result(null, null);
                }
            }
        }
    );
};

module.exports = User;