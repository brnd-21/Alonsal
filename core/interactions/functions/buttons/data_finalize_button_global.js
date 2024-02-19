const { atualiza_user_eraser } = require("../../../auto/user_eraser")

module.exports = async ({ client, user, interaction, dados }) => {

    let operacao = parseInt(dados.split(".")[2])

    // Botão de cancelar
    if (parseInt(dados.split(".")[1]) === 0)
        operacao = 0

    // Códigos de operação
    // 0 -> Botão cancelar / Botão errado
    // 1 -> Confirmando a exclusão

    if (operacao === 0)
        return interaction.update({
            content: client.tls.phrase(user, "manu.data.operacao_cancelada", 11),
            components: [],
            ephemeral: true
        })

    // Movendo o usuário para exclusão automática
    user.erase.erase_on = client.timestamp()
    user.erase.forced = true

    await user.save()

    // Atualizando a lista de usuários que estão expirando
    atualiza_user_eraser(client)

    client.reply(interaction, {
        content: `${client.emoji(7)} | Os seus dados foram marcados para exclusão <t:${client.timestamp() + 1209600}:R>\n\nAté lá, você será ignorado no ranking de XP do Alonsal, caso deseje manter os dados, você deverá usar novamente um comando antes do tempo expirar.`,
        components: [],
        ephemeral: true
    })
}