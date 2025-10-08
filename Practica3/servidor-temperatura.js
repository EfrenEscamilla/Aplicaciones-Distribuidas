const express = require('express');
const app = express();
const port = 3000;


function generarTemperatura() {
    return Math.floor(Math.random() * (45 - 15 + 1)) + 15;
}

app.get('/temperatura', (req, res) => {
    const temperatura = generarTemperatura();
    res.json({
        temperatura: temperatura,
        timestamp: new Date().toISOString()
    });
});

app.listen(port, () => {
    console.log(`Servidor de temperatura corriendo en http://localhost:${port}`);

});
