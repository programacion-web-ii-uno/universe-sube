# Universe Sube

API RESTful construida con Node.js y Express que proporciona funcionalidades en base un dataset proporcionado previamente.

> Trayectoria del trabajo practico para la materia PWII de la UNO

Con este proyecto podras:

- FEATURE 1
- FEATURE 2
- FEATURE 3

---

## 🧰 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/)
- Normalmente viene con NodeJS |-> [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/downloads)

---

## 🚀 Instalación

Clona el repositorio y entra al directorio del proyecto:

```bash
git clone https://github.com/programacion-web-ii-uno/universe-sube
cd universe-sube
```

## Instala las dependencias

```bash
npm install
```

## 🧪 Comandos Disponibles

| Comando | Descripción |
| ------- | ----------- |
| npm run dev | Inicia el servidor en modo desarrollo con nodemon |
| npm start | Inicia el servidor en producción |

## 🗂️ Estructura del Proyecto
├── src
│   ├── routes
│   ├── controllers
│   ├── services
│   ├── models
│   ├── middlewares (candidato a sacar)
│   └── index.js | inicia la app
├── .gitignore
├── package.json
└── README.md

### /routes
Define la estructura de rutas de la API sin la logica que maneja cada endpoint en cuanto manejo de request/response

### /controller
Es lo que routes usa para definir el comportamiento de request/response, codigos de errores, 400, 304, etc.

### /services
Es donde esta la logica del crud, por ejemplo aqui podriamos tener las features de la API donde pueda llamar a varios modelos, a las transacciones, incluso, a otro servicio (EJ: de provincias)

### /models
Es donde conecta con la base de datos y puede, por ejemplo, obtener una transaccion por id. Buscar por filtros, etc.

### /middlewares
(candidato a sacar)

## 📌 Notas
Usa nodemon para desarrollo (npm i -D nodemon)

## 🔧 Notas Técnicas

Usamos Thunder Client para la prueba como herramienta para probar y consumir la API RESTfull
