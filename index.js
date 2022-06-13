const express=require('express');
const { dbConnection } = require('./database/config');
const cors=require('cors');
require('dotenv').config();
//crear el servidor de express
const app=express();

//Base de datos
dbConnection()

//CORS
app.use(cors());


//Lectura y parseo del body 
//!!!!!ESTA LÍNEA VA SIEMPRE ANTES DE LAS RUTAAAAS
app.use(express.json());
//Rutas
app.use('/api/auth', require('./routes/auth'));

app.use('/api/events', require('./routes/events'));


//Directorio público

app.use(express.static('public'));



//escuchar las peticiones
app.listen(process.env.PORT, ()=>{
    console.log(`Corriendo en el puerto ${ process.env.PORT }`);
})