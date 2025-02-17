var dict = new Map();
// leitor de qr code
const qrcode = require('qrcode-terminal');
const { Client, Buttons, List, MessageMedia } = require('whatsapp-web.js'); // Mudança Buttons
const client = new Client();
require('dotenv').config();
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
        //Se estiver dentro do horario e data
        if(isBusinessHours()){
            if (msg.from == process.env.COFFEEBREAK_PHONE) {
                console.log('Coffee Break...')
                const chat = await msg.getChat();
                const contact = await msg.getContact();
                const name = contact.pushname;

                switch (msg.body) {
                    case '//list':
                        await client.sendMessage(dict);
                        break;
                    case '//clear':
                        dict = new Map();
                        break;
                    default:
                        if (msg.body.endsWith('@c.us')) {
                            console.log('Deletando contato do... ' + msg.body);
                            if(dict.has(msg.body)){
                                dict.delete(msg.body);
                            }else{
                                console.log('Não existe o contato '+ msg.body);
                            }
                        }
                        break;
                }
            }else if(dict.has(msg.from)){
                    
                switch (dict.get(msg.from)) {
                    case 0:
                        console.log('Valor:', dict.get(msg.from));
                        
                        const chat = await msg.getChat();
                        switch (msg.body) {
                            case '1':
                                fakeTyping();
                                await client.sendMessage(msg.from, 'Certo');
                                fakeTyping();
                                await client.sendMessage(msg.from, 'Na sua impressora tem um adesivo da Digymaq que vai estar com o Número de Série e o Patrimônio. Poderia me informar quais são?');
                                fakeTyping();
                                dict.set(msg.from, 1);
                                break;

                            case '2':
                                fakeTyping();
                                await client.sendMessage(msg.from, 'Assuntos sobre impressoras particulares devem ser tratados com este contato:');
                                fakeTyping();
                                await client.sendMessage(msg.from, '+55 18 93085-7355');
                                fakeTyping();
                                await client.sendMessage(msg.from, 'Obrigado');
                                dict.set(msg.from, 2);
                                break;

                            case '3':
                                fakeTyping();
                                await client.sendMessage(msg.from, 'Assuntos sobre impressoras particulares devem ser tratados com este contato:');
                                fakeTyping();
                                await client.sendMessage(msg.from, '+55 800 366 1212');
                                fakeTyping();
                                await client.sendMessage(msg.from, 'Obrigado');
                                fakeTyping();
                                dict.set(msg.from, 2);
                                break;
                            case '4':
                                    fakeTyping();
                                    await client.sendMessage(msg.from, 'Informe o motivo do contato, que em breve um dos nossos técnicos vai te atender.');
                                    fakeTyping();
                                    dict.set(msg.from, 2);
                                    break;
                        
                            default:
                                const chat = await msg.getChat();
                                fakeTyping();
                                await client.sendMessage(msg.from, 'Não entendi, por favor, responda com 1, 2, 3 ou 4. Para que eu possa lhe auxiliar.');
                                await delay(3000); 
                                break;
                        }
                        break;
                    case 1:
                        
                        await client.sendMessage(msg.from, 'E qual o problema do equipamento?.');
                        await delay(3000); 
                        dict.set(msg.from, 2);
                        break;
                    
                    case 2:
                        break;

                    default:
                        console.log('Erro!');
                        break;

                }
            }else{
                console.log('Mensagem inicial')
                fakeTyping();
                const contact = await msg.getContact();
                const name = contact.pushname;
                await client.sendMessage(msg.from,'Olá! ' + name.split(" ")[0] + '\nSou o assistente da Digymaq, estou aqui para lhe auxiliar.\n\nAntes de prosseguirmos, eu preciso saber. Sua impressora é:\n\n1 - Alugada com a Digymaq \n2 - Particular \n3 - Toner ou Suprimentos\n4 - Outro Motivo');
                fakeTyping(); 
                dict.set(msg.from, 0);
            }
        }else{
            console.log('Não está no horario e data')
            
            const contact = await msg.getContact();
            const name = contact.pushname;
            await client.sendMessage('Olá! ' + name.split(" ")[0] + '\nNo momento não estamos trabalhando. Nosso horário é de segunda a sexta-feira, das 8h às 18h. Por favor, entre em contato novamente durante nosso horário comercial ou aguarde que em breve nosso Suporte Técnico vai entrar em contato.');
        }
    } else {
        console.log('Mensagem de Grupo')
    }








});

async function fakeTyping() {
    await delay(3000); 
    await chat.sendStateTyping();
    await delay(3000);
}

function isBusinessHours(){
    const now = new Date();
    var day = now.getDay();
    var hour = now.getHours();
    
    return day >= 1 && day <= 5 && hour >= 8 && hour < 18;
};