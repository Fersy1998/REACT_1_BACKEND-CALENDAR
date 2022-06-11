/*
    Reutas de usuario /events
    
    host + /api/events

*/
const express=require('express');
const {validarJWT}=require('../middlewares/validar-jwt');
const {check}=require('express-validator');
const {fieldsValidator}=require('../middlewares/fields-validator');

const {getEventos, crearEvento, actualizarEvento, eliminarEvento} =require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const router=express.Router();


//Middleware en un nivel superior, ya que todas las peticiones lo van a usar
router.use(validarJWT)


//4000:/api/events
router.get('/', getEventos);

//4000:/api/events
router.post('/',  [//Middlewares
    check('title', 'title is required').not().isEmpty(),
    check('start', 'start date is required').custom(isDate),
    check('end', 'end date is required').custom(isDate),
    fieldsValidator
    ],
    crearEvento);

//4000:/api/events
router.put( '/:id', 
    [
    check('title','El titulo es obligatorio').not().isEmpty(),
    check('start','Fecha de inicio es obligatoria').custom( isDate ),
    check('end','Fecha de finalización es obligatoria').custom( isDate ),
    fieldsValidator
    ],
    actualizarEvento);

//4000:/api/events
router.delete('/:id', eliminarEvento);



module.exports = router;

