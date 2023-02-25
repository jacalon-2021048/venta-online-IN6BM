//Desestructuracion de los objetos
const { response, request } = require('express');
//Importacion del modelo
const Producto = require('../models/producto')

const getProductos = async (req = request, res = response) => {
    //Condiciones del get, devuelve los productos con disponibilidad true
    const query = { disponible: true };
    //Promesa para obtener los registros
    const listaProducto = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query).populate('usuario', 'nombre').populate('categoria', 'nombre')
    ]);
    //Impresion registros
    res.status(201).json(listaProducto);
}

const getProductoPorId = async (req = request, res = response) => {
    //Desestructuracion del parametro recibido a travez de la URL
    const { id } = req.params;
    //Variable para obtener los registros
    const productoById = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre');
    //Impresion registro
    res.status(201).json(productoById);
}

const getProductosAgotados = async (req = request, res = response) => {
    //Condiciones del get, devuelve los productos con disponibilidad false
    const query = { disponible: false };
    //Promesa para obtener los registros
    const listaProducto = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query).populate('usuario', 'nombre').populate('categoria', 'nombre')
    ]);
    //Impresion registros
    res.status(201).json(listaProducto);
}

const getProductosMasVendidos = async (req = request, res = response) => {
    //Condiciones del get, devuelve los productos con disponibilidad true
    const query = { disponible: true };
    //Promesa para obtener los registros
    const listaProducto = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query).sort({ cantidadVendida: -1 }).populate('usuario', 'nombre').populate('categoria', 'nombre')
    ]);
    console.log(listaProducto);
    //Impresion registros
    res.status(201).json(listaProducto);
}

const postProducto = async (req = request, res = response) => {
    //Desestructuracion objeto
    const { usuario, ...body } = req.body;
    //Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }
    //Crea un nuevo producto
    const productoGuardado = await Producto(data);
    //Guardar en DB
    await productoGuardado.save();
    //Impresion producto registrado
    res.status(201).json(productoGuardado);
}

const putProducto = async (req = request, res = response) => {
    //Desestructuracion del parametro recibido a travez de la URL
    const { id } = req.params;
    //Desestructuracion de los campos a reemplazar
    const { usuario, ...restoData } = req.body;
    //Evalua el nombre ademas obtiene el id del usuario que realizo el producto
    if (restoData.nombre) {
        restoData.nombre = restoData.nombre.toUpperCase();
    }
    restoData.usuario = req.usuario._id;
    //Editar usando el id
    const productoActualizado = await Producto.findByIdAndUpdate(id, restoData, { new: true })
    //Impresion resultados
    res.status(201).json(productoActualizado);
}

const deleteProducto = async (req = request, res = response) => {
    //Desestructuracion del parametro recibido a travez de la URL
    const { id } = req.params;
    //Eliminacion del registro en la base de datos, con su id
    const productoEliminado = await Producto.findByIdAndDelete(id);
    //Impresion elemento eliminado
    res.status(201).json(productoEliminado);
}

module.exports = {
    getProductos, getProductoPorId, getProductosAgotados, getProductosMasVendidos, postProducto, putProducto, deleteProducto
}