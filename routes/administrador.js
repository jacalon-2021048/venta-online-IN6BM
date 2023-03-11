/*
    Admin Routes
    host + /api/usuarios/admin
*/
//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
//Controllers
const { getAdministradores, postAdministrador, putAdministrador, deleteAdministrador } = require('../controllers/administrador');
//Middlewares
const { emailExistente, existeUsuarioById } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');
//Creacion objeto tipo Router()
const router = Router();

//Manejo de rutas
//Obtener todos los usuarios con rol ADMIN  - metodo privado
router.get('/mostrar', [
    validarJWT,
    tieneRole('ADMIN'),
    validarCampos
], getAdministradores);

//Crear un usuario sin emportar el rol - metodo privado
router.post('/agregar', [
    check('nombre', 'El nombre del usuario es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser de mas de 6 digitos').isLength({min: 6}),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExistente),
    check('rol', 'No es un rol válido').toUpperCase().isIn(['','ADMIN', 'CLIENTE']),
    validarCampos
], postAdministrador);

//Actualizar un usuario (el ADMIN se puede modificar a si mismo y a usuarios
//de tipo CLIENT, no puede modificar a otro ADMIN) - metodo privado
router.put('/modificar/:id', [
    validarJWT,
    tieneRole('ADMIN'),
    check('nombre', 'El nombre del usuario es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser de mas de 6 digitos').isLength({min: 6}),
    check('correo', 'El correo no es válido').isEmail(),
    check('rol', 'No es un rol válido').toUpperCase().isIn(['','ADMIN', 'CLIENTE']),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    validarCampos
], putAdministrador);

//Eliminar un usuario (el ADMIN se puede eliminarse a si mismo y a usuarios
//de tipo CLIENT, no puede eliminar a otro ADMIN) - metodo privado
router.delete('/eliminar/:id', [
    validarJWT,
    tieneRole('ADMIN'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    validarCampos
], deleteAdministrador);

module.exports = router;