const axios = require('axios');
const nodemailer = require('nodemailer');


const CONFIG = {
    urlServicio: 'http://localhost:3000/temperatura',
    intervalo: 30000, 
    umbralAlto: 39,
    intentosConsecutivos: 3
};


let contadorAlto = 0;


const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: 'tu_email@gmail.com', 
        pass: 'tu_contraseña_app'   
    }
});


async function obtenerTemperatura() {
    try {
        const respuesta = await axios.get(CONFIG.urlServicio);
        return respuesta.data.temperatura;
    } catch (error) {
        console.error('Error al obtener temperatura:', error.message);
        return null;
    }
}


async function monitorearTemperatura() {
    console.log(`\n🔍 Monitoreando temperatura... (${new Date().toLocaleTimeString()})`);
    
    const temperatura = await obtenerTemperatura();
    
    if (temperatura !== null) {
        console.log(`🌡️  Temperatura actual: ${temperatura}°C`);
        
        if (temperatura > CONFIG.umbralAlto) {
            contadorAlto++;
            console.log(`⚠️  Temperatura alta #${contadorAlto}`);
            
            if (contadorAlto >= CONFIG.intentosConsecutivos) {
                console.log('🚨 ENVIANDO ALERTA - 3 temperaturas altas consecutivas!');
                await enviarAlertaEmail(temperatura);
                contadorAlto = 0; 
            }
        } else {
            console.log('✅ Temperatura dentro del rango normal');
            contadorAlto = 0; 
        }
    }
}


console.log('🚀 Iniciando monitor de temperatura...');
console.log(`📊 Configuración:`);
console.log(`   - URL Servicio: ${CONFIG.urlServicio}`);
console.log(`   - Intervalo: ${CONFIG.intervalo/1000} segundos`);
console.log(`   - Umbral: ${CONFIG.umbralAlto}°C`);
console.log(`   - Alertas después de: ${CONFIG.intentosConsecutivos} lecturas consecutivas\n`);

setInterval(monitorearTemperatura, CONFIG.intervalo);

monitorearTemperatura(); 
