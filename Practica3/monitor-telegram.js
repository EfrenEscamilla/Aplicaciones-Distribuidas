const axios = require('axios');

// CONFIGURACIÓN CON TUS DATOS REALES
const CONFIG = {
    urlServicio: 'http://localhost:3000/temperatura',
    intervalo: 10000, // 10 segundos para pruebas (luego cambia a 30000)
    umbralAlto: 25,   // Bajo para pruebas fáciles (cambia a 39 después)
    intentosConsecutivos: 3,
    telegram: {
        botToken: '8387762474:AAGutkRrgMuA_IAsclQMp7dA4FPG9kkGO_s',
        chatId: '7024710758'  
    }
};

let contadorAlto = 0;


async function enviarAlertaTelegram(temperaturaActual) {
    const mensaje = ` *ALERTA DE TEMPERATURA CRÍTICA* 

Se han detectado *${CONFIG.intentosConsecutivos} temperaturas consecutivas* por encima del umbral permitido.

• *Umbral máximo:* ${CONFIG.umbralAlto}°C
• *Temperatura actual:* ${temperaturaActual}°C  
• *Hora:* ${new Date().toLocaleString()}

* Por favor, tomar las medidas necesarias *`;

    const url = `https://api.telegram.org/bot${CONFIG.telegram.botToken}/sendMessage`;
    
    try {
        const response = await axios.post(url, {
            chat_id: CONFIG.telegram.chatId,
            text: mensaje,
            parse_mode: 'Markdown'
        });
        console.log(' Alerta enviada por Telegram correctamente');
        console.log(` Mensaje ID: ${response.data.result.message_id}`);
    } catch (error) {
        console.error(' Error enviando a Telegram:', error.response?.data?.description || error.message);
    }
}

/**
 * Función para obtener temperatura del servicio web
 */
async function obtenerTemperatura() {
    try {
        const respuesta = await axios.get(CONFIG.urlServicio);
        return respuesta.data.temperatura;
    } catch (error) {
        console.error(' Error al obtener temperatura:', error.message);
        return null;
    }
}

/**
 * Función principal de monitoreo
 */
async function monitorearTemperatura() {
    console.log(`\n🔍 [${new Date().toLocaleTimeString()}] Monitoreando temperatura...`);
    
    const temperatura = await obtenerTemperatura();
    
    if (temperatura !== null) {
        console.log(`  Temperatura actual: ${temperatura}°C`);
        
        // Verificar si está arriba del umbral
        if (temperatura > CONFIG.umbralAlto) {
            contadorAlto++;
            console.log(`  Temperatura alta #${contadorAlto} consecutiva`);
            console.log(` Umbral: ${CONFIG.umbralAlto}°C | Actual: ${temperatura}°C`);
            
            if (contadorAlto >= CONFIG.intentosConsecutivos) {
                console.log(' ENVIANDO ALERTA TELEGRAM - 3 temperaturas altas consecutivas!');
                await enviarAlertaTelegram(temperatura);
                contadorAlto = 0; // Reiniciar contador después de alerta
            }
        } else {
            console.log(' Temperatura dentro del rango normal');
            contadorAlto = 0; // Reiniciar contador
        }
    }
}

// Información de inicio
console.log(' Iniciando monitor de temperatura con Telegram...');
console.log(' Configuración:');
console.log(`   - Servicio: ${CONFIG.urlServicio}`);
console.log(`   - Intervalo: ${CONFIG.intervalo/1000} segundos`);
console.log(`   - Umbral alerta: ${CONFIG.umbralAlto}°C`);
console.log(`   - Alertas después de: ${CONFIG.intentosConsecutivos} lecturas`);
console.log(`   - Chat ID: ${CONFIG.telegram.chatId}`);
console.log(' Para pruebas: Umbral bajo (25°C) para alertas rápidas\n');

// Iniciar monitoreo
setInterval(monitorearTemperatura, CONFIG.intervalo);
monitorearTemperatura(); // Ejecutar inmediatamente al inicio