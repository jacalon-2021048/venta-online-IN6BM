//Desestructuracion de los objetos
const { response, request } = require('express');
//Importacion del modelo
const Categoria = require('../models/categoria');

const getCategoria = async (req = request, res = response) => {
    //Condicion del get, devuelve categorias con estado true
    const query = { estado: true };

    //Promesa para obtener los registros
    const listaCategoria = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
    ]);

    //Impresion de registros
    res.json({
        msg: 'get API - Controlador Categoria',
        listaCategoria
    });
};

const postCategoria = async (req = request, res = response) => {
    //Desestructuracion objeto
    const { nombre, tipoCategoria,descripcionCategoria } = req.body;
    const categoriaGuardada = new Categoria({ nombre, tipoCategoria, descripcionCategoria });//Datos obligatorios

    //Guardar en base de datos
    await categoriaGuardada.save();

    res.json({
        msg: 'Controlador Categoria - POST',
        categoriaGuardada
    });
};

const putCategoria = async (req = request, res = response) => {
    //Desestructuracion del parametro recibido a travez de la URL
    const { id } = req.params;
    //Desestructuracion de los campos a reemplazar
    const { _id, ...resto } = req.body;
    //Editar usando el id
    const categoriaEditada = await Categoria.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'get API - Controlador Categoria - PUT',
        categoriaEditada
    });
};

const deleteCategoria = async (req = request, res = response) => {
    //Desestructuracion del parametro recibido a travez de la URL
    const { id } = req.params;
    
    //Eliminacion cambiando variable estado a false
    const categoriaDelete = await Categoria.findByIdAndDelete(id);

    res.json({
        msg: 'get API - Controlador Categoria - DELETE',
        categoriaDelete        
    });
};

module.exports = {
    getCategoria, postCategoria, putCategoria, deleteCategoria
};