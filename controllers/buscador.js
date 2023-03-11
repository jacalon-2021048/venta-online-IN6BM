const { request, response } = require('express');
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');

const coleccionesPermitidas = [
    'categorias',
    'productos'
];

const buscarCategorias = async (termino = '', res = response) => {
    try {
        const regex = new RegExp(termino, 'i');
        const categorias = await Categoria.find({
            $or: [{ nombre: regex }],
            $and: [{ estado: true }]
        });
        res.json({
            results: categorias
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se puede buscar el elemento dado'
        });
    }
}

const buscarProductos = async (termino = '', res = response) => {
    try {
        const regex = new RegExp(termino, 'i');
        const productos = await Producto.find({
            $or: [{ nombre: regex }],
            $and: [{ disponible: true }]
        }).populate('usuario','nombre').populate('categoria','nombre');
        res.json({
            results: productos
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se puede buscar el elemento dado'
        });
    }
}

const buscar = (req = request, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `La colección: ${coleccion} no existe en la DB, las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'No existe esta busqueda'
            });
            break;
    }
}

module.exports = {
    buscar
}