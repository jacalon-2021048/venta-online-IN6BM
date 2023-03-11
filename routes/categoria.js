/*
    Categoria Routes
    host + /api/categorias
*/
//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
//Controllers
const { getCategoria, postCategoria, putCategoria, deleteCategoria } = require('../controllers/categoria');
//Middlewares
const { existeCategoria } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');
//Creacion objeto tipo Router()
const router = Router();

//Manejo de rutas
//Todas las peticiones usan el token y requieren de un rol ADMIN
router.use(validarJWT);
router.use(tieneRole('ADMIN'));

//Obtener todos las categorias - metodo privado
router.get('/', getCategoria);

//Crear un categoria - metodo privado
router.post('/agregar', [
    check('nombre', 'Agregue un nombre a la categoria').not().isEmpty(),
    check('nombre').custom(existeCategoria),
    validarCampos
], postCategoria);

//Actualizar un categoria - metodo privado
router.put('/modificar/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('nombre', 'Agregue un nombre a la categoria').not().isEmpty(),
    validarCampos
], putCategoria);

//Borrar un categoria - metodo privado
router.delete('/eliminar/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    validarCampos
], deleteCategoria);

module.exports = router;