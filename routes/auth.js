/*
    Reutas de usuario /auth
    
    host + /api/auth

*/

const express=require('express');
const router=express.Router();
const {check}=require('express-validator');
const {fieldsValidator}=require('../middlewares/fields-validator');
const {validarJWT}=require('../middlewares/validar-jwt');
//alternativa
//const {Router}=require('express');
//const router=Router;

/* Importaciones de funciones para cada ruta*/
const {createUser, loginUser, revalidarToken} =require('../controllers/auth')


//4000:/api/auth/new
router.post(
    '/new',
    [//Middlewares
    check('name', 'name is required').not().isEmpty(),
    check('email', 'invalid email').isEmail(),
    check('password', 'invalid password, should be at least 6 characters').isLength({min:6}),
    fieldsValidator
    ],
    createUser);
//4000:/api/auth/
router.post(
    '/',
    [
    check('email', 'invalid email').isEmail(),
    check('password', 'invalid password, should be at least 6 characters').isLength({min:6}),
    fieldsValidator
    ],
    loginUser )
//4000:/api/auth/renew               //midlewarre=validarJWT
router.get('/renew',validarJWT, revalidarToken)
module.exports=router;