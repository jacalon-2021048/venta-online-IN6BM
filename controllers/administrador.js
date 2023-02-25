//Desestructuracion de los objetos
const { response, request } = require('express');
//Libreria para encriptacion
const bcrypt = require('bcryptjs');
//Importacion del modelo
const Usuario = require('../models/usuario');

const getAdministradores = async (req = request, res = response) => {
    //Condiciones del get devuelve todos los usuarios con estado true
    const query = { rol: "ADMIN", estado: true };

    //Promesa para obtener los registros
    const listaMaestros = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ]);

    //Impresion de registros
    res.status(201).json(listaMaestros);
};

const postAdministrador = async (req = request, res = response) => {
    //Desestructuracion objeto
    const rol = "ADMIN";
    const { nombre, correo, password } = req.body;
    //Datos obligatorios
    const administradorGuardado = new Usuario({ nombre, correo, password, rol });

    //Encriptar password
    const salt = bcrypt.genSaltSync(10);
    administradorGuardado.password = bcrypt.hashSync(password, salt);

    //Guardar en base de datos
    await administradorGuardado.save();

    res.status(201).json(administradorGuardado);
};

const putAdministrador = async (req = request, res = response) => {
    //Desestructuracion del parametro recibido a travez de la URL
    const { id } = req.params;
    //Evalua que el id del token sea igual al id a modificar
    //Si es asi lo modifica, si no, no lo modifica
    if (findId(req.usuario._id, id)) {
        //Desestructuracion de los campos a reemplazar
        const { _id, rol, ...resto } = req.body;
        //Si existe la password o viene en el req.body, la encripta
        if (resto.password) {
            //Encriptar password
            const salt = bcrypt.genSaltSync(10);
            resto.password = bcrypt.hashSync(resto.password, salt);
        }
        //Editar usando el id
        const administradorEditado = await Usuario.findByIdAndUpdate(id, resto);
        res.status(201).json(administradorEditado);
    } else {
        res.status(401).json('No puede modificar a otros usuarios')
    }
};

const deleteAdministrador = async (req = request, res = response) => {
    //Desestructuracion del parametro recibido a travez de la URL
    const { id } = req.params;
    //Evalua que el id del token sea igual al id a eliminar
    //Si es asi lo elimina, si no, no lo elimina
    if (findId(req.usuario._id, id)) {
        const administradorDelete = await Usuario.findByIdAndDelete(id);
        res.status(201).json(administradorDelete);
    } else {
        res.status(401).json('No puede eliminar a otros usuarios');
    }
};

const findId = (uid, id) => {
    return uid == id;
}

module.exports = {
    getAdministradores, postAdministrador, putAdministrador, deleteAdministrador
};