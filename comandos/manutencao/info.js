const fs = require('fs')
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { emojis, emojis_dancantes } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('⌠📡⌡ Alonsal information')
        .setDescriptionLocalizations({
            "pt-BR": '⌠📡⌡ Informações do Alonsal',
            "es-ES": '⌠📡⌡ Información Alonsal',
            "fr": '⌠📡⌡ Informations sur le Alonsal',
            "it": '⌠📡⌡ Informazioni Alonsal'
        }),
    async execute(client, user, interaction) {

        let qtd_comandos = 1

        fs.readFile('./arquivos/data/ativacoes.txt', 'utf8', function (err, data) {
            if (err) throw err

            qtd_comandos += parseInt(data)

            const embed = new EmbedBuilder()
                .setTitle(client.tls.phrase(user, "manu.info.infos"))
                .setColor(client.embed_color(user.misc.color))
                .setThumbnail("https://scontent-gru1-2.xx.fbcdn.net/v/t1.6435-9/34582820_1731681436946171_4012652554398728192_n.png?_nc_cat=103&ccb=1-3&_nc_sid=973b4a&_nc_ohc=2pQUpS4JYesAX-tblT6&_nc_ht=scontent-gru1-2.xx&oh=cd477beb31450446556e04001525ece6&oe=60D1FE58")
                .setDescription(`${client.tls.phrase(user, "manu.info.conteudo_1")}\n${client.emoji(emojis.dancando_elizabeth)} ${client.tls.phrase(user, "manu.info.conteudo_2")}\n${client.emoji(emojis.mc_bolo)} ${client.tls.phrase(user, "manu.info.conteudo_3")}\n\n${client.tls.phrase(user, "manu.info.invocado_1")} \`${qtd_comandos.toLocaleString('pt-BR')}\` ${client.tls.phrase(user, "manu.info.invocado_2")} ${client.emoji(emojis_dancantes)}\n[ _${client.tls.phrase(user, "manu.info.versao")} ${process.env.version}_ ]\n\n${client.tls.phrase(user, "manu.info.spawn_alonsal")} <t:1618756500>`)
                .setFooter({ text: "Alonsal", iconURL: "https://i.imgur.com/K61ShGX.png" })

            interaction.reply({ embeds: [embed], ephemeral: true })
        })
    }
}