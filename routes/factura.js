/*
    Factura Routes
    host + /api/facturas
*/
//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
//Controllers
const { getFacturas, getProductos, putFactura } = require('../controllers/factura');
//Middlewares
const { emailExistente, existeUsuarioById, existeFacturaById } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');
//Creacion objeto tipo Router()
const router = Router();

//Manejo de rutas
//Todas las peticiones usan el token y requieren de un rol ADMIN
router.use(validarJWT);
router.use(tieneRole('ADMIN'));

//Visualizar facturas por usuario - metodo privado
router.get('/usuario/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    validarCampos
], getFacturas);

//Visualizar productos de una factura - metodo privado
router.get('/productos/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeFacturaById),
    validarCampos
], getProductos);

//Editar factura - metodo privado
router.put('/:id', [
    check('productos', 'Ingrese valores al arreglo de productos').not().isEmpty(),
    check('cantidadCompra', 'Ingrese valores al arreglo de cantidad compras').not().isEmpty(),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeFacturaById),
    validarCampos
], putFactura);

module.exports = router;