// varaibles y selectores
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");

//eventos
EventListeners();
function EventListeners() {
  document.addEventListener("DOMContentLoaded", preguntarPresupuesto);
  formulario.addEventListener("submit", agregarGasto);
}

// clases
class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }
  NuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    console.log(this.gastos);
    this.calcularRestante();
  }
  calcularRestante() {
    const gastado = this.gastos.reduce(
      (total, gasto) => total + gasto.cantidad,
      0
    );
    this.restante = this.presupuesto - gastado;
    console.log(this.restante);
  }
  eliminarGasto(id) {
    this.gastos = this.gastos.filter((gasto) => gasto.id != id);
    this.calcularRestante();
  }
}
class UI {
  insertarPresupuesto(cantidad) {
    // extraer el valor
    const { presupuesto, restante } = cantidad; // Por que extres el objeto entero de la clase presupuesto
    // agregar al HTML
    document.querySelector("#total").textContent = presupuesto;
    document.querySelector("#restante").textContent = restante;
  }

  imprimirAlerta(mensaje, tipo) {
    // crear el div
    const divmensaje = document.createElement("div");
    divmensaje.classList.add("text-center", "alert");

    if (tipo === "error") {
      divmensaje.classList.add("alert-danger");
    } else {
      divmensaje.classList.add("alert-success");
    }
    //mensaje de error
    divmensaje.textContent = mensaje;
    // insertar en el html
    document.querySelector(".primario").insertBefore(divmensaje, formulario);
    // quitar del html
    setTimeout(() => {
      divmensaje.remove();
    }, 3000);
  }
  mostrarGastos(gastos) {
    // iterar sobre los gastos

    this.limpiarHTML(); // Elimina el HTML previo

    gastos.forEach((gasto) => {
      const { cantidad, nombre, id } = gasto;
      // crear un LI
      const NuevoGasto = document.createElement("li");
      NuevoGasto.className =
        "list-group-item d-flex justify-content-between align-items-center";
      NuevoGasto.dataset.id = id;
      console.log(NuevoGasto);
      // agregar el html del gasto
      NuevoGasto.innerHTML = `${nombre} <span class = "badge badge-primary badge-pill"> $${cantidad}</span>`;

      // boton borrar el gasto
      const btnBorrar = document.createElement("button");
      btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
      btnBorrar.innerHTML = "borrar &times";

      btnBorrar.onclick = () => {
        eliminarGasto(id);
      };
      NuevoGasto.appendChild(btnBorrar);

      // agregar al HTML
      gastoListado.appendChild(NuevoGasto);
    });
  }
  limpiarHTML() {
    while (gastoListado.firstChild) {
      gastoListado.removeChild(gastoListado.firstChild);
    }
  }

  actualizarRestante(restante) {
    document.querySelector("#restante").textContent = restante;
  }
  comprobarPresupuesto(presupuestoObj) {
    const { presupuesto, restante } = presupuestoObj;
    const restanteDiv = document.querySelector(".restante");
    // COmprobar el 25%
    if (presupuesto / 4 > restante) {
      restanteDiv.classList.remove("alert-success", "alert-warning");
      restanteDiv.classList.add("alert-danger");
    } else if (presupuesto / 2 > restante) {
      restanteDiv.classList.remove("alert-success");
      restanteDiv.classList.add("alert-warning");
    } else {
      restanteDiv.classList.remove("alert-danger", "alert-warning");
      restanteDiv.classList.add("alert-success");
    }

    // si el total es cero o menor
    if (restante <= 0) {
      ui.imprimirAlerta("el presupuesto se a agotado", "error");
      formulario.querySelector('button[type="submit"]').disabled = true;
    }
    if (restante > 0) {
      formulario.querySelector('button[type="submit"]').disabled = false;
    }
  }
}

//instanciar
const ui = new UI();
let presupuesto;

// funciones
function preguntarPresupuesto() {
  const presupuestoUsuario = prompt("Cual es tu presupuesto?");
  console.log(Number(presupuestoUsuario));

  if (
    presupuestoUsuario === "" ||
    presupuestoUsuario === null ||
    isNaN(presupuestoUsuario) || // si da nan devuelve true
    presupuestoUsuario <= 0
  ) {
    window.location.reload();
  }

  //Presupuesto valido
  presupuesto = new Presupuesto(presupuestoUsuario);
  console.log(presupuesto);

  ui.insertarPresupuesto(presupuesto);
}

// anade gastos
function agregarGasto(e) {
  e.preventDefault();
  //leer los datos del formulario
  const nombre = document.querySelector("#gasto").value;
  const cantidad = Number(document.querySelector("#cantidad").value);
  //validar
  if (nombre === "" || cantidad === " ") {
    ui.imprimirAlerta("ambos campos son obligatorios", "error");
    return;
  } else if (cantidad <= 0 || isNaN(cantidad)) {
    ui.imprimirAlerta("cantidad no valida", "error");
    return;
  }
  // generar un objeto con el gasto
  const gasto = { nombre, cantidad, id: Date.now() };
  //anade un nuevo gasto
  presupuesto.NuevoGasto(gasto);
  //mensaje de todo bien
  ui.imprimirAlerta("gasto agregado correctamente");

  // imprimir los gastos
  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarPresupuesto(presupuesto);

  // reinicia el formulario
  formulario.reset();
}

function eliminarGasto(id) {
  //ELMINA LOS GASTOS DE LA CLASE U OBJETO
  presupuesto.eliminarGasto(id);

  //ELimina los gastos del HTML
  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarPresupuesto(presupuesto);
}
