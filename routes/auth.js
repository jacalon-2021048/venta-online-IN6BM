//Libreria para las rutas
const { Router } = require('express');
//Libreria para las validaciones
const { check } = require('express-validator');
//Controllers
const { login } = require('../controllers/auth');
//Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
//Creacion objeto tipo Router()
const router = Router();

//Manejo de rutas
router.post('/login', [
    check('correo','El correo es obligatorio').not().isEmpty(),
    check('correo','El correo no es valido').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
], login);

module.exports = router;