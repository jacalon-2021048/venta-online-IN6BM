//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getAdministradores, postAdministrador, putAdministrador, deleteAdministrador } = require('../controllers/administrador');
const { emailExistente, existeUsuarioById } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', getAdministradores);
router.post('/agregar', [
    check('nombre', 'El nombre del usuario es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser de mas de 6 digitos').isLength({min: 6}),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExistente),
    validarCampos
], postAdministrador);
router.put('/modificar/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    tieneRole('ADMIN'),
    validarCampos
], putAdministrador);
router.delete('/eliminar/:id', [
    validarJWT,
    tieneRole('ADMIN'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    validarCampos
], deleteAdministrador);

module.exports = router;