/*
    Admin Routes
    host + /api/buscar
*/
//Importaciones
const { Router } = require('express');
//Controllers
const { buscar } = require('../controllers/buscador');
//Middlewares
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');
//Creacion objeto tipo Router()
const router = Router();

//Manejo de rutas
//Todas las peticiones usan el token y requieren de un rol CLIENTE
router.use(validarJWT);
router.use(tieneRole('CLIENTE'));

//Buscador, recibe la coleccion en la que se 
//buscara y el termino a buscar
router.get('/:coleccion/:termino', buscar);

module.exports = router;