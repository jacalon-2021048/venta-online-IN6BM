/*
    Compras Routes
    host + /api/productos-carrito
*/
//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
//Controllers
const { getCompras, postCompra, putCompra, deleteCompra, getHistorialCompras, getCarrito } = require('../controllers/compras');
const { existeProductoById } = require('../helpers/db-validators');
//Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');
//Creacion objeto tipo Router()
const router = Router();

//Manejo de rutas
//Mostrar el listado de productos en el carrito actualmente - metodo privado - cualquier persona de user CLIENT
router.get('/', [
    validarJWT,
    tieneRole('CLIENTE'),
    validarCampos
], getCarrito);

//Compra los productos en el carrito actualmente - metodo privado - cualquier persona de user CLIENT
router.get('/comprar', [
    validarJWT,
    tieneRole('CLIENTE'),
    validarCampos
], getCompras);

//Mostrar el historial de compras - metodo privado - cualquier persona de user CLIENT
router.get('/historial/compras', [
    validarJWT,
    tieneRole('CLIENTE'),
    validarCampos
], getHistorialCompras);

//Agregar un producto al carrito - metodo privado - cualquier persona de user CLIENT
router.post('/agregar/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductoById),
    tieneRole('CLIENTE'),
    validarCampos
], postCompra);

//Edita el producto agregado - metodo privado - cualquier persona de user CLIENT
router.put('/editar/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('cantidadCompra', 'Agregue una cantidad de compra').not().isEmpty(),
    check('id').custom(existeProductoById),
    tieneRole('CLIENTE'),
    validarCampos
], putCompra);

//Borrar un producto agregado - metodo privado - cualquier persona de user CLIENT
router.delete('/eliminar/:id', [
    validarJWT,
    tieneRole('CLIENTE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductoById),
    validarCampos
], deleteCompra);

module.exports = router;