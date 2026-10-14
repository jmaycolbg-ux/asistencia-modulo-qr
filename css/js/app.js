// ---------- Almacenamiento Local (localStorage) ----------
const leer = (clave) => JSON.parse(localStorage.getItem(clave) || "[]");
const guardar = (clave, datos) => localStorage.setItem(clave, JSON.stringify(datos));

// ---------- Utilidades de Fecha y Hora ----------
function fechaHoy() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function horaAhora() {
  return new Date().toLocaleTimeString("es-CO", { hour12: false });
}

// ---------- Elementos DOM ----------
const inputLector = document.getElementById("inputLector");
const mensaje = document.getElementById("mensaje");
const filtroFecha = document.getElementById("filtroFecha");

// Establecer fecha por defecto en el filtro
filtroFecha.value = fechaHoy();

// ---------- Sistema de Mensajes ----------
let timerMensaje;
function mostrarMensaje(texto, tipo) {
  clearTimeout(timerMensaje);
  mensaje.textContent = texto;
  mensaje.className = `mensaje ${tipo}`;
  timerMensaje = setTimeout(() => {
    mensaje.className = "mensaje";
  }, 3500);
}

// ---------- Gestión de Estudiantes ----------
function agregarEstudiante() {
  const codigo = document.getElementById("codigo").value.trim().toUpperCase();
  const nombre = document.getElementById("nombre").value.trim();
  const grado = document.getElementById("grado").value.trim();

  if (!codigo || !nombre) {
    return alert("El Código y el Nombre son obligatorios.");
  }

  const estudiantes = leer("estudiantes");
  if (estudiantes.some(e => e.codigo === codigo)) {
    return alert("Ese código de estudiante ya existe.");
  }

  estudiantes.push({ codigo, nombre, grado });
  guardar("estudiantes", estudiantes);

  // Limpiar campos
  ["codigo", "nombre", "grado"].forEach(id => (document.getElementById(id).value = ""));

  pintarEstudiantes();
}

function eliminarEstudiante(codigo) {
  if (confirm(`¿Está seguro de eliminar al estudiante con código ${codigo}?`)) {
    const estudiantesActualizados = leer("estudiantes").filter(e => e.codigo !== codigo);
    guardar("estudiantes", estudiantesActualizados);
    pintarEstudiantes();
  }
}

function pintarEstudiantes() {
  const tbody = document.getElementById("tablaEstudiantes");
  tbody.innerHTML = "";
  
  const estudiantes = leer("estudiantes");
  
  if (estudiantes.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No hay estudiantes registrados.</td></tr>`;
    return;
  }

  estudiantes.forEach(est => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td><strong>${est.codigo}</strong></td>
      <td>${est.nombre}</td>
      <td>${est.grado || 'N/A'}</td>
      <td><div class="qr-mini" id="qr-${est.codigo}"></div></td>
      <td><button onclick="eliminarEstudiante('${est.codigo}')" style="background: var(--error);">Eliminar</button></td>
    `;
    tbody.appendChild(fila);

    // Generar código QR dinámicamente
    new QRCode(document.getElementById(`qr-${est.codigo}`), {
      text: est.codigo,
      width: 128,
      height: 128
    });
  });
}

// ---------- Registro de Asistencia ----------
function registrarAsistencia(codigo) {
  const estudiantes = leer("estudiantes");
  const est = estudiantes.find(e => e.codigo === codigo);

  if (!est) {
    return mostrarMensaje(`❌ Código no reconocido: ${codigo}`, "error");
  }

  const asistencias = leer("asistencias");
  const fecha = fechaHoy();

  // RF5: Impedir duplicados el mismo día
  if (asistencias.some(a => a.codigo === codigo && a.fecha === fecha)) {
    return mostrarMensaje(`⚠️ ${est.nombre} ya registró su ingreso el día de hoy.`, "aviso");
  }

  const hora = horaAhora();
  asistencias.push({ codigo, nombre: est.nombre, fecha, hora });
  guardar("asistencias", asistencias);

  mostrarMensaje(`✔ ${est.nombre} — ingreso registrado exitosamente a las ${hora}`, "ok");
  pintarAsistencia();
}

function pintarAsistencia() {
  const tbody = document.getElementById("tablaAsistencia");
  tbody.innerHTML = "";
  
  const asistenciasFiltradas = leer("asistencias").filter(a => a.fecha === filtroFecha.value);

  if (asistenciasFiltradas.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No hay registros de asistencia para esta fecha.</td></tr>`;
    return;
  }

  asistenciasFiltradas.forEach(a => {
    tbody.innerHTML += `
      <tr>
        <td><strong>${a.codigo}</strong></td>
        <td>${a.nombre}</td>
        <td>${a.fecha}</td>
        <td>${a.hora}</td>
      </tr>
    `;
  });
}

// ---------- Event Listeners ----------
document.getElementById("btnAgregar").addEventListener("click", agregarEstudiante);
filtroFecha.addEventListener("change", pintarAsistencia);

// RF3/RF4: Captura del lector (envía Enter tras escaneo)
inputLector.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const codigo = inputLector.value.trim().toUpperCase();
    inputLector.value = "";
    if (codigo) {
      registrarAsistencia(codigo);
    }
  }
});

// Mantener el foco automático en el campo del lector
document.addEventListener("click", (e) => {
  if (!["INPUT", "BUTTON"].includes(e.target.tagName)) {
    inputLector.focus();
  }
});

// ---------- Inicialización ----------
pintarEstudiantes();
pintarAsistencia();
