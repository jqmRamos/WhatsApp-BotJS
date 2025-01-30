import fs from 'node:fs';
import { createRequire } from "module";
const require = createRequire(import.meta.url)

const qrcode = require('qrcode-terminal');
const { Client, Buttons, List, MessageMedia } = require('whatsapp-web.js'); // Mudança Buttons
const client = new Client();


var lista = [];
var dict = new Map();
dict.set('chave', 'valor');

const black_list = ['558003661212@c.us', '5518935050636@c.us', '5518997077306@c.us', '5518930857355@c.us', '556796725964@c.us', '5518997223345@c.us', '5518997084453@c.us', '5518935050643@c.us'];

function check_file(file_name, phone) {
    
    //return new Promise((resolve, reject) => {
        
        for (let index = 0; index < black_list.length; index++) {
            if(phone === black_list[index]){
                return true
            };   
        }
        for (let index = 0; index < lista.length; index++) {
            if(phone === lista[index]){
                return true
            };   
        } 
        return false
}



// gravar numero no arquivo
function write_file(file_name, phone) {
    lista.push(phone)
}




//  Serviço de leitura do qr code
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

// Quando o WhatsApp estiver pronto
client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

// Inicializa o cliente
client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms)); // Função para delay

// Função que verifica se estamos dentro do horário de atendimento
function isBusinessHours() {
    const now = new Date();
    const day = now.getDay(); // 0 = Domingo, 1 = Segunda-feira, ..., 6 = Sábado
    const hour = now.getHours(); // Horas no formato 24h

    // Verifica se é entre segunda-feira (1) e sexta-feira (5), das 8h às 18h
    return day >= 1 && day <= 5 && hour >= 8 && hour < 18;
}

// Funil
client.on('message', async msg => {
    const teste = await check_file('teste.txt', msg.from);
    console.log("Contato novo! \nSegue a lista abaixo\n", lista);
    if (msg.from === '5518998050314@c.us') {
        if (msg.body === "//clear"){
            lista = [];
        }
        if (msg.body === "//kill") {
            lista.shift();
        }
    }
    if (teste != true) {
        console.log("É novo");
        // Verifica se a mensagem contém palavras-chave para o menu
        if (msg.body.match(/(menu|Menu|bom dia|boa tarde|noite|oi|Oi|Olá|olá|ola|Ola)/i) && msg.from.endsWith('@c.us')) {

            const chat = await msg.getChat();
            await delay(3000); // Delay de 3 segundos
            await chat.sendStateTyping(); // Simulando Digitação
            await delay(3000); // Delay de 3 segundos
            const contact = await msg.getContact(); // Obtém o contato
            const name = contact.pushname; // Obtém o nome do contato
            let responseMessage = '';

            console.log(contact);

            // Verifica se está dentro do horário de atendimento
            if (isBusinessHours()) {
                // Se for durante o horário comercial
                responseMessage = 'Olá! ' + name.split(" ")[0] + '\nSou o assistente da Digymaq, estou aqui para lhe auxiliar.\n\nAntes de prosseguirmos, eu preciso saber. Sua impressora é:\n\n 1 - Alugada com a Digymaq \n2 - Particular \n3 - Outro Motivo';
            } else {
                // Se for fora do horário comercial
                responseMessage = 'Olá! ' + name.split(" ")[0] + '\nNo momento não estamos trabalhando. Nosso horário é de segunda a sexta-feira, das 8h às 18h. Por favor, entre em contato novamente durante nosso horário comercial ou aguarde que em breve nosso Suporte Técnico vai entrar em.';
            }

            await client.sendMessage(msg.from, responseMessage); // Envia a mensagem
            await delay(3000); // Delay de 3 segundos
            await chat.sendStateTyping(); // Simulando Digitação
            await delay(5000); // Delay de 5 segundos

        }
        // Lógica para as opções do menu (1, 2, 3)
 
        if (msg.body !== null && msg.body === '1' && msg.from.endsWith('@c.us')) {
            const chat = await msg.getChat();
            await delay(3000); // Delay de 3 segundos
            await chat.sendStateTyping(); // Simulando Digitação
            await delay(3000);
            await client.sendMessage(msg.from, 'Certo');
            await delay(2000); // Delay de 2 segundos
            await chat.sendStateTyping(); // Simulando Digitação
            await delay(3000);
            await client.sendMessage(msg.from, 'Na sua impressora tem um adesivo da Digymaq que vai estar com o Número de Série e o Patrimônio. Poderia me informar quais são?');
            await delay(3000); // Delay de 3 segundos
            await chat.sendStateTyping(); // Simulando Digitação
            write_file('teste.txt', msg.from)
        }

        if (msg.body !== null && msg.body === '2' && msg.from.endsWith('@c.us')) {
            const chat = await msg.getChat();
            await delay(3000); // Delay de 3 segundos
            await chat.sendStateTyping(); // Simulando Digitação
            await delay(3000);
            await client.sendMessage(msg.from, 'Assuntos sobre impressoras particulares devem ser tratados com este contato:');
            await delay(3000); // Delay de 3 segundos
            await chat.sendStateTyping(); // Simulando Digitação
            await delay(3000);
            await client.sendMessage(msg.from, '+55 18 93085-7355');
            write_file('teste.txt', msg.from)
        }

        if (msg.body !== null && msg.body === '3' && msg.from.endsWith('@c.us')) {
            const chat = await msg.getChat();
            await delay(3000); // Delay de 3 segundos
            await chat.sendStateTyping(); // Simulando Digitação
            await delay(3000);
            await client.sendMessage(msg.from, 'Informe o motivo do contato, que em breve um dos nossos técnicos vai te atender.');
            await delay(3000); // Delay de 3 segundos
            await chat.sendStateTyping(); // Simulando Digitação
            write_file('teste.txt', msg.from)
        }
    


    }
})
