//Importaciones
const {request, response} = require('express');
//Verificar si es usuario del rol enviado en el parametro
const tieneRole = (...roles) => {
    return (req = request, res = response, next) => {
        if (!req.usuario) {
            //Si no viene el token
            return res.status(500).json('Se quiere verificar el role sin validar el token primero');
        }
        if (!roles.includes(req.usuario.rol)) {
            //Verificar que el rol del usuario dado sea el proporcionado en el parametro
            return res.status(401).json(`El servicio requiere uno de estos roles ${roles}`);
        }
        next();//Si no hay error continua con la ejecucion
    }
}

module.exports = {
    tieneRole
}