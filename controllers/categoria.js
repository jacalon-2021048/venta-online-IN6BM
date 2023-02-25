//Desestructuracion de los objetos
const { response, request } = require('express');
//Importacion del modelo
const Categoria = require('../models/categoria');
const { validarCategoria } = require('../helpers/db-validators');
const getCategoria = async (req = request, res = response) => {
    //Condicion del get, devuelve categorias con estado true
    const query = { estado: true };
    //Promesa para obtener los registros
    const listaCategoria = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
    ]);
    //Impresion de registros
    res.status(201).json(listaCategoria);
};

const postCategoria = async (req = request, res = response) => {
    //Desestructuracion objeto
    const { nombre, tipoCategoria } = req.body;
    const categoriaGuardada = new Categoria({ nombre, tipoCategoria });
    //Guardar en base de datos
    await categoriaGuardada.save();
    //Impresion producto registrado
    res.status(201).json(categoriaGuardada);
};

const putCategoria = async (req = request, res = response) => {
    //Desestructuracion del parametro recibido a travez de la URL
    const { id } = req.params;
    //Desestructuracion de los campos a reemplazar
    const { _id, ...resto } = req.body;
    //Editar usando el id
    const categoriaEditada = await Categoria.findByIdAndUpdate(id, resto);
    //Impresion resultados
    res.status(201).json(categoriaEditada);
};

const deleteCategoria = async (req = request, res = response) => {
    //Desestructuracion del parametro recibido a travez de la URL
    const { id } = req.params;
    //Eliminacion del registro en la base de datos, con su id
    const categoriaDelete = await Categoria.findByIdAndDelete(id);
    validarCategoria(id);
    //Impresion elemento eliminado
    res.status(201).json(categoriaDelete);
};

module.exports = {
    getCategoria, postCategoria, putCategoria, deleteCategoria
};