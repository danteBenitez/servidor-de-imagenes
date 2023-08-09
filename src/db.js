const { Sequelize, DataTypes } = require("sequelize");

const {
    DB_PASSWORD,
    DB_NAME,
    DB_PORT,
    DB_USERNAME,
    DB_DIALECT,
    DB_HOST,
} = process.env;

const sequelize = new Sequelize({
  dialect: DB_DIALECT,
  database: DB_NAME,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT
}); 

// Captar errores de conexión lo antes posible
sequelize.authenticate()
.catch((e) => {
   console.log("Hubo un error al conectarse a la base de datos: ", e);
});

module.exports =  { sequelize, DataTypes };