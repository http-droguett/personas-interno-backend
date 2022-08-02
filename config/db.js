"use strict";
const sql = require("mssql");
const propierties = require("./config");

const poolPromise = new sql.ConnectionPool(propierties.CONFIG_SQL)
    .connect()
    .then(pool => {
        console.log("Conexion Exitosa!");
        return pool;
    })
    .catch(err => console.log("Conexion Erronea! Mala Configuracion: ", err));

module.exports = {
    sql,
    poolPromise
};