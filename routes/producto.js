//Importanciones
const { Router } = require('express');
const { check } = require('express-validator');
//Controllers
const { getProductos, getProductoPorId, getProductosAgotados, getProductosMasVendidos, postProducto, putProducto, deleteProducto } = require('../controllers/producto');
const { existeProducto, existeCategoriaById, existeProductoById } = require('../helpers/db-validators');
//Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');
//Creacion objeto tipo Router()
const router = Router();

//Manejo de rutas
//Obtener todos los productos - metodo privado - cualquier persona de user ADMIN
router.get('/', [
    validarJWT,
    tieneRole('ADMIN'),
    validarCampos
], getProductos);

//Obtener un producto - metodo privado - cualquier persona de user ADMIN
router.get('/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductoById),
    tieneRole('ADMIN'),
    validarCampos
], getProductoPorId);

//Obtener los productos que esten agotados - metodo privado - cualquier persona de user ADMIN
router.get('/lista/agotados', [
    validarJWT,
    tieneRole('ADMIN'),
    validarCampos
], getProductosAgotados);

//Obtener los productos mas vendidos - metodo privado - cualquier persona de user ADMIN
router.get('/mas/vendidos', [
    validarJWT,
    tieneRole('ADMIN'),
    validarCampos
], getProductosMasVendidos);
//Obtener el stock ¿lo mismo que un get? - metodo privado - cualquier persona de user ADMIN

//Crear un producto - metodo privado - cualquier persona de user ADMIN
router.post('/agregar', [
    validarJWT,
    tieneRole('ADMIN'),
    check('nombre', 'Agregue un nombre al producto').not().isEmpty(),
    check('nombre').custom(existeProducto),
    check('categoria').custom(existeCategoriaById),
    validarCampos
], postProducto);

//Actualizar un producto - metodo privado - cualquier persona de user ADMIN
router.put('/editar/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('nombre', 'Agregue un nombre al producto').not().isEmpty(),
    check('id').custom(existeProductoById),
    tieneRole('ADMIN'),
    validarCampos
], putProducto);

//Borrar un producto - metodo privado - cualquier persona de user ADMIN
router.delete('/eliminar/:id', [
    validarJWT,
    tieneRole('ADMIN'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductoById),
    validarCampos
], deleteProducto)

module.exports = router;