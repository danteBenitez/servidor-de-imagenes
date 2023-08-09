const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const app = express();

// Inicializar variables de entorno
require("dotenv").config();

// Iniciar base de datos
const { sequelize } = require('./db.js');

// Modelos
const Provider = require('./models/provider.js');

// Configuración general

// Puerto del servidor
const PORT = process.env.PORT;

// Motor de plantillas y carpeta views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './src/views'));

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rutas 
app.use(require('./routes/upload.routes.js'))

// Función que realiza las configuraciones correspondientes a la base
// de datos e inicia el servidor
async function runServer() {
    // Verificar la conexión a base de datos
    await sequelize.authenticate();

    // Sincronizar modelos
    await sequelize.sync({
        alter: {
            drop: false // Evita cualquier borrado de tablas o columnas
        }
    });

    // Crear los proveedores de imágenes por defecto en la DB
    // de no existir
    await Provider.findOrCreate({
        where: {
            id: 1, 
            description: "Servidor propio"
        }
    });
    await Provider.findOrCreate({
        where: {
            id: 2,
            description: "Cloudinary"
        }
    });

    app.listen(8000, () => {
        console.log(`Servidor recibiendo peticiones en http://localhost:${PORT}`);
    });
}

runServer();
