import { Vehiculo } from './Vehiculo.js';

export class Camion extends Vehiculo {
    constructor(id, modelo, anoFabricacion, velMax, carga, autonomia) {
        super(id, modelo, anoFabricacion, velMax)
        if (carga && autonomia) {
            this.carga = carga;
            this.autonomia = autonomia
        }
    }

    toString() {
        return `${super.toString()}, Carga: ${this.carga}, Autonomia: ${this.autonomia}`;
    }
}