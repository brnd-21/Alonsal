module.exports = {
    name: "baidu",
    description: "Louvado seja!",
    aliases: [ "du" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const { MessageAttachment } = require('discord.js');
        
        const baidu = new MessageAttachment('arquivos/img/baidu.png');
        message.channel.send(`${message.author} Louvado seja!!`, baidu);
    }
};