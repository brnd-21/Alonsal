const { dropTask, getTask } = require('../../../database/schemas/Task')
const { listAllUserGroups } = require('../../../database/schemas/Task_group')

module.exports = async ({ client, user, interaction, dados }) => {

    // Gerenciamento de anotações
    const operacao = parseInt(dados.split(".")[1])
    const timestamp = parseInt(dados.split(".")[2])

    // Códigos de operação
    // 0 -> Apagar
    // 1 -> Finalizar tarefa
    // 2 -> Alterar de lista
    // 3 -> Reabrir tarefa

    if (operacao === 2) {

        let listas

        // Verificando se o usuário desabilitou as tasks globais
        if (client.decider(user?.conf.global_tasks, 1))
            listas = await listAllUserGroups(interaction.user.id)
        else
            listas = await listAllUserGroups(interaction.user.id, interaction.guild.id)

        const data = {
            alvo: "listas",
            values: listas,
            timestamp: timestamp
        }

        return interaction.update({ content: ":mag: | Escolha uma das listas abaixo para adicionar esta tarefa.", components: [client.create_menus(client, interaction, user, data)], embeds: [], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
    }

    if (operacao === 0) {
        await dropTask(interaction.user.id, timestamp)

        return interaction.update({ content: ":white_check_mark: | Sua tarefa foi excluída com sucesso!", embeds: [], components: [], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
    }

    if (operacao === 1) {

        const task = await getTask(interaction.user.id, timestamp)

        // Verificando se a task não possui algum servidor mencionado
        if (!task.sid)
            task.sid = interaction.guild.id

        task.concluded = true
        task.save()

        return interaction.update({ content: ":white_check_mark: | Sua tarefa foi movida para as notas concluídas!", embeds: [], components: [], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
    }

    if (operacao === 3) {

        const task = await getTask(interaction.user.id, timestamp)

        // Verificando se a task não possui algum servidor mencionado
        if (!task.sid)
            task.sid = interaction.guild.id

        task.concluded = false
        task.save()

        return interaction.update({ content: ":white_check_mark: | Sua tarefa foi movida para as notas em aberto novamente!", embeds: [], components: [], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
    }
}