/**
 * Conecta con la base de datos y puede hacer funcionalidades basicas sobre la base de datos como Filtrar, eliminar, agregar, obtener por id, etc.
 */

// class Transaction {
//     constructor(diaTransporte, nombreEmpresa, linea, amba, tipoTransporte, juridisccion, provincia, municipio, cantidad, datoPreliminar) {
//         this.diaTransporte = diaTransporte;
//         this.nombreEmpresa = nombreEmpresa;
//         this.linea = linea;
//         this.amba = amba;
//         this.tipoTransporte = tipoTransporte;
//         this.juridisccion = juridisccion;
//         this.provincia = provincia;
//         this.municipio = municipio;
//         this.cantidad = cantidad;
//         this.datoPreliminar = datoPreliminar;
//     }
// }

const fs = require("fs");
const parser = require('stream-json');
const streamArray = require('stream-json/streamers/StreamArray');

async function getAll(Limit, Offset) {
    const PATH_DB = "D:\\uno\\materias\\PWII\\universe-sube\\database\\cantidad-de-transacciones-sube-por-dia-en-2024.json";
    let currentIndex = 0;
    let results = [];

    return new Promise( (res, rej) => {
        const jsonStream = fs.createReadStream(PATH_DB)
            .pipe(parser())
            .pipe(new streamArray());

        // El evento se dispara por cada registro del JSON ya parseado
        jsonStream.on('data', ({ _, value }) => {
            if (currentIndex >= Offset && results.length < Limit) {
                results.push(value);
            }
            currentIndex++;

            if (results.length === Limit) {
                jsonStream.destroy(); // Para de ller
            }
        });

        jsonStream.on('end', () => {
            // console.log('Objetos paginados:', results);
            res(results);
        });

        jsonStream.on('error', (err) => {
            console.error(`Ocurrio un error leyendo el JSON ${PATH_DB}:${currentIndex}`)
            rej(err);
        });
    })
}

module.exports = { getAll }
