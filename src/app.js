const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { config } = require('dotenv');
config();

// Importar las rutas de libros
const bookRoutes = require('./routes/book.routes');

const app = express();
app.use(bodyParser.json());

// Conectar a la base de datos MongoDB
mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME, });
const db = mongoose.connection;

// Usar las rutas de libros en nuestra aplicación Express
app.use('/books', bookRoutes);

// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor iniciado en el puerto ${port}`));