const {Schema, model} = require('mongoose');

const FacturaSchema = Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    nitEmpresa:{
        type: String,
        required: true
    },
    productos: [{
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true,
    }],
    cantidadCompra: [{
        type: Number,
        default: 1
    }],
    fecha: {
        type: Date,
        default: Date.now
    },
    total: {
        type: Number,
        default: 0
    }
});

module.exports = model('Factura',FacturaSchema);