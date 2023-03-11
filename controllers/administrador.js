//Desestructuracion de los objetos
const { response, request } = require('express');
//Libreria para encriptacion
const bcrypt = require('bcryptjs');
//Importacion del modelo
const Usuario = require('../models/usuario');
//Validaciones usuarios
const { existeUsuarioById } = require('../helpers/db-validators');

const getAdministradores = async (req = request, res = response) => {
    //Condiciones del get devuelve todos los usuarios con estado true
    const query = { rol: "ADMIN", estado: true };
    //Promesa para obtener los registros
    const listaAdmins = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ]);
    //Impresion de registros
    res.status(201).json(listaAdmins);
};

const postAdministrador = async (req = request, res = response) => {
    //Desestructuracion objeto
    const { nombre, correo, password, rol } = req.body;
    let rolFinal = (rol) ? rol.toUpperCase() : "ADMIN";
    //Datos obligatorios
    const userGuardado = new Usuario({ nombre, correo, password, rol: rolFinal });
    //Encriptar password
    const salt = bcrypt.genSaltSync(10);
    userGuardado.password = bcrypt.hashSync(password, salt);
    //Guardar en base de datos
    await userGuardado.save();
    //Impresion de registros
    res.status(201).json(userGuardado);
};

const putAdministrador = async (req = request, res = response) => {
    //Desestructuracion del parametro recibido a travez de la URL
    const { id } = req.params;
    const user = await existeUsuarioById(id);
    if (user.rol == "CLIENTE" || findId(req.usuario._id,user.id)) {
        //Desestructuracion de los campos a reemplazar
        const { _id, ...resto } = req.body;
        //Si existe la password o viene en el req.body, la encripta
        if (resto.password) {
            //Encriptar password
            const salt = bcrypt.genSaltSync(10);
            resto.password = bcrypt.hashSync(resto.password, salt);
        }
        resto.rol = (resto.rol) ? resto.rol.toUpperCase() : "ADMIN";
        //Editar usando el id
        const administradorEditado = await Usuario.findByIdAndUpdate(id, resto);
        res.status(201).json(administradorEditado);
    } else {
        res.status(401).json({ error: 'No está autorizado para modificar a otros administradores' });
    }
};

const deleteAdministrador = async (req = request, res = response) => {
    //Desestructuracion del parametro recibido a travez de la URL
    const { id } = req.params;
    const user = await existeUsuarioById(id);
    //Evalua que el id del token sea igual al id a eliminar
    //Si es asi lo elimina, si no, no lo elimina
    if (user.rol == "CLIENTE" || findId(req.usuario._id,user.id)) {
        const administradorDelete = await Usuario.findByIdAndDelete(id);
        res.status(201).json(administradorDelete);
    } else {
        res.status(401).json({ error: 'No está autorizado para eliminar a otros administradores' });
    }
};

const findId = (uid, id) => {
    return uid == id;
}

module.exports = {
    getAdministradores, postAdministrador, putAdministrador, deleteAdministrador
};