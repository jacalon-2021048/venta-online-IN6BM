const {Schema, model} = require('mongoose');

const FacturaSchema = Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    productos: [{
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true,
    }],
    total: {
        type: Number,
        default: 0
    }
});

module.exports = model('Factura',FacturaSchema);