//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getClientes, postCliente, putCliente, deleteCliente } = require('../controllers/cliente');
const { emailExistente, existeUsuarioById } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', [
    validarJWT,
    tieneRole('ADMIN'),
    validarCampos
], getClientes);
router.post('/agregar', [
    check('nombre', 'El nombre del usuario es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser de mas de 6 digitos').isLength({min: 6}),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExistente),
    validarCampos
], postCliente);
router.put('/modificar/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    tieneRole('CLIENT','ADMIN'),
    validarCampos
], putCliente);
router.delete('/eliminar/:id', [
    validarJWT,
    tieneRole('CLIENT','ADMIN'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    validarCampos
], deleteCliente);

module.exports = router;