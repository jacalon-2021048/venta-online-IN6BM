//Desestructuracion de los objetos
const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de categoria es obligatorio']
    },
    tipoCategoria: {
        type: String,
        default: "Por defecto"
    },
    descripcionCategoria: {
        type: String,
        default: ""
    },
    estado: {
        type: Boolean,
        default: true
    }
});

module.exports = model('Categoria', CategoriaSchema);