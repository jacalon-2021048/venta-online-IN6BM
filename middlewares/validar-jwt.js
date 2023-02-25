//Importaciones
const { response, request } = require('express');
const jwt = require('jsonwebtoken');
//Importacion modelo
const Usuario = require('../models/usuario')

const validarJWT = async (req = request, res = response, next) => {
    //Solicitud del token en el header
    const token = req.header('x-token');
    
    //Verificar si el token enviado existe
    if (!token) {
        return res.status(401).json('No hay token en la peticion');
    }

    try {
        //Verificacion del token con una llave privada para decodificar el token
        const { uid } = jwt.verify(token, process.env.SECRET_KEY_FOR_TOKEN);

        //Extrer informacion del usuario que corresponda el uid
        const usuario = await Usuario.findById(uid);

        //Verificar si el uid del usuario no existe
        if (!usuario) {
            return req.status(400).json('Token no valido - el usuario no esta registrado');
        }

        //Verificar si el uid tiene estado true
        if (!usuario.estado) {
            return req.status(400).json('Token no valido - el usuario esta dado de baja');
        }
        //Si no hay error se iguala el usuario de la base de datos al del objeto request
        //Sigue con la ejecucion
        req.usuario = usuario;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json('Token no valido');
    }

}

module.exports = {
    validarJWT
}