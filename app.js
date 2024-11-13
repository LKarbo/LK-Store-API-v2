// iniciar sv con: npx nodemon app.js

require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT;

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = require('./config');
console.log('Firebase inicializado:', !!db);

// rutas
app.use('/api', require('./src/Routes/userRoutes'));
app.use('/api', require('./src/Routes/hamburgerRoutes'));
app.use('/api', require('./src/Routes/friesRoutes'));
app.use('/api', require('./src/Routes/drinkRoutes'));
app.use('/api', require('./src/Routes/discountRoutes'));
app.use('/api', require('./src/Routes/menuRoutes'));
app.use('/api', require('./src/Routes/supportRoutes'));
app.use('/api', require('./src/Routes/orderRoutes'));

app.use((err, req, res, next) => {
    console.error('Error no manejado:', err);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: err.message
    });
});

app.use((req, res) => {
    res.status(404);
    res.send(`
        <h1>404 - Página no encontrada</h1>
        <p>Lo sentimos, la página que estás buscando no existe.</p>
        <a href="/">Volver a la página de inicio</a>
    `);
});

app.listen(port, () => {
    console.log('Servidor iniciado en: http://localhost:' + port);
});