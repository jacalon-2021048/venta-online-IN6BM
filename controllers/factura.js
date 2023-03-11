//Desestructuracion de los objetos
const { response, request } = require('express');
//Importacion de los modelos
const Factura = require('../models/factura');
const Producto = require('../models/producto');
//Validaciones usuarios
const { existeUsuarioById } = require('../helpers/db-validators');

const getFacturas = async (req = request, res = response) => {
    //Condiciones del get devuelve todas las facturas que sean igual al id del usuario
    const { id } = req.params;
    const query = { usuario: id };
    //Promesa para obtener los registros
    const listaFacturas = await Promise.all([
        Factura.countDocuments(query),
        Factura.find(query).select('-__v')
    ]);
    //Impresion de registros
    res.status(201).json(listaFacturas);
};

const getProductos = async (req = request, res = response) => {
    //Condiciones del get devuelve todos los productos de una factura
    const { id } = req.params;
    const query = { _id: id };
    //Promesa para obtener los registros
    const listaFacturas = await Promise.all([
        Factura.countDocuments(query),
        Factura.find(query).select('productos').populate('productos', 'nombre precio')
    ]);
    //Impresion de registros
    res.status(201).json(listaFacturas);
};

const putFactura = async (req = request, res = response) => {
    //Desestructuracion del parametro recibido a travez de la URL
    const { id } = req.params;
    const { fecha, nitEmpresa, usuario, ...resto } = req.body;
    const factura = await Factura.findById(id);
    let stockSuficiente = true;
    for (let i = 0; i < resto.productos.length; i++) {
        const producto = await Producto.findById(resto.productos[i]);
        if (producto.existencias < resto.cantidadCompra[i]) {
            stockSuficiente = false;
            break;
        }
    }
    if (stockSuficiente) {
        for (let i = 0; i < resto.cantidadCompra.length; i++) {
            const producto = await Producto.findById(resto.productos[i]);
            switch (resto.cantidadCompra[i] > factura.cantidadCompra[i]) {
                case true:
                    let restante = resto.cantidadCompra[i] - factura.cantidadCompra[i];
                    await Producto.updateMany({ _id: producto._id }
                        , { existencias: producto.existencias - restante });
                    break;
                case false:
                    let sumando = factura.cantidadCompra[i] - resto.cantidadCompra[i];
                    await Producto.updateMany({ _id: producto._id }
                        , { existencias: producto.existencias + sumando });
                    break;
            }
        }
        factura.productos = resto.productos;
        factura.cantidadCompra = resto.cantidadCompra;
        await factura.save();
        res.status(200).send(factura);
    } else {
        res.status(400).send('No hay suficiente stock para los productos seleccionados');
    }
};

module.exports = {
    getFacturas, getProductos, putFactura
};