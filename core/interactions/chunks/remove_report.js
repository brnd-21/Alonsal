const { checkUserGuildReported } = require("../../database/schemas/Report")

const menu_navigation = require("../../functions/menu_navigation")

module.exports = async ({ client, user, interaction, pagina }) => {

    const reportes_guild = await checkUserGuildReported(interaction.guild.id)

    if (reportes_guild.length < 1)
        return interaction.reply({ content: ":mag: | Este servidor não possui nenhum reporte registraod!", ephemeral: true })

    // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
    if (reportes_guild.length < pagina * 24)
        pagina = pagina--

    const data = {
        alvo: "remove_report",
        values: reportes_guild
    }

    const obj = {
        content: "Escolha um usuário abaixo para poder gerenciar",
        embeds: [],
        components: [client.create_menus(client, interaction, user, data, pagina || 0)],
        ephemeral: true
    }

    let row = menu_navigation(client, interaction, reportes_guild, "remove_report_navegar", pagina || 0)

    if (row) // Botões de navegação
        obj.components.push(row)

    if (!interaction.customId)
        interaction.reply(obj)
    else
        interaction.update(obj)
}