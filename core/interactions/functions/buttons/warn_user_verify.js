const { EmbedBuilder } = require("discord.js")

const { getUserWarn, removeUserWarn, listAllUserWarns } = require("../../../database/schemas/Warns")

module.exports = async ({ client, user, interaction, dados }) => {

    const escolha = parseInt(dados.split(".")[1])

    const id_alvo = dados.split(".")[2]
    const timestamp = parseInt(dados.split(".")[3])

    // Tratamento dos cliques
    // 0 -> Cancela
    // 3 -> Menu com escolha para exclusão ou não
    // 2 -> Acesso aos botões deste paínel

    // 9 -> Sub guia com os detalhes da advertência escolhida

    if (escolha === 1) {

        const row = [], user_warns = await listAllUserWarns(id_alvo, interaction.guild.id)

        // Removendo a advertência do usuário e verificando os cargos do mesmo
        await removeUserWarn(id_alvo, interaction.guild.id, timestamp)
        client.verifyUserWarnRoles(id_alvo, interaction.guild.id)

        if (user_warns.length - 1 > 0)
            row.push({ id: "panel_guild_browse_warns", name: "Remover outras", type: 0, emoji: client.emoji(41), data: `0|${id_alvo}` },)

        const obj = {
            content: "✅ | Advertência removida com sucesso!",
            embeds: [],
            components: [],
            ephemeral: true
        }

        if (row.length > 0) // Botão para ver outras advertências
            obj.components = [client.create_buttons(row, interaction)]

        const guild = await client.getGuild(interaction.guild.id)

        if (guild.warn.notify_exclusion) { // Embed de aviso que o membro teve uma advertência apagada

            let warns_restantes = `\nO usuário agora possui outras \`${user_warns.length - 1} advertências\` ativas neste servidor`

            if ((user_warns.length - 1) === 1)
                warns_restantes = `\nO usuário possui apenas outra \`1 advertência\` ativa neste servidor`

            const embed = new EmbedBuilder()
                .setTitle(`> Uma Advertência foi removida! :inbox_tray:`)
                .setColor(0xED4245)
                .setDescription(`Uma advertência de <@${id_alvo}> foi removida!${warns_restantes}`)
                .addFields(
                    {
                        name: `:bust_in_silhouette: **${client.tls.phrase(user, "mode.report.usuario")}**`,
                        value: `${client.emoji("icon_id")} \`${id_alvo}\`\n\`${user_warns[0].nick}\`\n( <@${id_alvo}> )`,
                        inline: true
                    },
                    {
                        name: `${client.defaultEmoji("guard")} **Moderador responsável**`,
                        value: `${client.emoji("icon_id")} \`${interaction.user.id}\`\n\`${interaction.user.username}\`\n( <@${interaction.user.id}> )`,
                        inline: true
                    }
                )
                .setTimestamp()

            client.notify(guild.warn.channel, {
                content: guild.warn.notify ? "@here" : "", // Servidor com ping de advertência ativo
                embeds: [embed]
            })
        }

        return client.reply(interaction, obj)
    }

    if (escolha === 3) {

        // Criando os botões para o menu de remoção de strikes
        const row = client.create_buttons([
            { id: "warn_user_verify", name: client.tls.phrase(user, "menu.botoes.confirmar"), type: 2, emoji: client.emoji(10), data: `1|${id_alvo}.${timestamp}` },
            { id: "warn_user_verify", name: client.tls.phrase(user, "menu.botoes.cancelar"), type: 3, emoji: client.emoji(0), data: `9|${id_alvo}.${timestamp}` }
        ], interaction)

        // Listando os botões para confirmar e cancelar a operação
        return interaction.update({
            components: [row]
        })
    }

    if (escolha === 9) {

        const user_warn = await getUserWarn(id_alvo, interaction.guild.id, timestamp)
        let motivo_remocao = ""

        if (interaction.options?.getString("reason"))
            motivo_remocao = `\`\`\`👨‍⚖️ | Motivo para remoção:\n\n${interaction.options?.getString("reason")}\`\`\``

        // Exibindo os detalhes da advertência escolhida
        const embed = new EmbedBuilder()
            .setTitle(`Verificando advertência :inbox_tray:`)
            .setColor(client.embed_color(user.misc.color))
            .setDescription(`\`\`\`fix\n📠 | Descrição fornecida:\n\n${user_warn.relatory}\`\`\`\n${motivo_remocao}`)
            .addFields(
                {
                    name: `${client.defaultEmoji("person")} **Membro**`,
                    value: `${client.emoji("icon_id")} \`${id_alvo}\`\n\`${user_warn.nick || "Sem nome"}\`\n( <@${id_alvo}> )`,
                    inline: true
                },
                {
                    name: `${client.defaultEmoji("guard")} **Moderador**`,
                    value: `${client.emoji("icon_id")} \`${user_warn.assigner}\`\n\`${user_warn.assigner_nick || "Sem nome"}\`\n( <@${user_warn.assigner}> )`,
                    inline: true
                },
                {
                    name: `${client.emoji("time")} **Aplicado <t:${user_warn.timestamp}:R>**`,
                    value: `<t:${user_warn.timestamp}:f>`,
                    inline: true
                }
            )
            .setFooter({
                text: "Escolha as opções abaixo para gerenciar essa advertência",
                iconURL: interaction.user.avatarURL({ dynamic: true })
            })

        const botoes = [
            { id: "warn_user_verify", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: `0|${id_alvo}.${timestamp}` },
            { id: "warn_user_verify", name: "Remover advertência", type: 1, emoji: client.emoji(13), data: `3.${id_alvo}.${timestamp}` }
        ]

        return interaction.update({
            embeds: [embed],
            components: [client.create_buttons(botoes, interaction)],
            ephemeral: true
        })
    }

    dados = { id: id_alvo }
    require('../../chunks/panel_guild_browse_warns')({ client, user, interaction, dados })
}