const {Schema, model} = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true,"El nombre de producto es obligatorio"],
        unique: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    cantidadVendida: {
        type: Number,
        default: 0
    },
    existencias: {
        type: Number,
        default: 0
    },
    precio: {
        type: Number,
        default: 0,
    },
    disponible: {
        type: Boolean,
        default: true
    }
});

module.exports = model('Producto', ProductoSchema);