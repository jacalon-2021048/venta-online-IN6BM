//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
//Controllers
const { getCategoria, postCategoria, putCategoria, deleteCategoria } = require('../controllers/categoria');
//Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');
//Creacion objeto tipo Router()
const router = Router();

//Manejo de rutas
//Obtener todos las categorias - metodo privado - cualquier persona de user ADMIN
router.get('/mostrar', [
    validarJWT,
    tieneRole('ADMIN'),
    validarCampos
], getCategoria);

//Crear un categoria - metodo privado - cualquier persona de user ADMIN
router.post('/agregar', [
    validarJWT,
    tieneRole('ADMIN'),
    check('nombre', 'Agregue un nombre a la categoria').not().isEmpty(),
    validarCampos
], postCategoria);

//Actualizar un categoria - metodo privado - cualquier persona de user ADMIN
router.put('/modificar/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('nombre', 'Agregue un nombre al producto').not().isEmpty(),
    tieneRole('ADMIN'),
    validarCampos
], putCategoria);

//Borrar un categoria - metodo privado - cualquier persona de user ADMIN
router.delete('/eliminar/:id', [
    validarJWT,
    tieneRole('ADMIN'),
    check('id', 'No es un ID valido').isMongoId(),
    validarCampos
], deleteCategoria);

module.exports = router;