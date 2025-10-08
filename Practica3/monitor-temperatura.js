const axios = require('axios');
const nodemailer = require('nodemailer');

// Configuración
const CONFIG = {
    urlServicio: 'http://localhost:3000/temperatura',
    intervalo: 30000, // 30 segundos en milisegundos
    umbralAlto: 39,
    intentosConsecutivos: 3
};

// Contador de temperaturas altas consecutivas
let contadorAlto = 0;

// Configuración del email (usando Gmail como ejemplo)
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: 'tu_email@gmail.com', // Reemplaza con tu email
        pass: 'tu_contraseña_app'   // Reemplaza con tu contraseña de aplicación
    }
});

/**
 * Función para obtener temperatura del servicio web
 */
async function obtenerTemperatura() {
    try {
        const respuesta = await axios.get(CONFIG.urlServicio);
        return respuesta.data.temperatura;
    } catch (error) {
        console.error('Error al obtener temperatura:', error.message);
        return null;
    }
}

/**
 * Función para enviar alerta por email
 */
async function enviarAlertaEmail(temperaturaActual) {
    const mailOptions = {
        from: 'tu_email@gmail.com',
        to: 'destinatario@example.com', // Reemplaza con el email destino
        subject: '🚨 ALERTA: Temperatura Crítica Detectada',
        html: `
            <h2>Alerta de Temperatura</h2>
            <p>Se han detectado <strong>${CONFIG.intentosConsecutivos} temperaturas consecutivas</strong> por encima del umbral permitido.</p>
            <ul>
                <li>Umbral máximo: ${CONFIG.umbralAlto}°C</li>
                <li>Temperatura actual: ${temperaturaActual}°C</li>
                <li>Timestamp: ${new Date().toLocaleString()}</li>
            </ul>
            <p>Por favor, tomar las medidas necesarias.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Alerta enviada por email correctamente');
    } catch (error) {
        console.error('❌ Error enviando email:', error);
    }
}

/**
 * Función principal de monitoreo
 */
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
                contadorAlto = 0; // Reiniciar contador después de alerta
            }
        } else {
            console.log('✅ Temperatura dentro del rango normal');
            contadorAlto = 0; // Reiniciar contador si temperatura es normal
        }
    }
}

// Iniciar monitoreo
console.log('🚀 Iniciando monitor de temperatura...');
console.log(`📊 Configuración:`);
console.log(`   - URL Servicio: ${CONFIG.urlServicio}`);
console.log(`   - Intervalo: ${CONFIG.intervalo/1000} segundos`);
console.log(`   - Umbral: ${CONFIG.umbralAlto}°C`);
console.log(`   - Alertas después de: ${CONFIG.intentosConsecutivos} lecturas consecutivas\n`);

setInterval(monitorearTemperatura, CONFIG.intervalo);
monitorearTemperatura(); // Ejecutar inmediatamente al inicio