const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({limit: '50mb', extended:true}));

mongoose.connect('mongodb://MongoDB:27017/DB', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
    console.log('Conexión exitosa a MongoDB');
});

const ImgSchema = new mongoose.Schema({
    foto: String,
    fechaCreacion:String
});

const ImgModel = mongoose.model('datos', ImgSchema);

app.post('/guardarFoto', async (req, res) => {
    try {
        const { foto,fechaCreacion } = req.body;
        const newData = new ImgModel({ foto,fechaCreacion });
        const savedData = await newData.save();
        res.json(savedData);
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
});

app.get('/obtenerFotos', async (req, res) => {
    try {
        const getData = await ImgModel.find();
        res.json(getData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la lista de alumnos' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});