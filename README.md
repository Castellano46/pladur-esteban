# Maestro del Pladur - Web Profesional

Este proyecto es una plataforma web premium y moderna diseñada para una empresa de servicios de construcción en seco (Pladur). La aplicación utiliza una arquitectura multi-página y un sistema de reseñas personalizado que no requiere bases de datos complejas, utilizando archivos CSV para la persistencia.

## 🚀 Características Principales

- **Diseño Editorial Premium**: Estética minimalista y profesional orientada al sector de la arquitectura y construcción.
- **Arquitectura Multi-página**: Navegación fluida entre secciones (Inicio, Nosotros, Servicios, Proyectos, Reseñas y Contacto).
- **Sistema de Reseñas Dinámico**: Los usuarios pueden dejar valoraciones y comentarios que se guardan y cargan en tiempo real.
- **Persistencia en CSV**: Base de datos ligera basada en archivos CSV para facilitar la portabilidad y simplicidad.
- **Backend Robusto**: Servidor Node.js con Express optimizado para la entrega de contenido estático y gestión de API.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **Backend**: Node.js, Express.js.
- **Almacenamiento**: CSV (vía `fs` y `csv-writer`).
- **Middleware**: Body-parser, Cors.

## 💻 Instalación y Ejecución Local

Sigue estos pasos para poner en marcha el proyecto en tu máquina local:

### 1. Prerrequisitos

Asegúrate de tener instalado **Node.js** (versión 14 o superior) y **npm**. Puedes descargarlos en [nodejs.org](https://nodejs.org/).

### 2. Clonar o descargar el proyecto

Si tienes el código en una carpeta, abre una terminal o PowerShell en la ruta raíz del proyecto (`/pladur`).

### 3. Instalar dependencias

Ejecuta el siguiente comando para instalar todos los módulos necesarios:

```bash
npm install
```

### 4. Iniciar el servidor

Para lanzar la aplicación, ejecuta:

```bash
node server.js
```

Verás un mensaje en la consola indicando que el servidor está activo:
`SERVER ACTIVE AT http://localhost:3000`

### 5. Acceder a la web

Abre tu navegador preferido y dirígete a:
[http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

- `/data`: Contiene el archivo `reviews.csv` donde se almacenan las reseñas.
- `/public`: Archivos estáticos (CSS, JavaScript del cliente, imágenes).
- `/views`: Los archivos HTML de las diferentes páginas de la web.
- `server.js`: Punto de entrada de la aplicación y configuración del servidor Express.
- `package.json`: Definición de dependencias y scripts del proyecto.

---
*Desarrollado con enfoque en excelencia visual y rendimiento.*
