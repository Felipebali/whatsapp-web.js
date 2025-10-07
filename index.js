'use strict';

const { Client, LocalAuth } = require('./index.js'); // tu librería
const qrcode = require('qrcode-terminal');
const readline = require('readline');

// Crear cliente con LocalAuth
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true } // Puppeteer no se usará en Termux
});

// Evento: cliente listo
client.on('ready', async () => {
    console.log('✅ Bot conectado a WhatsApp!');

    // Si no está registrado, pedimos código de emparejamiento
    if(!client.info) {
        const phoneNumber = '59898719147'; // tu número de WhatsApp sin + ni espacios
        console.log(`Generando código de emparejamiento para: ${phoneNumber}...`);

        const code = await client.getPairingCode(phoneNumber);
        const formattedCode = code.match(/.{1,4}/g).join('-');
        console.log(`📌 Tu código de vinculación: ${formattedCode}`);
        console.log('Pega este código en WhatsApp → Dispositivos vinculados → Vincular un dispositivo → Usar código de emparejamiento');
    }
});

// Evento: mensajes entrantes
client.on('message', async message => {
    console.log(`Mensaje de ${message.from}: ${message.body}`);

    // Comando de prueba
    if(message.body === '!ping') {
        message.reply('pong');
    }

    // Comando .menu
    if(message.body === '.menu') {
        message.reply(
`📜 *Comandos disponibles:*
!ping - Responde pong
.menu - Muestra este menú`
        );
    }
});

// Inicializar el cliente
client.initialize();
