import { Vehiculo } from './Vehiculo.js';

export class Auto extends Vehiculo {
    constructor(id, modelo, anoFabricacion, velMax, cantidadPuertas, asientos) {
        super(id, modelo, anoFabricacion, velMax)
        if (cantidadPuertas && asientos) {
            this.cantidadPuertas = cantidadPuertas;
            this.asientos = asientos
        }
    }

    toString() {
        return `${super.toString()}, Cantidad de puertas: ${this.cantidadPuertas}, Asientos: ${this.asientos}`;
    }
}