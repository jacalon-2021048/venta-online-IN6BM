/*
    Cliente Routes
    host + /api/client
*/
//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
//Controllers
const { getClientes, postCliente, putCliente, deleteCliente } = require('../controllers/cliente');
//Middlewares
const { emailExistente, existeUsuarioById } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');
//Creacion objeto tipo Router()
const router = Router();

//Manejo de rutas
//Obtener todos los usuarios con rol CLIENT  - metodo privado - Disponible para usuarios de rol ADMIN
router.get('/mostrar', [
    validarJWT,
    tieneRole('ADMIN'),
    validarCampos
], getClientes);

//Crear un usuario agregando el rol CLIENT - metodo publico
router.post('/registrarse', [
    check('nombre', 'El nombre del usuario es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser de mas de 6 digitos').isLength({min: 6}),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExistente),
    validarCampos
], postCliente);

//Actualizar un usuario (el CLIENT se puede modificar a si mismo) - metodo privado
router.put('/modificar/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    check('correo').custom(emailExistente),
    tieneRole('CLIENTE'),
    validarCampos
], putCliente);

//Eliminar un usuario (el CLIENT se puede eliminar a si mismo) - metodo privado
router.delete('/eliminar/:id', [
    validarJWT,
    tieneRole('CLIENTE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    validarCampos
], deleteCliente);

module.exports = router;