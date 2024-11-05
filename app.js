import { Auto } from "./Auto.js";
import { Camion } from "./Camion.js";

document.addEventListener("DOMContentLoaded", () => {
    const tbVehiculos = document.getElementById("tabla-vehiculos").querySelector("tbody");
    const tituloTabla = document.getElementById("titulo-tabla");
    const contForm = document.getElementById("contenedor-form");
    const contTabla = document.getElementById("contenedor-tabla");
    const btnAgregar = document.getElementById("btnAgregar");

    let vehiculos = [];
    const spinner = document.getElementById("spinner");
    const tituloForm = document.getElementById("titulo-form");
    const vehiculoForm = document.getElementById("vehiculo-form");
    const btnCancelar = document.getElementById("btnCancelar");

    function obtenerVehiculos() {
        mostrarSpinner();
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4) {
                ocultarSpinner();
                if (xhttp.status == 200) {
                    const data = JSON.parse(xhttp.response);
                    vehiculos = data.map(item => {
                        if (item.carga !== undefined && item.autonomia !== undefined) {
                            return new Camion(item.id, item.modelo, item.anoFabricacion, item.velMax, item.carga, item.autonomia);
                        } else {
                            return new Auto(item.id, item.modelo, item.anoFabricacion, item.velMax, item.cantidadPuertas, item.asientos);
                        }
                    });
                    dibujarTabla(vehiculos);
                } else {
                    alert("No se pudo obtener los datos. Código de estado:", xhttp.status);
                }
            }
        };
        xhttp.open("GET", "https://examenesutn.vercel.app/api/VehiculoAutoCamion");
        xhttp.setRequestHeader('Content-type', 'application/json');
        xhttp.send();
    }

    function dibujarTabla(vehiculos) {
        tbVehiculos.innerHTML = "";
        vehiculos.forEach(vehiculo => {
            const linea = document.createElement("tr");

            const cantidadPuertas = vehiculo.cantidadPuertas !== undefined ? vehiculo.cantidadPuertas : "N/A";
            const asientos = vehiculo.asientos !== undefined ? vehiculo.asientos : "N/A";
            const carga = vehiculo.carga !== undefined ? vehiculo.carga : "N/A";
            const autonomia = vehiculo.autonomia !== undefined ? vehiculo.autonomia : "N/A";

            linea.innerHTML = `
                <td class="columnaID">${vehiculo.id}</td>
                <td>${vehiculo.modelo}</td>
                <td>${vehiculo.anoFabricacion}</td>
                <td>${vehiculo.velMax}</td>
                <td>${cantidadPuertas}</td>
                <td>${asientos}</td>
                <td>${carga}</td>
                <td>${autonomia}</td>
                <td>
                    <button class="btnEditar">Modificar</button>
                </td>
                <td>
                    <button class="btnBorrar">Eliminar</button>
                </td>
            `;

            linea.querySelector(".btnEditar").addEventListener("click", () => {
                if (vehiculo.carga) {
                    document.getElementById("carga").disabled = false;
                    document.getElementById("autonomia").disabled = false;
                } else {
                    document.getElementById("cantidadPuertas").disabled = false;
                    document.getElementById("asientos").disabled = false;
                }
                document.getElementById("tipo").style.display = "none"
                mostrarForm("Modificar", vehiculo);
            })
            linea.querySelector(".btnBorrar").addEventListener("click", () => {
                document.getElementById("tipo").style.display = "none"
                mostrarForm("Eliminar", vehiculo)
            });

            tbVehiculos.appendChild(linea);
        });
    }

    function mostrarSpinner() {
        spinner.classList.add("activo");
    }

    function ocultarSpinner() {
        spinner.classList.remove("activo");
    }

    function mostrarForm(titulo, vehiculo = null) {
        tituloForm.textContent = titulo;
        vehiculoForm.reset();
        contTabla.style.display = "none";
        tituloTabla.style.display = "none";
        contForm.style.display = "block";

        document.querySelector('.lblcantidadPuertas').style.display = 'inline';
        document.getElementById('cantidadPuertas').style.display = 'inline';
        document.querySelector('.lblAsientos').style.display = 'inline';
        document.getElementById('asientos').style.display = 'inline';
        document.querySelector('.lblCarga').style.display = 'inline';
        document.getElementById('carga').style.display = 'inline';
        document.querySelector('.lblAutonomia').style.display = 'inline';
        document.getElementById('autonomia').style.display = 'inline';

        if (vehiculo) {
            document.getElementById("id").value = vehiculo.id;
            document.getElementById("modelo").value = vehiculo.modelo;
            document.getElementById("anoFabricacion").value = vehiculo.anoFabricacion;
            document.getElementById("velMax").value = vehiculo.velMax;

            if (vehiculo instanceof Auto) {
                document.getElementById('cantidadPuertas').value = vehiculo.cantidadPuertas;
                document.getElementById('asientos').value = vehiculo.asientos;

                document.querySelector('.lblCarga').style.display = 'none';
                document.getElementById('carga').style.display = 'none';
                document.querySelector('.lblAutonomia').style.display = 'none';
                document.getElementById('autonomia').style.display = 'none';


            } else if (vehiculo instanceof Camion) {
                document.getElementById('carga').value = vehiculo.carga;
                document.getElementById('autonomia').value = vehiculo.autonomia;

                document.querySelector('.lblcantidadPuertas').style.display = 'none';
                document.getElementById('cantidadPuertas').style.display = 'none';
                document.querySelector('.lblAsientos').style.display = 'none';
                document.getElementById('asientos').style.display = 'none';
            }
        }
    }

    function ocultarForm() {
        contForm.style.display = "none";
        contTabla.style.display = "block";
        tituloTabla.style.display = "block";
        document.getElementById("tipo").style.display = "inline"
    }

    async function cargarVehiculo(vehiculoData) {
        mostrarSpinner();
        try {
            const response = await fetch("https://examenesutn.vercel.app/api/VehiculoAutoCamion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(vehiculoData)
            })
            const data = await response.json();
            if (response.status == 200) {
                const newVehiculo = vehiculoData.carga ?
                    new Camion(data.id, vehiculoData.modelo, vehiculoData.anoFabricacion, vehiculoData.velMax, vehiculoData.carga, vehiculoData.autonomia) :
                    new Auto(data.id, vehiculoData.modelo, vehiculoData.anoFabricacion, vehiculoData.velMax, vehiculoData.cantidadPuertas, vehiculoData.asientos);
                vehiculos.push(newVehiculo);
                dibujarTabla(vehiculos);
            } else {
                alert("Error al cargar vehiculo")
            }
        } catch (error) {
            console.error("Error al cargar vehiculo", error);
        } finally {
            ocultarForm();
            ocultarSpinner()
        }
    }

    function modificarVehiculo(vehiculoData) {
        mostrarSpinner();
        fetch("https://examenesutn.vercel.app/api/VehiculoAutoCamion", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(vehiculoData)
        })
            .then(res => {
                if (res.status == 200) {
                    const indice = vehiculos.findIndex(vehiculo => vehiculo.id == vehiculoData['id']);
                    if (vehiculoData.carga && vehiculoData.autonomia) {
                        vehiculos[indice].id = indice
                        vehiculos[indice].modelo = vehiculoData.modelo
                        vehiculos[indice].anoFabricacion = vehiculoData.anoFabricacion
                        vehiculos[indice].velMax = vehiculoData.velMax
                        vehiculos[indice].carga = vehiculoData.carga
                        vehiculos[indice].autonomia = vehiculoData.autonomia
                    } else {
                        vehiculos[indice].id = indice
                        vehiculos[indice].modelo = vehiculoData.modelo
                        vehiculos[indice].anoFabricacion = vehiculoData.anoFabricacion
                        vehiculos[indice].velMax = vehiculoData.velMax
                        vehiculos[indice].cantidadPuertas = vehiculoData.cantidadPuertas
                        vehiculos[indice].asientos = vehiculoData.asientos
                    }
                    dibujarTabla(vehiculos);
                } else {
                    alert("Error al modificar vehiculo")
                }
                ocultarForm();
                ocultarSpinner()
            })
            .catch(error => console.log("Error al modificar vehiculo: ", error));
    }

    function borrarVehiculo(vehiculoData) {
        mostrarSpinner();
        fetch("https://examenesutn.vercel.app/api/VehiculoAutoCamion", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(vehiculoData)
        })
            .then(res => {
                if (res.status == 200) {
                    vehiculos = vehiculos.filter(v => v.id != vehiculoData.id);
                    dibujarTabla(vehiculos);
                } else {
                    alert("Error al eliminar vehiculo")
                }
                ocultarSpinner();
                ocultarForm();
            })
            .catch(error => console.log("Error al eliminar vehiculo: ", error));
    }

    btnAgregar.addEventListener("click", () => {
        deshabilitarInputs()
        mostrarForm("Alta")
    });
    
    btnCancelar.addEventListener("click", ocultarForm);

    vehiculoForm.addEventListener("submit", (event) => {
        event.preventDefault();
        validarDatos()
    });

    document.getElementById("tipo").addEventListener("change", habilitarInputs)

    function habilitarInputs() {
        const tipo = document.getElementById("tipo").value;

        if (tipo == "auto") {
            document.getElementById("carga").disabled = true;
            document.getElementById("autonomia").disabled = true;
            document.getElementById("cantidadPuertas").disabled = false;
            document.getElementById("asientos").disabled = false;
        } else if (tipo == "camion") {
            document.getElementById("carga").disabled = false;
            document.getElementById("autonomia").disabled = false;
            document.getElementById("cantidadPuertas").disabled = true;
            document.getElementById("asientos").disabled = true;
        } else {
            deshabilitarInputs()
        }
    }

    function deshabilitarInputs() {
        document.getElementById("carga").disabled = true;
        document.getElementById("autonomia").disabled = true;
        document.getElementById("cantidadPuertas").disabled = true;
        document.getElementById("asientos").disabled = true;
    }

    function validarDatos() {
        const vehiculoData = {
            id: document.getElementById("id").value ? document.getElementById("id").value : null,
            modelo: document.getElementById("modelo").value,
            anoFabricacion: document.getElementById("anoFabricacion").value,
            velMax: document.getElementById("velMax").value,
            cantidadPuertas: document.getElementById("cantidadPuertas").value,
            asientos: document.getElementById("asientos").value,
            carga: document.getElementById("carga").value,
            autonomia: document.getElementById("autonomia").value
        };

        if (tituloForm.textContent == "Eliminar") {
            borrarVehiculo(vehiculoData)
            return
        }

        if (document.getElementById("anoFabricacion").value <= 1985) {
            alert("El año de fabricación debe ser mayor a 1985")
            return
        }
        if (document.getElementById("velMax").value <= 0) {
            alert("La velocidad maxima debe ser mayor a 0")
            return
        }

        if(document.getElementById("tipo").value == ""){
            alert("Debe elegir un tipo de vehiculo")
            return

        } else if(document.getElementById("tipo").value == "auto"){

            if (document.getElementById("cantidadPuertas").value <= 2) {
                alert("El vehiculo debe tener mas de dos puertas")
                return
            }
            if (document.getElementById("asientos").value <= 2) {
                alert("El vehiculo debe tener mas de dos asientos")
                return
            }
        } else if (document.getElementById("tipo").value == "camion"){
            
            if (document.getElementById("carga").value <= 0) {
                alert("La carga del vehiculo debe ser mayor a 0")
                return
            }
            if (document.getElementById("autonomia").value <= 0) {
                alert("La autonomía del vehiculo debe ser mayor a 0")
                return
            }
        }


        if (tituloForm.textContent == "Modificar") {
            modificarVehiculo(vehiculoData)
            return
        }
        if (tituloForm.textContent == "Alta") {
            cargarVehiculo(vehiculoData)
            return
        }
    }

    obtenerVehiculos();
});
