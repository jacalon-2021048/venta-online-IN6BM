//Importanciones roles
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');
const Factura = require('../models/factura');
//Este archivo maneja validaciones personalizadas

//Verificacion si el correo ya existe en la BD
const emailExistente = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ correo })
    if (existeEmail) {
        throw new Error(`${correo} ya esta registrado en la BD, ingrese uno nuevo`);
    }
}

//Verificar si el ID de usuario existe
const existeUsuarioById = async (id) => {
    const existeId = await Usuario.findById(id);
    if (!existeId) {
        throw new Error(`El Usuario con el codigo: ${id}, no existe en la BD`);
    }
    return existeId
}

//Verificar si el ID de la factura existe
const existeFacturaById = async (id) => {
    const existeId = await Factura.findById(id);
    if (!existeId) {
        throw new Error(`La factura con el codigo: ${id}, no existe en la BD`);
    }
    return existeId;
}

//Verificar si la categoria ya existe
const existeCategoria = async (nombre = '') => {
    const regex = new RegExp(nombre, 'i');
    const categoriaDB = await Categoria.findOne({ nombre: regex });
    if (categoriaDB) {
        throw new Error(`${nombre} ya esta registrado en la BD, ingrese uno nuevo`);
    }
}

//Verificar si el ID de categoria existe
const existeCategoriaById = async (id) => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`La Categoria con el codigo: ${id}, no existe en la BD`);
    }
}

//Verificar si el producto ya existe
const existeProducto = async (nombre = '') => {
    const regex = new RegExp(nombre, 'i');
    const productoDB = await Producto.findOne({ nombre: regex });
    if (productoDB) {
        throw new Error(`${nombre} ya esta registrado en la BD, ingrese uno nuevo`);
    }
}

//Verificar si el ID existe
const existeProductoById = async (id) => {
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El Producto con el codigo: ${id}, no existe en la BD`);
    }
    return existeProducto;
}

//Si se elimina el categoria, cambia a Por defecto
const validarCategoria = async (id) => {
    const categoriaDefecto = await Categoria.findOne({ nombre: 'Por defecto' });
    const idCategoria = categoriaDefecto._id;
    const result = await Producto.updateMany(
        { categoria: id }, { categoria: idCategoria }
    );
    return result;
}

module.exports = {
    emailExistente,
    existeUsuarioById,
    existeFacturaById,
    existeCategoriaById,
    existeProducto,
    existeProductoById,
    validarCategoria,
    existeCategoria
}