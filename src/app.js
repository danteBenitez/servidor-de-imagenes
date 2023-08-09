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
// app.use('/', require('./routes/index.routes.js'));
// app.use('/api/upload', require('./routes/upload.routes.js'))

app.listen(PORT, () => {
    sequelize.sync({ force: true });
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
});

