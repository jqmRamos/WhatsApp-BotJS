var dict = new Map();
// leitor de qr code
const qrcode = require('qrcode-terminal');
const { Client, Buttons, List, MessageMedia } = require('whatsapp-web.js'); // Mudança Buttons
const client = new Client();
// serviço de leitura do qr code
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});
// apos isso ele diz que foi tudo certo
client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});
// E inicializa tudo 
client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms)); // Função que usamos para criar o delay entre uma ação e outra

// Funil

client.on('message', async msg => {

    console.log('Recebendo Mensagem...');
    const chat = await msg.getChat();
    console.log(msg.body);
    console.log('Checando o status do equipamento...')
    if (msg.from.length < 19) {
        console.log('Mensagem Particular');
        
        if (msg.from == '5518997072992@c.us') {
            console.log('é dentro')
            const chat = await msg.getChat();
            const contact = await msg.getContact();
            const name = contact.pushname;

            switch (msg.body) {
                case '//list':
                    await client.sendMessage(dict)
                    break;
                case '//clear':
                    dict = new Map();
                    break;
                default:
                    if (msg.body.endsWith('@c.us')) {
                        console.log('Deletando contato do... ' + msg.body);
                        if(dict.has(msg.from)){
                            dict.delete(msg.from);
                        }else{
                            console.log('Não existe o contato '+ msg.body);
                        }
                    }
                    break;
            }
        }
        if(dict.has(msg.from)){
                
            switch (dict.get(msg.from)) {
                case 0:
                    console.log('Valor:', dict.get(msg.from));
                    if (msg.body !== null && msg.body === '1' && msg.from.endsWith('@c.us')) {
                        const chat = await msg.getChat();
                        await delay(3000); // Delay de 3 segundos
                        await chat.sendStateTyping(); // Simulando Digitação
                        await delay(3000);
                        await client.sendMessage(msg.from, 'Certo');
                        await delay(2000); 
                        await chat.sendStateTyping(); 
                        await delay(3000);
                        await client.sendMessage(msg.from, 'Na sua impressora tem um adesivo da Digymaq que vai estar com o Número de Série e o Patrimônio. Poderia me informar quais são?');
                        await delay(3000);
                        await chat.sendStateTyping(); 
                        dict.set(msg.from, 1);
                    }

                    if (msg.body !== null && msg.body === '2' && msg.from.endsWith('@c.us')) {
                        const chat = await msg.getChat();
                        await delay(3000); 
                        await chat.sendStateTyping();
                        await delay(3000);
                        await client.sendMessage(msg.from, 'Assuntos sobre impressoras particulares devem ser tratados com este contato:');
                        await delay(3000); 
                        await chat.sendStateTyping();
                        await delay(3000);
                        await client.sendMessage(msg.from, '+55 18 93085-7355');
                        await chat.sendStateTyping();
                        await delay(3000);
                        await client.sendMessage(msg.from, 'Obrigado');
                    }

                    if (msg.body !== null && msg.body === '3' && msg.from.endsWith('@c.us')) {
                        const chat = await msg.getChat();
                        await delay(3000); 
                        await chat.sendStateTyping();
                        await delay(3000);
                        await client.sendMessage(msg.from, 'Assuntos sobre impressoras particulares devem ser tratados com este contato:');
                        await chat.sendStateTyping();
                        await delay(3000);
                        await client.sendMessage(msg.from, '+55 800 366 1212');
                        await chat.sendStateTyping();
                        await delay(3000);
                        await client.sendMessage(msg.from, 'Obrigado');
                        await delay(3000); 
                        await chat.sendStateTyping();
                    }
                    if (msg.body !== null && msg.body === '4' && msg.from.endsWith('@c.us')) {
                        const chat = await msg.getChat();
                        await delay(3000); 
                        await chat.sendStateTyping();
                        await delay(3000);
                        await client.sendMessage(msg.from, 'Informe o motivo do contato, que em breve um dos nossos técnicos vai te atender.');
                        await delay(3000); 
                        await chat.sendStateTyping();
                    }
                    else {
                        const chat = await msg.getChat();
                        await delay(3000); 
                        await chat.sendStateTyping();
                        await delay(3000);
                        await client.sendMessage(msg.from, 'Não entendi, por favor, responda com 1, 2, 3 ou 4. Para que eu possa lhe auxiliar.');
                        await delay(3000); 
                    }
                    break;
                
                case 1:
                    const chat = await msg.getChat();
                    await delay(3000); 
                    await chat.sendStateTyping();
                    await delay(3000);
                    await client.sendMessage(msg.from, 'E qual o problema do equipamento?.');
                    await delay(3000); 
                    break;

                default:

                    console.log('Erro!');
                    break;

            }
        }

        if(dict.has(msg.from) == false){
            console.log('Mensagem inicial')
            await delay(3000);
            await chat.sendStateTyping();
            await delay(3000);
            const contact = await msg.getContact();
            const name = contact.pushname;
            await client.sendMessage(msg.from,'Olá! ' + name.split(" ")[0] + '\nSou o assistente da Digymaq, estou aqui para lhe auxiliar.\n\nAntes de prosseguirmos, eu preciso saber. Sua impressora é:\n\n1 - Alugada com a Digymaq \n2 - Particular \n3 - Toner ou Suprimentos\n4 - Outro Motivo');
            await delay(3000);
            await chat.sendStateTyping(); 
            await delay(5000); 
            dict.set(msg.from, 0);
        }    
    } else {
        console.log('Mensagem de Grupo')
    }








});
