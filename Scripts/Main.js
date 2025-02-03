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
    console.log('Chego mensagi!')
    const chat = await msg.getChat();

    if(dict.has(msg.from) && msg.from.length < 19){
            
        switch (dict.get(msg.from)) {
            case 0: 
                console.log('Valor:', dict.get(msg.from));
                if (msg.body !== null && msg.body === '1' && msg.from.endsWith('@c.us')) {
                    const chat = await msg.getChat();
                    await delay(3000);
                    await chat.sendStateTyping(); 
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
                }

                if (msg.body !== null && msg.body === '3' && msg.from.endsWith('@c.us')) {
                    const chat = await msg.getChat();
                    await delay(3000); 
                    await chat.sendStateTyping(); 
                    await delay(3000);
                    await client.sendMessage(msg.from, 'Informe o motivo do contato, que em breve um dos nossos técnicos vai te atender.');
                    await delay(3000); 
                    await chat.sendStateTyping(); 
                    dict.set(msg.from, 1);
                }
                else {
                    const chat = await msg.getChat();
                    await delay(3000); 
                    await chat.sendStateTyping(); 
                    await delay(3000);
                    await client.sendMessage(msg.from, 'Não entendi, por favor, responda com 1, 2 ou 3. Para que eu possa lhe auxiliar.');
                    await delay(3000); 
                }
                break;
            
            case 1:
                
                break;

            default:

                console.log('Erro!');
                break;

        }
    }
    console.log('Passamo do primeiro if!')
    console.log(msg.from.length)
    if (msg.from == '5518997072992@c.us') {
        console.log('é dento')
        const chat = await msg.getChat();
        let button = new Buttons('Button body',[{body:'bt1'},{body:'bt2'},{body:'bt3'}],'title','footer');
        client.sendMessage(msg.from, button);
    }


    if(dict.has(msg.from) == false && msg.from.length < 19){
        console.log('Mensagem inicial')
        await delay(3000); 
        await chat.sendStateTyping(); 
        await delay(3000); 
        const contact = await msg.getContact();
        const name = contact.pushname; 
        await client.sendMessage(msg.from,'Olá! '+ name.split(" ")[0] + 'Sou o assistente virtual da empresa tal. Como posso ajudá-lo hoje? Por favor, digite uma das opções abaixo:\n\n1 - Como funciona\n2 - Valores dos planos\n3 - Benefícios\n4 - Como aderir\n5 - Outras perguntas'); 
        await delay(3000); 
        await chat.sendStateTyping(); 
        await delay(5000); 
        dict.set(msg.from, 0);
    }    








});
