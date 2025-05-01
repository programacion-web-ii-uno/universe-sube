/**
 * Conecta con la base de datos y puede hacer funcionalidades basicas sobre la base de datos como Filtrar, eliminar, agregar, obtener por id, etc.
 */

class Transaction {
    constructor(diaTransporte, nombreEmpresa, linea, amba, tipoTransporte, juridisccion, provincia, municipio, cantidad, datoPreliminar) {
        this.diaTransporte = diaTransporte;
        this.nombreEmpresa = nombreEmpresa;
        this.linea = linea;
        this.amba = amba;
        this.tipoTransporte = tipoTransporte;
        this.juridisccion = juridisccion;
        this.provincia = provincia;
        this.municipio = municipio;
        this.cantidad = cantidad;
        this.datoPreliminar = datoPreliminar;
    }
}

export { Transaction }
