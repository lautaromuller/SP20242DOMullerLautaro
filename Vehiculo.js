export class Vehiculo {

    constructor(id, modelo, anoFabricacion, velMax) {
        if (id && modelo && anoFabricacion && velMax) {
            this.id = id;
            this.modelo = modelo ;
            this.anoFabricacion = anoFabricacion;
            this.velMax = velMax;
        }
    }

    toString() {
        return `Id: ${this.id}, Modelo: ${this.modelo}, Año de Fabricacion: ${this.anoFabricacion}, Velocidad Maxima: ${this.velMax}`;
    }
}