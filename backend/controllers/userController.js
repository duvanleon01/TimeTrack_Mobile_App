const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

module.exports = {
    login(req, res) {
        const email = req.body.email;
        const password = req.body.password;

        User.findByEmail(email, async (err, myUser) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al consultar el usuario',
                    error: err
                });
            }
            if (!myUser) {
                return res.status(401).json({
                    success: false,
                    message: 'El email no existe en la base de datos'
                });
            }
            const isPasswordValid = await bcrypt.compare(password, myUser.password);
            if (isPasswordValid) {
                const token = jwt.sign({ id: myUser.id, email: myUser.email }, keys.secretOrKey, {});

                const data = {
                    id: myUser.id,
                    email: myUser.email,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    image: myUser.image,
                    phone: myUser.phone,
                    rol: myUser.rol, 
                    session_token: `JWT ${token}`
                };
                return res.status(201).json({
                    success: true,
                    message: 'Usuario autenticado ',
                    data: data
                });
            }
            else {
                return res.status(401).json({
                    success: false,
                    message: 'Contraseña o correo incorrecto'
                });
            }
        });
    },

    register(req, res) {
        console.log('Datos recibidos en req.body para registro:', req.body);

        const user = req.body;
        User.create(user, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al crear al usuario',
                    error: err
                });
            } else {
                return res.status(201).json({
                    success: true,
                    message: 'Creado el Usuario',
                    data: data
                });
            }
        });
    },

    getAll(req, res) {
        User.findAll((err, users) => {
            if (err) {
                console.error('Error al obtener todos los usuarios:', err);
                return res.status(501).json({
                    success: false,
                    message: 'Error al obtener los usuarios',
                    error: err
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'Lista de usuarios obtenida exitosamente',
                    data: users
                });
            }
        });
    },

    update(req, res) {
        const user = req.body;
        User.update(user, (err, userId) => {
            if (err) {
                console.error('Error al actualizar el usuario:', err);
                return res.status(501).json({
                    success: false,
                    message: 'Error al actualizar el usuario',
                    error: err
                });
            } else if (userId === null) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado para actualizar'
                });
            }
            else {
                return res.status(200).json({
                    success: true,
                    message: 'Usuario actualizado exitosamente',
                    data: { id: userId }
                });
            }
        });
    },

    delete(req, res) {
        const id = req.params.id;
        User.delete(id, (err, userId) => {
            if (err) {
                console.error('Error al eliminar el usuario:', err);
                return res.status(501).json({
                    success: false,
                    message: 'Error al eliminar el usuario',
                    error: err
                });
            } else if (userId === null) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado para eliminar'
                });
            }
            else {
                return res.status(200).json({
                    success: true,
                    message: 'Usuario eliminado exitosamente',
                    data: { id: userId }
                });
            }
        });
    }

};