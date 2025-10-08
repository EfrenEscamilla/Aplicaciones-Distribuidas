const express = require('express');
const app = express();
const port = 3000;


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});


function generarTemperatura() {
    return Math.floor(Math.random() * (45 - 15 + 1)) + 15;
}


app.get('/', (req, res) => {
    res.send(`
        <h1>Servidor de Temperatura</h1>
        <p>Servidor funcionando correctamente</p>
        <p>Usa <a href="/temperatura">/temperatura</a> para obtener datos</p>
    `);
});


app.get('/temperatura', (req, res) => {
    const temperatura = generarTemperatura();
    console.log(`📊 [${new Date().toLocaleTimeString()}] Temperatura generada: ${temperatura}°C`);
    
    res.json({
        temperatura: temperatura,
        timestamp: new Date().toISOString(),
        mensaje: "Temperatura generada correctamente"
    });
});

app.listen(port, () => {
    console.log(`✅ Servidor de temperatura activo en http://localhost:${port}`);
    console.log(`🌡️  Endpoint: http://localhost:${port}/temperatura`);
    console.log(`📊 Generando temperaturas entre 15-45°C cada 30 segundos`);
});


app.on('error', (error) => {
    console.error('❌ Error del servidor:', error);

});
