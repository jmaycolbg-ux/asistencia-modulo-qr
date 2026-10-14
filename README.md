# Módulo de Asistencia Institucional con Carnet QR 📱🏫

Aplicación web desarrollada en **HTML5, CSS3 y JavaScript** diseñada para registrar de manera rápida y confiable la asistencia de estudiantes mediante la lectura de códigos QR o de barras (compatible con lectores USB o simulación manual).

## 🚀 Tecnologías
- HTML5 (Estructura)
- CSS3 (Estilos y Diseño Responsivo)
- JavaScript Vanilla + `localStorage` (Lógica y persistencia de datos)
- [QRCode.js](https://davidshimjs.github.io/qrcodejs/) (Generación dinámica de códigos QR)

## ⚙️ Características Principales
1. **Gestión de Estudiantes:** Permite registrar estudiantes con su código único, nombre y grado/curso, generando automáticamente su carnet con código QR[cite: 1].
2. **Registro de Asistencia:** Captura el ingreso mediante lector USB o escribiendo el código y presionando `Enter`[cite: 1].
3. **Validación de Duplicados:** Impide que un estudiante registre asistencia dos veces el mismo día[cite: 1].
4. **Historial y Filtros:** Permite consultar y filtrar las asistencias por fecha de manera dinámica[cite: 1].

## 💻 Cómo Probarlo Localmente
1. Clona o descarga este repositorio en tu computadora.
2. Abre el archivo `index.html` directamente en tu navegador web (Chrome, Edge, Firefox, etc.).
3. ¡Listo! Puedes agregar un estudiante (ej: Código: `EST-0001`, Nombre: `Ana Pérez`) y probar el lector escribiendo su código y presionando `Enter`.
