"use strict";
const express = require('express');
const router = express.Router();
const { poolPromise } = require('../config/db');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const multer = require('multer')
const nodemailer = require("nodemailer");
const path = require('path');

let rand = '';
let mailOptions = '';
let host = '';
let link = '';
let link2 = '';
let fs = require('fs');

const smtpTransport = nodemailer.createTransport({
    host: 'smtp.office365.com', 
    port: 587,     
    secure: false, 
    auth: {
        user: 'app@ranco.cl',
        pass: 'Ranco2020@PP'
    },
    tls: {
        ciphers: 'SSLv3'
    }
});

router.post('/send', ensureToken,function(req,res){
    const {fecha_postulacion,rut,nombres,apellidos,fecha_nacimiento,genero,nacionalidad,direccion,comuna,estado_civil,email,telefono,telefono_emergencia,tipo_trabajador,disponibilidad,tipo_inscripcion,labor,otras_experiencias,situacion_migratoria,nivel_educacional,talla_ropa,numero_calzado} = req.body;
    const user = { id: 3 };
    const token = jwt.sign({ user }, 'Api_Ranco_Key_01_04_2019', {expiresIn: '168h'})
    host=req.get('host');
    link="http://postulaciones.ranco.cl:3000/verify?token="+token+"&rut="+rut+"&fecha="+fecha_postulacion+"&email="+email;
    link2="http://postulaciones.ranco.cl:3000/remove_postulante?token="+token+"&rut="+rut+"&fecha="+fecha_postulacion+"&email="+email;
    mailOptions={
        from: 'Postulaciones Ranco || app@ranco.cl',
        to : email,
        subject : "Confirmación de postulación a Ranco",
        html :
        `
        <p>Hola ${nombres} ${apellidos}, hemos recibido con éxito su registro de postulación a Ranco, con la siguente información:</p>
        <br />
        
        <style>
        .header_table{
        background: #D0E4F5;
        }
        table.blueTable {
          font-family: verdana;
          width: 30%;
          text-align: center;
        }
        table.blueTable td, table.blueTable th {
          border: 1px solid #AAAAAA;
          padding: 3px 3px;
        }
        table.blueTable tbody td {
          font-size: 13px;
        }
        table.blueTable tr:nth-child(even) {
          background: #D0E4F5;
        }
        table.blueTable thead {
          background: white;
          background: -moz-linear-gradient(top, #ffffff 0%, #ffffff 66%, #ffffff 100%);
          background: -webkit-linear-gradient(top, #ffffff 0%, #ffffff 66%, #ffffff 100%);
          background: linear-gradient(to bottom, #ffffff 0%, #ffffff 66%, #ffffff 100%);
          border-bottom: 2px solid #444444;
        }
        table.blueTable thead th {
          font-size: 17px;
          font-weight: bold;
          color: #FFFFFF;
          border-left: 2px solid #D0E4F5;
        }
        table.blueTable thead th:first-child {
          border-left: none;
        }
        
        table.blueTable tfoot td {
          font-size: 15px;
        }
        table.blueTable tfoot .links {
          text-align: right;
        }
        table.blueTable tfoot .links a{
          display: inline-block;
          background: white;
          color: #FFFFFF;
          padding: 2px 8px;
          border-radius: 5px;
        }
        </style>
  
        <table class="blueTable">
           <thead>
             <tr>
               <td  colspan="5">Postulación Ranco</td>
             </tr>
            </thead>   
            <tbody>
                    <td>Rut</td>
                    <td>Nombres</td>
                    <td>Apellidos</td>
                    <td>Fecha de Nacimiento</td>
        
                </tr>
                <tr>
                    <td>${rut}</td>
                    <td>${nombres}</td>
                    <td>${apellidos}</td>
                    <td>${fecha_nacimiento}</td>
        
                </tr>
                <tr>
                    <td>Género</td>
                    <td>Nacionalidad</td>
                    <td>Dirección</td>
                    <td>Comuna</td>
        
        
                </tr>
                <tr>
                    <td>${genero}</td>
                    <td>${nacionalidad}</td>
                    <td>${direccion}</td>
                    <td>${comuna}</td>
        
                </tr>
                <tr>
                    <td>Estado Civil</td>
                    <td>Email</td>
                    <td>Telefono</td>
                    <td>Tipo Trabajador/ar</td>
                </tr>
                <tr>
                    <td>${estado_civil}</td>
                    <td>${email}</td>
                    <td>${telefono}</td>
                    <td>${tipo_trabajador}</td>
        
                </tr>
                <tr>
                    <td>Disponibilidad de Turno(s)</td>
                    <td>Tipo Inscripción</td>
                    <td>Labor Desempeñada</td>
                    <td>Otras Experiencias</td>
                </tr>
                <tr>
                    <td>${disponibilidad}</td>
                    <td>${tipo_inscripcion}</td>
                    <td>${labor}</td>
                    <td>${otras_experiencias}</td>
                </tr>
                <tr>
                    <td>Situación Migratoria(s)</td>
                    <td>Teléfono de emergencia</td>
                    <td>Nivel Educacional</td>
                    <td>Talla Ropa</td>
                </tr>
                <tr>
                    <td>${situacion_migratoria}</td>
                    <td>${telefono_emergencia}</td>
                    <td>${nivel_educacional}</td>
                    <td>${talla_ropa}</td>
                </tr>
                <tr>
                    <td>Número Calzado(s)</td>
                </tr>
                <tr>
                    <td>${numero_calzado}</td>
                </tr>
                <tr>
                    <td colspan="4">
                    Si tienes dudas o consultas, lo puedes hacer a los siguientes datos de contacto<p>
                    Correo : admreclutamiento@ranco.cl<p>
                    WhatsApp : + 56 9 8293 1129 ó + 56 9 4467 1575
                    </td>
                </tr>
            <!--
            <tr>
                <td colspan="2">Confirmar</td>
                <td colspan="2">Anular</td>
            </tr>
            <tr>
                <td colspan="2"> <a href="${link}"> ¡ Pincha Aqui ! para Verificar la postulación.</a> </td>
                <td colspan="2"> <a href="${link2}">¡ Pincha Aqui ! para Anular la postulación. </a> </td>
            </tr>
            -->
        </tbody>
    </table>
     
        `
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
            console.log(error);
        res.end("error");
     }else{
            console.log("Message sent: " + response.message);
        res.end("sent");
         }
});
});
async function send_Cv(rut,nombre,filepath){
    mailOptions={
        from: 'Postulaciones Ranco || app@ranco.cl',
        to : 'admreclutamiento@ranco.cl',
        subject : "Confirme su postulación a Ranco - " + `${nombre}`,
        html : `Hola Administrativa de Packing,<br>Un nuevo Postulante ha enviado su Curriculum.`,
        attachments: [
            {filename: nombre, path: `${filepath}\\${nombre}`}
        ]
    }
    // console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
            console.log(error);
     }else{
            console.log("Message sent: " + response.message);
         }
});
};

async function update_email(rut,fecha) {

 const query = `UPDATE POSTULANTE  SET email_validado  = 1 WHERE RUT = '${rut}' and fecha_postulacion = '${fecha}' and temporada = 'R6' `;
 const pool = await poolPromise;
 const result = await pool.request()
    .query(query);
}
async function segunda_confirmacion(email) {
    mailOptions={
        from: 'Postulaciones Ranco || app@ranco.cl',
        to : email,
        subject : "Confirmación Postulación Ranco",
        html : `<strong>Hola</strong>, <br />
        <strong>Su postulación a Ranco está confirmada, le llamaremos….</strong>`,
    }
    console.log('paso por la segunda confirmacion', email)
    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
            console.log(error);
     }else{
            console.log("Message sent: " + response.message);
         }
});
}

router.get('/verify', async function(req,res){
    const {rut,token,fecha,email} = req.query;
        console.log("Domain is matched. Information is from Authentic email");
        jwt.verify(token, 'Api_Ranco_Key_01_04_2019', (err, verifiedJwt) => {
            if(err){
                console.error(err.message)
                if(err.message === 'jwt expired'){
                  res.end("<h1>Token expirado, No pudo ser verificado el email, favor de postular nuevamente <a href='http://postulaciones.ranco.cl'>Pinchar Aqui.</a> </h1>");
              }
            res.end("<h1>Algo salio mal, favor de postular nuevamente. <a href='http://postulaciones.ranco.cl'>Pinchar Aqui.</a> </h1>");
            }
            else{
              console.log(verifiedJwt,'validado')
              res.end("<h1>Email "+email+" Fue verificado satisfactoriamente !!!");
              update_email(rut,fecha);
              segunda_confirmacion(email);
            }
          });
    });

router.post('/uploadCV',function(req, res) {
    const {rut,email} = req.query;
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, 'C:\\Users\\desarrollo\\Exportadora Rancagua S.A\\Planta - Producción - Cv_Postulantes')

      },
      filename: function (req, file, cb) {
        cb(null,'Curriculum_' + rut  + path.extname(file.originalname))
        const nombre = 'Curriculum_' + rut  + path.extname(file.originalname)
        const path2 = 'C:\\Users\\desarrollo\\Exportadora Rancagua S.A\\Planta - Producción - Cv_Postulantes';
    setTimeout(
        () => { 
            send_Cv(rut,nombre,path2);

    }, 5000);
      }
  })

  const upload = multer({ storage: storage }).single('file')
     
upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
        return res.status(500).json(err)
    } else if (err) {
        return res.status(500).json(err)
    }
      return res.status(200).send(req.file)

    })

});

router.get(`/postulantes_validados`, ensureToken, async(req, res) => {

            try {
                const query = `SELECT * FROM POSTULANTE_validado`;
                const pool = await poolPromise;
                const result = await pool.request()
                    .query(query);
                res.json(result.recordset);
                console.log(result.recordset)
            } catch (err) {
                res.status(500);
                res.send(err.message);
                console.log(err.message);
            }
});
router.get(`/postulantes_contratados`, ensureToken, async(req, res) => {

            try {
                const query = `SELECT * FROM postulante_contratado_vista   ORDER BY estado desc`;
                const pool = await poolPromise;
                const result = await pool.request()
                    .query(query);
                res.json(result.recordset);
            } catch (err) {
                res.status(500);
                res.send(err.message);
                console.log(err.message);
            }
});

router.get(`/postulante`, ensureToken, async(req, res) => {

    const {rut} = req.query

    try {
        const query = `SELECT * FROM POSTULANTE WHERE rut = '${rut}' AND temporada = 'R6'`;
        console.log(query)
        const pool = await poolPromise;
        const result = await pool.request()
            .query(query);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
        console.log(err.message);
    }
});

router.get(`/postulante_rut`, ensureToken, async(req, res) => {

    const {rut} = req.query

    try {
        const query = `SELECT rut FROM POSTULANTE WHERE rut = '${rut}' and email_validado = '1' and temporada = 'R6'`;
        console.log(query)
        const pool = await poolPromise;
        const result = await pool.request()
            .query(query);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
        console.log(err.message);
    }
});


router.post(`/postulante`, ensureToken, async(req, res) => {
    
    const {fecha_postulacion,rut,nombres,apellidos,fecha_nacimiento,genero,nacionalidad,direccion,comuna,estado_civil,email,telefono,telefono_emergencia,tipo_trabajador,disponibilidad,tipo_inscripcion,labor,otras_experiencias,email_validado,ruta,temporada,situacion_migratoria,nivel_educacional, talla_ropa, numero_calzado} = req.body;
        try {
            const query = `INSERT INTO POSTULANTE (fecha_postulacion,rut,nombres,apellidos,fecha_nacimiento,genero,nacionalidad,direccion,comuna,estado_civil,email,telefono,telefono_emergencia,tipo_trabajador,disponibilidad,tipo_inscripcion,labor,otras_experiencias,email_validado,ruta_archivo_cv,temporada,situacion_migratoria,nivel_educacional,talla_ropa,numero_calzado) values( '${fecha_postulacion}','${rut}','${nombres}','${apellidos}','${fecha_nacimiento}','${genero}','${nacionalidad}','${direccion}','${comuna}','${estado_civil}','${email}','${telefono}','${telefono_emergencia}','${tipo_trabajador}','${disponibilidad}','${tipo_inscripcion}','${labor}','${otras_experiencias}',${email_validado},'${ruta}','${temporada}','${situacion_migratoria}','${nivel_educacional}','${talla_ropa}','${numero_calzado}') `;
            console.log(query, 'esto');
            const pool = await poolPromise;
            const result = await pool.request()
                .query(query);
            res.json(result.recordset);
        } catch (err) {
            res.status(500);
            res.send(err.message);
            console.log(err.message)
        }

});
router.post(`/postulante_packing`, ensureToken, async(req, res) => {
    
    const {fecha_postulacion,labor_actual,cuartel,rut,nombres,apellidos,edad,fecha_nacimiento,genero,nacionalidad,direccion,comuna,estado_civil,email,telefono,tipo_trabajador,disponibilidad,tipo_inscripcion,labor,labor_sdt,otras_experiencias,ruta_archivo_cv,ultima_llamada,citacion_trabajar,asiste_trabajar,cuartel_actual,disponible,turno} = req.body;
        try {
            const query = `INSERT INTO postulante_contratado (fecha_postulacion,rut,nombres,apellidos,edad,fecha_nacimiento,genero,nacionalidad,direccion,comuna,estado_civil,email,telefono,tipo_trabajador,disponibilidad,tipo_inscripcion,labor,labor_sdt,otras_experiencias,ruta_archivo_cv,ultima_llamada,citacion_trabajar,asiste_trabajar,labor_actual,cuartel,cuartel_actual,disponible,estado,enrolado,numero_cuenta,afp,salud,banco,tipo_cuenta,nivel_educacional,turno) values( '${fecha_postulacion}','${rut}','${nombres}','${apellidos}',${edad},'${fecha_nacimiento}','${genero}','${nacionalidad}','${direccion}','${comuna}','${estado_civil}','${email}','${telefono}','${tipo_trabajador}','${disponibilidad}','${tipo_inscripcion}','${labor}','${labor_sdt}','${otras_experiencias}','${ruta_archivo_cv}','${ultima_llamada}','${citacion_trabajar}','${asiste_trabajar}','${labor_actual}','${cuartel}','${cuartel_actual}','${disponible}','Confirmado','No',null,null,null,null,null,null,'${turno}') `;
            console.log(query, 'esto');
            const pool = await poolPromise;
            const result = await pool.request()
                .query(query);
            res.json(result.recordset);
        } catch (err) {
            res.status(500);
            res.send(err.message);
            console.log(err.message)
        }

});
router.get(`/remove_postulante`, async(req, res) => {
    
    const {rut,token,fecha,email} = req.query;

    jwt.verify(token, 'Api_Ranco_Key_01_04_2019', async (err, verifiedJwt) => {
        if(err){
          console.error(err.message)
          if(err.message === 'jwt expired'){
            res.end("<h1>Token expirado, No pudo ser verificado el email, favor de postular nuevamente <a href='http://postulaciones.ranco.cl'>Pinchar Aqui.</a> </h1>");
        }
        res.end("<h1>Algo salio mal, favor de postular nuevamente. <a href='http://postulaciones.ranco.cl'>Pinchar Aqui.</a> </h1>");
        }else{
          console.log(verifiedJwt,'validado')
          try {
            const query = `DELETE POSTULANTE WHERE rut = '${rut}' and fecha_postulacion = '${fecha}'`;
            console.log(query, 'esto');
            const pool = await poolPromise;
            const result = await pool.request()
                .query(query);
            res.end("<h1>La postulacion del email "+email+" fue Anulada !!!");
        } catch (err) {
            res.status(500);
            res.send(err.message);
        }
        }
      });
 
});

router.get(`/postulante_update`, ensureToken, async(req, res) => {

            try {
                const query = `UPDATE POSTULANTE SET fecha_ingreso = '${req.body.fecha_ingreso}',rut = ${req.body.rut},nombres = ${req.body.nombres},apellidos = ${req.body.apellidos},email = ${req.body.email},telefono = ${req.body.telefono},fecha_nacimiento = '${req.body.fecha_nacimiento}',nacionalidad = ${req.body.nacionalidad}  WHERE id =  '${req.params.id}'  `;
                console.log(query,'update')
                const pool = await poolPromise;
                const result = await pool.request()
                    .query(query);
                res.json(result.recordset);
            } catch (err) {
                res.status(500);
                res.send(err.message);
                console.log(err.message);
            }
});
router.put(`/postulante_packing_id`, ensureToken, async(req, res) => {
    const {id} = req.body;
            try {
                const query = `UPDATE postulante SET email_validado = 0 WHERE id = '${id}' `;
                console.log(query,'esta es la query eliminar')
                const pool = await poolPromise;
                const result = await pool.request()
                    .query(query);
                res.json(result.recordset);
            } catch (err) {
                res.status(500);
                res.send(err.message);
                console.log(err.message);
            }
});
router.put(`/postulante_remuneraciones_enrolar`, ensureToken, async(req, res) => {
    const {id} = req.body;
            try {
                const query = `UPDATE postulante_contratado SET enrolado = 'Si' WHERE id = '${id}' `;
                console.log(query,'esta es la query eliminar')
                const pool = await poolPromise;
                const result = await pool.request()
                    .query(query);
                res.json(result.recordset);
            } catch (err) {
                res.status(500);
                res.send(err.message);
                console.log(err.message);
            }
});
router.put(`/postulante_remuneraciones`, ensureToken, async(req, res) => {
    const {id,fecha_postulacion,rut,nombres,apellidos,edad,fecha_nacimiento,genero,nacionalidad,direccion,comuna,estado_civil,email,telefono,tipo_trabajador,disponibilidad,tipo_inscripcion,labor,otras_experiencias,ruta_archivo_cv,ultima_llamada,citacion_trabajar,asiste_trabajar,labor_actual,cuartel_actual,disponible,estado,enrolado,numero_cuenta,afp,salud,banco,tipo_cuenta,nivel_educacional,turno} = req.body;
            try {
                const query = `UPDATE postulante_contratado SET edad = ${edad},fecha_postulacion = '${fecha_postulacion}',nombres = '${nombres}',apellidos = '${apellidos}',email = '${email}',fecha_nacimiento = '${fecha_nacimiento}',genero = '${genero}',ruta_archivo_cv = '${ruta_archivo_cv}',nacionalidad = '${nacionalidad}',direccion = '${direccion}',comuna = '${comuna}',estado_civil = '${estado_civil}',telefono = '${telefono}',tipo_trabajador = '${tipo_trabajador}',disponibilidad = '${disponibilidad}',tipo_inscripcion = '${tipo_inscripcion}',labor = '${labor}',otras_experiencias = '${otras_experiencias}',ultima_llamada = '${ultima_llamada}',citacion_trabajar = '${citacion_trabajar}',asiste_trabajar = '${asiste_trabajar}', labor_actual = '${labor_actual}',cuartel_actual = '${cuartel_actual}',disponible = '${disponible}',estado = '${estado}',enrolado = '${enrolado}',numero_cuenta = '${numero_cuenta}',afp = '${afp}',salud = '${salud}',banco = '${banco}',tipo_cuenta = '${tipo_cuenta}',nivel_educacional = '${nivel_educacional}',turno = '${turno}'   WHERE id = '${id}'    `;
                console.log(query,'esta es la query')
                const pool = await poolPromise;
                const result = await pool.request()
                    .query(query);
                res.json(result.recordset);
            } catch (err) {
                res.status(500);
                res.send(err.message);
                console.log(err.message);
            }
});
router.put(`/postulante_remuneraciones_faltante`, ensureToken, async(req, res) => {
    const {id,numero_cuenta,afp,salud,banco,tipo_cuenta,nivel_educacional,estado,enrolado} = req.body;
            try {
                const query = `UPDATE postulante_contratado SET numero_cuenta = '${numero_cuenta}', afp = '${afp}',salud = '${salud}',banco = '${banco}',tipo_cuenta = '${tipo_cuenta}',nivel_educacional = '${nivel_educacional}',estado = '${estado}',enrolado = '${enrolado}'  WHERE id = '${id}'    `;
                console.log(query,'esta es la query')
                const pool = await poolPromise;
                const result = await pool.request()
                    .query(query);
                res.json(result.recordset);
            } catch (err) {
                res.status(500);
                res.send(err.message);
                console.log(err.message);
            }
});
router.put(`/postulante_packing`, ensureToken, async(req, res) => {
    const {id,rut,nombres,apellidos,fecha_nacimiento,genero,nacionalidad,direccion,comuna,estado_civil,email,telefono,tipo_trabajador,disponibilidad,tipo_inscripcion,labor,otras_experiencias} = req.body;
            try {
                const query = `UPDATE postulante SET nombres = '${nombres}',apellidos = '${apellidos}',email = '${email}',fecha_nacimiento = '${fecha_nacimiento}',genero = '${genero}',nacionalidad = '${nacionalidad}',direccion = '${direccion}',comuna = '${comuna}',estado_civil = '${estado_civil}',telefono = '${telefono}',tipo_trabajador = '${tipo_trabajador}',disponibilidad = '${disponibilidad}',tipo_inscripcion = '${tipo_inscripcion}',labor = '${labor}',otras_experiencias = '${otras_experiencias}'   WHERE id = '${id}' and email_validado = 1   `;
                console.log(query,'esta es la query')
                const pool = await poolPromise;
                const result = await pool.request()
                    .query(query);
                res.json(result.recordset);
            } catch (err) {
                res.status(500);
                res.send(err.message);
                console.log(err.message);
            }
});
router.delete(`/postulante_remuneraciones`, ensureToken, async(req, res) => {
    const {id} = req.body;
            try {
                const query = `DELETE FROM postulante_contratado WHERE id = '${id}' `;
                const pool = await poolPromise;
                const result = await pool.request()
                    .query(query);
                res.json(result.recordset);
            } catch (err) {
                res.status(500);
                res.send(err.message);
                console.log(err.message);
            }
});
router.get(`/labores_sdt`, ensureToken, async(req, res) => {
            try {
                const query = `SELECT a.IdActividad,dbo.InitCap(a.Nombre) AS 'Labor' FROM bsis_rem_afr.dbo.Actividades a WHERE a.IdEmpresa = 3`;
                const pool = await poolPromise;
                const result = await pool.request()
                    .query(query);
                res.json(result.recordset);
            } catch (err) {
                res.status(500);
                res.send(err.message);
                console.log(err.message);
            }
});
router.get(`/cuarteles_sdt`, ensureToken, async(req, res) => {
            try {
                const query = `SELECT ca.IdCuartel,dbo.initcap(ca.Nombre) AS Cuartel FROM bsis_rem_afr.dbo.Cuartel ca WHERE ca.IdEmpresa = 3`;
                const pool = await poolPromise;
                const result = await pool.request()
                    .query(query);
                res.json(result.recordset);
            } catch (err) {
                res.status(500);
                res.send(err.message);
                console.log(err.message);
            }
});


router.post('/loginRanco_Secret_', async(req, res) => {
    const user = { id: 3 };
    const token = jwt.sign({ user }, 'Api_Ranco_Key_01_04_2019');
    res.json({ token });
});

function ensureToken(req, res, next) {
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.status(403);
        res.send('No estás Autorizado!');
    }
}
module.exports = router;