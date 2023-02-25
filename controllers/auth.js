//Importaciones necesarias
const { request, response } = require('express');
//Importacion modelo
const Usuario = require('../models/usuario');
//Libreria para desencriptar el password
const bcrypt = require('bcryptjs');
//Importando el helper para generar token
const { generarJWT } = require('../helpers/generar-jwt');

const login = async (req = request, res = response) => {
    //Desestructuracion parametros recibidos en el body
    const { correo, password } = req.body;

    try {
        //Verificar si el correo del usuario existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json("El correo no existe en la BD");
        }
        //Si el usuario esta activo ( estado = false )
        if (usuario.estado === false) {
            return res.status(400).json('El usuario esta deshabilitado');
        }
        //Verificar el password
        const validarPassword = bcrypt.compareSync(password, usuario.password);
        if (!validarPassword) {
            return res.status(400).json('El password no coincide con el registrado');
        }
        //Generar JWT
        const token = await generarJWT(usuario.id);
        res.status(202).json({ msg: `Bienvenido, usted accedio con un rol: ${usuario.rol}`, token });
    } catch (error) {
        console.log(error);
        res.status(500).json('El usuario ingresado no esta registrado');
    }
}

module.exports = {
    login
}