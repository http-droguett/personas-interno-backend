"use strict";

const express = require('express');
const morgan = require('morgan');
const app = express();
const set1Router = require('./rutas/set1');
const process = require('process');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');

// Middlewares
const corsOptions ={
   origin:'*', 
   credentials:true,          
   optionSuccessStatus:200,
}
app.use(cors(corsOptions));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar cabeceras
app.use((req, res, next) => {
    // res.header('Access-Control-Allow-Origin', 'https://app.relojcontrol.com');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    next();
});
//Rutas
app.use('/', express.static('client', { redirect: false }));
app.use('/', set1Router);
app.use(function(req, res, next) {
    res.status(404);

    res.send('Ruta Inexistente');
});

//Levantar el Servidor

// const server = app.listen( 3000, () => {
//     const port = server.address().port;
//     console.log(`Conexion levantada con el puerto:${port}`);

// });

const levantarServidor = async () => {

    try {

        https.createServer({
            cert: fs.readFileSync('wildcard_ranco_cl.crt'),
            key: fs.readFileSync('wildcard_ranco_cl.key')
        }, await app)
        .listen(3000,function(){
        })

    } catch (error) {
        console.error(`Error en la conexion: ${error.message}`);
    }

}

levantarServidor();