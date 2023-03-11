/*
    Auth Routes
    host + /api/auth
*/
//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
//Controllers
const { login } = require('../controllers/auth');
//Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
//Creacion objeto tipo Router()
const router = Router();

//Manejo de rutas
//Login para inicio de sesion para acceder a las funcionalidades
router.post('/login', [
    check('correo','El correo es obligatorio').not().isEmpty(),
    check('correo','El correo no es valido').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
], login);

module.exports = router;