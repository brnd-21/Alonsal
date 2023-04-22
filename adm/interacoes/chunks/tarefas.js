const { listAllUserTasks, listAllUserGroupTasks } = require('../../database/schemas/Task')

module.exports = async ({ client, user, interaction, operador }) => {

    if (!operador.includes("x")) {

        const casos = {
            aberto: 0,
            finalizado: 0
        }

        let tarefas

        // Verificando se o usuário desabilitou as tasks globais
        if (client.decider(user?.conf.global_tasks, 1))
            tarefas = await listAllUserTasks(interaction.user.id)
        else
            tarefas = await listAllUserTasks(interaction.user.id, interaction.guild.id)

        // Validando se há tasks registradas para o usuário
        if (tarefas.length < 1)
            return client.tls.reply(interaction, user, "util.tarefas.sem_tarefa", true, 0)

        for (let i = 0; i < tarefas.length; i++) {
            if (tarefas[i].concluded)
                casos.finalizado++
            else
                casos.aberto++
        }

        if (operador === "a") {
            // Tarefas abertas
            if (casos.aberto < 1)
                return client.tls.reply(interaction, user, "util.tarefas.sem_tarefa_a", true, 0)

            const data = {
                alvo: "tarefas",
                values: filtra_tarefas(tarefas, 0),
                operador: operador
            }

            interaction.reply({ content: client.tls.phrase(user, "util.tarefas.tarefa_escolher", 1), components: [client.create_menus(client, interaction, user, data)], ephemeral: client.decider(user?.conf.ghost_mode, 0), embeds: [] })
        }

        if (operador === "f") {
            // Tarefas finalizadas
            if (casos.finalizado < 1)
                return client.tls.reply(interaction, user, "util.tarefas.sem_tarefa_f", true, 0)

            const data = {
                alvo: "tarefas",
                values: filtra_tarefas(tarefas, 1),
                operador: "f"
            }

            interaction.reply({ content: client.tls.phrase(user, "util.tarefas.tarefa_escolher", 1), components: [client.create_menus(client, interaction, user, data)], ephemeral: client.decider(user?.conf.ghost_mode, 0), embeds: [] })
        }
    } else {

        const lista_timestamp = parseInt(operador.split("|")[1])

        // Retornando o usuário para a lista escolhida anteriormente
        const tarefas = await listAllUserGroupTasks(interaction.user.id, lista_timestamp)

        if (tarefas.length < 1)
            return client.tls.reply(interaction, user, "util.tarefas.sem_tarefa_l", client.decider(user?.conf.ghost_mode, 0), 1)

        const data = {
            alvo: "tarefa_visualizar",
            values: tarefas,
            operador: `x.${lista_timestamp}`
        }

        const row = client.create_buttons([{ id: "return_button", name: 'Retornar', value: '1', type: 0, data: `listas_navegar` }], interaction)

        interaction.update({ content: client.tls.phrase(user, "util.tarefas.tarefa_escolher", 1), components: [client.create_menus(client, interaction, user, data), row], ephemeral: client.decider(user?.conf.ghost_mode, 0), embeds: [] })
    }
}

function filtra_tarefas(tarefas, caso) {

    const array = []

    // Filtrando o array para o estado de conclusão
    for (let i = 0; i < tarefas.length; i++)
        if (tarefas[i].concluded == caso)
            array.push(tarefas[i])

    return array
}