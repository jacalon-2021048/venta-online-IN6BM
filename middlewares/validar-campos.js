//Importaciones
const { response, request } = require('express');
const { validationResult } = require('express-validator');

const validarCampos = (req = request, res = response, next) => {
    //Evalua buscando algun error
    const errors = validationResult(req);
    //Varifica si existe error, si existe interrumpe el servidor
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }
    //Si no hay errores sigue con la ejecucion normal
    next();
}

module.exports = {
    validarCampos
}