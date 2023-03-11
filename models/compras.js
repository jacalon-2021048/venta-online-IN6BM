const { Schema, model } = require('mongoose');

const ComprasSchema = Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    productos: [{
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    }],
    cantidadCompra: [{
        type: Number,
        default: 1
    }],
    fecha: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: Boolean,
        default: true
    }
});

ComprasSchema.virtual('total').get(function () {
    let total = 0;
    for (let i = 0; i < this.productos.length; i++) {
        total += this.productos[i].precio * this.cantidadCompra[i];
    }
    return total;
});

module.exports = model('Compra', ComprasSchema);