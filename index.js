import express from 'express';
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import conectarDB from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config();

conectarDB();

app.use('/', usuarioRoutes);

const PORT = process.env.PORT || 6000

app.listen(PORT, () => {
    console.log(`Conectado al servidor ${PORT}`);
});