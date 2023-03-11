//Desestructuracion de los objetos
const { response, request } = require('express');
//Libreria para encriptacion
const bcrypt = require('bcryptjs');
//Importacion del modelo
const Usuario = require('../models/usuario');
const { existeUsuarioById } = require('../helpers/db-validators');

const getClientes = async (req = request, res = response) => {
    //Condiciones del get devuelve todos los usuarios con role alumno y estado true
    const query = { rol: "CLIENT", estado: true };

    //Promesa para obtener los registros
    const listaClientes = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ]);

    //Impresion de registros
    res.status(201).json(listaClientes);
};

const postCliente = async (req = request, res = response) => {
    //Desestructuracion objeto
    const rol = "CLIENTE";
    const { nombre, correo, password } = req.body;
    //Datos obligatorios
    const clienteGuardado = new Usuario({ nombre, correo, password, rol });
    //Encriptar password
    const salt = bcrypt.genSaltSync(10);
    clienteGuardado.password = bcrypt.hashSync(password, salt);

    //Guardar en base de datos
    await clienteGuardado.save();

    res.status(201).json(clienteGuardado);
};

const putCliente = async (req = request, res = response) => {
    //Desestructuracion del parametro recibido a travez de la URL
    const { id } = req.params;
    //Evalua que el id del token sea igual al id a modificar
    //Si es asi lo modifica, si no, no lo modifica
    const user = await existeUsuarioById(id);
    if (findId(req.usuario._id,user.id)) {
        //Desestructuracion de los campos a reemplazar
        const { _id, rol, ...resto } = req.body;
        //Si existe la password o viene en el req.body, la encripta
        if (resto.password) {
            //Encriptar password
            const salt = bcrypt.genSaltSync(10);
            resto.password = bcrypt.hashSync(resto.password, salt);
        }
        //Editar usando el id
        const clienteEditado = await Usuario.findByIdAndUpdate(id, resto);
        res.status(201).json(clienteEditado);
    } else {
        res.status(401).json('No puede modificar a otros usuarios')
    }
};

const deleteCliente = async (req = request, res = response) => {
    //Desestructuracion del parametro recibido a travez de la URL
    const { id } = req.params;
    //Evalua que el id del token sea igual al id a eliminar
    //Si es asi lo elimina, si no, no lo elimina
    const user = await existeUsuarioById(id);
    if (findId(req.usuario._id,user.id)) {
        const clienteDelete = await Usuario.findByIdAndDelete(id);
        res.status(201).json(clienteDelete);
    } else {
        res.status(401).json('No puede eliminar a otros usuarios');
    }
};

const findId = (uid, id) => {
    return uid == id;
}

module.exports = {
    getClientes, postCliente, putCliente, deleteCliente
};