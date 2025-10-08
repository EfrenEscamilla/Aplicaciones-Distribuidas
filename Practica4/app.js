const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Almacenamiento en memoria
let tareas = [];
let productos = [];

// ===== EJERCICIO 1: Servicio de Saludo Básico =====
app.post('/saludo', (req, res) => {
    const { nombre } = req.body;
    
    if (!nombre) {
        return res.status(400).json({ error: 'El campo nombre es requerido' });
    }
    
    res.json({ mensaje: `Hola, ${nombre}` });
});

// ===== EJERCICIO 2: Calculadora =====
app.post('/calcular', (req, res) => {
    const { a, b, operacion } = req.body;
    
    if (typeof a !== 'number' || typeof b !== 'number') {
        return res.status(400).json({ error: 'Los campos a y b deben ser números' });
    }
    
    let resultado;
    switch (operacion) {
        case 'suma':
            resultado = a + b;
            break;
        case 'resta':
            resultado = a - b;
            break;
        case 'multiplicacion':
            resultado = a * b;
            break;
        case 'division':
            if (b === 0) {
                return res.status(400).json({ error: 'No se puede dividir por cero' });
            }
            resultado = a / b;
            break;
        default:
            return res.status(400).json({ error: 'Operación no válida' });
    }
    
    res.json({ resultado });
});

// ===== EJERCICIO 3: Gestor de Tareas =====
app.post('/tareas', (req, res) => {
    const { id, titulo, completada } = req.body;
    
    if (!id || !titulo) {
        return res.status(400).json({ error: 'Los campos id y título son requeridos' });
    }
    
    // Verificar si ya existe una tarea con ese ID
    if (tareas.find(t => t.id === id)) {
        return res.status(400).json({ error: 'Ya existe una tarea con ese ID' });
    }
    
    const nuevaTarea = { id, titulo, completada: completada || false };
    tareas.push(nuevaTarea);
    
    res.status(201).json(nuevaTarea);
});

app.get('/tareas', (req, res) => {
    res.json(tareas);
});

app.put('/tareas/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, completada } = req.body;
    
    const tareaIndex = tareas.findIndex(t => t.id === parseInt(id));
    
    if (tareaIndex === -1) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    
    if (titulo !== undefined) tareas[tareaIndex].titulo = titulo;
    if (completada !== undefined) tareas[tareaIndex].completada = completada;
    
    res.json(tareas[tareaIndex]);
});

app.delete('/tareas/:id', (req, res) => {
    const { id } = req.params;
    
    const tareaIndex = tareas.findIndex(t => t.id === parseInt(id));
    
    if (tareaIndex === -1) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    
    tareas.splice(tareaIndex, 1);
    res.status(204).send();
});

// ===== EJERCICIO 4: Validador de Contraseñas =====
app.post('/validar-password', (req, res) => {
    const { password } = req.body;
    const errores = [];
    
    if (!password || password.length < 8) {
        errores.push('La contraseña debe tener al menos 8 caracteres');
    }
    
    if (!/[A-Z]/.test(password)) {
        errores.push('La contraseña debe tener al menos una mayúscula');
    }
    
    if (!/[a-z]/.test(password)) {
        errores.push('La contraseña debe tener al menos una minúscula');
    }
    
    if (!/\d/.test(password)) {
        errores.push('La contraseña debe tener al menos un número');
    }
    
    res.json({
        esValida: errores.length === 0,
        errores
    });
});

// ===== EJERCICIO 5: Conversor de Temperatura =====
app.post('/convertir-temperatura', (req, res) => {
    const { valor, desde, hacia } = req.body;
    
    if (typeof valor !== 'number') {
        return res.status(400).json({ error: 'El valor debe ser un número' });
    }
    
    const escalasValidas = ['C', 'F', 'K'];
    if (!escalasValidas.includes(desde) || !escalasValidas.includes(hacia)) {
        return res.status(400).json({ error: 'Escalas válidas: C, F, K' });
    }
    
    // Conversión a Celsius como punto intermedio
    let valorEnCelsius;
    
    switch (desde) {
        case 'C':
            valorEnCelsius = valor;
            break;
        case 'F':
            valorEnCelsius = (valor - 32) * 5/9;
            break;
        case 'K':
            valorEnCelsius = valor - 273.15;
            break;
    }
    
    // Conversión desde Celsius a la escala destino
    let valorConvertido;
    
    switch (hacia) {
        case 'C':
            valorConvertido = valorEnCelsius;
            break;
        case 'F':
            valorConvertido = (valorEnCelsius * 9/5) + 32;
            break;
        case 'K':
            valorConvertido = valorEnCelsius + 273.15;
            break;
    }
    
    res.json({
        valorOriginal: valor,
        valorConvertido: parseFloat(valorConvertido.toFixed(2)),
        escalaOriginal: desde,
        escalaConvertida: hacia
    });
});

// ===== EJERCICIO 6: Buscador en Array =====
app.post('/buscar', (req, res) => {
    const { array, elemento } = req.body;
    
    if (!Array.isArray(array)) {
        return res.status(400).json({ error: 'El campo array debe ser un array' });
    }
    
    const indice = array.findIndex(item => 
        JSON.stringify(item) === JSON.stringify(elemento)
    );
    
    res.json({
        encontrado: indice !== -1,
        indice: indice,
        tipoElemento: typeof elemento
    });
});

// ===== EJERCICIO 7: Contador de Palabras =====
app.post('/contar-palabras', (req, res) => {
    const { texto } = req.body;
    
    if (typeof texto !== 'string') {
        return res.status(400).json({ error: 'El campo texto debe ser un string' });
    }
    
    const palabras = texto.trim().split(/\s+/).filter(palabra => palabra.length > 0);
    const palabrasUnicas = new Set(palabras.map(p => p.toLowerCase())).size;
    
    res.json({
        totalPalabras: palabras.length,
        totalCaracteres: texto.length,
        palabrasUnicas
    });
});

// ===== EJERCICIO 8: Generador de Perfiles =====
app.post('/generar-perfil', (req, res) => {
    const { nombre, edad, intereses } = req.body;
    
    if (!nombre || typeof edad !== 'number' || !Array.isArray(intereses)) {
        return res.status(400).json({ 
            error: 'Los campos nombre, edad (número) e intereses (array) son requeridos' 
        });
    }
    
    let categoria;
    if (edad < 18) categoria = 'junior';
    else if (edad < 35) categoria = 'senior';
    else categoria = 'veterano';
    
    res.json({
        usuario: { nombre, edad, intereses },
        id: uuidv4(),
        fechaCreacion: new Date().toISOString(),
        categoria
    });
});

// ===== EJERCICIO 9: Sistema de Calificaciones =====
app.post('/calcular-promedio', (req, res) => {
    const { calificaciones } = req.body;
    
    if (!Array.isArray(calificaciones)) {
        return res.status(400).json({ error: 'El campo calificaciones debe ser un array' });
    }
    
    // Validar que todas las calificaciones sean números entre 0-10
    for (let calificacion of calificaciones) {
        if (typeof calificacion !== 'number' || calificacion < 0 || calificacion > 10) {
            return res.status(400).json({ 
                error: 'Todas las calificaciones deben ser números entre 0 y 10' 
            });
        }
    }
    
    if (calificaciones.length === 0) {
        return res.json({
            promedio: 0,
            calificacionMasAlta: 0,
            calificacionMasBaja: 0,
            estado: 'reprobado'
        });
    }
    
    const promedio = calificaciones.reduce((a, b) => a + b, 0) / calificaciones.length;
    const calificacionMasAlta = Math.max(...calificaciones);
    const calificacionMasBaja = Math.min(...calificaciones);
    
    res.json({
        promedio: parseFloat(promedio.toFixed(2)),
        calificacionMasAlta,
        calificacionMasBaja,
        estado: promedio >= 6 ? 'aprobado' : 'reprobado'
    });
});

// ===== EJERCICIO 10: API de Productos =====
app.get('/productos', (req, res) => {
    const { categoria, precioMin, precioMax } = req.query;
    
    let productosFiltrados = [...productos];
    
    if (categoria) {
        productosFiltrados = productosFiltrados.filter(p => 
            p.categoria.toLowerCase() === categoria.toLowerCase()
        );
    }
    
    if (precioMin) {
        productosFiltrados = productosFiltrados.filter(p => 
            p.precio >= parseFloat(precioMin)
        );
    }
    
    if (precioMax) {
        productosFiltrados = productosFiltrados.filter(p => 
            p.precio <= parseFloat(precioMax)
        );
    }
    
    res.json(productosFiltrados);
});

app.post('/productos', (req, res) => {
    const { nombre, categoria, precio, descripcion } = req.body;
    
    if (!nombre || !categoria || typeof precio !== 'number') {
        return res.status(400).json({ 
            error: 'Los campos nombre, categoria y precio (número) son requeridos' 
        });
    }
    
    const nuevoProducto = {
        id: productos.length + 1,
        nombre,
        categoria,
        precio,
        descripcion: descripcion || '',
        fechaCreacion: new Date().toISOString()
    };
    
    productos.push(nuevoProducto);
    res.status(201).json(nuevoProducto);
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        mensaje: 'API de Aplicaciones Distribuidas funcionando',
        endpoints: [
            'POST /saludo',
            'POST /calcular',
            'CRUD /tareas',
            'POST /validar-password',
            'POST /convertir-temperatura',
            'POST /buscar',
            'POST /contar-palabras',
            'POST /generar-perfil',
            'POST /calcular-promedio',
            'GET/POST /productos'
        ]
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});