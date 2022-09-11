const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('anagram')
        .setNameLocalizations({
            "pt-BR": 'anagrama',
            "fr": 'anagramme'
        })
		.setDescription('⌠😂⌡ Generates anagrams based on input')
        .setDescriptionLocalizations({
            "pt-BR": '⌠😂⌡ Gera anagramas com base na entrada',
            "fr": '⌠😂⌡ Génère des anagrammes basés sur l\'entrée'
        })
        .addStringOption(option =>
            option.setName('text')
                .setNameLocalizations({
                    "pt-BR": 'texto',
                    "fr": 'texte'
                })
                .setDescription('Write something!')
                .setDescriptionLocalizations({
                    "pt-BR": 'Escreva algo!',
                    "fr": 'Écris quelque chose!'
                })
                .setRequired(true)),
	async execute(client, interaction) {
        
        const { diversao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)

        const texto_entrada = interaction.options.data[0].value
        let cor_embed = 0x29BB8E

        function duplicateCount(texto_entrada) {
            const charMap = {}

            for (const char of texto_entrada.toLowerCase()) {
                charMap[char] = (charMap[char] || 0) + 1
            }

            return Object.values(charMap).filter((count) => count > 0)
        }

        const caracteres = duplicateCount(texto_entrada)
        const fatori = texto_entrada.split('')
        const fatori_fix = fatori
        let mult = 1, rept = 1

        for (let i = 1; i < fatori.length + 1; i++) {
            mult *= i
        }

        for (let i = 0; i < caracteres.length; i++) {
            let fatorial = 1

            if (caracteres[i] > 1) {
                for (let x = 1; x <= caracteres[i]; x++) {
                    fatorial *= x
                }

                rept *= fatorial
            }
        }

        let result = mult

        if (rept > 1)
            result /= rept

        const anagrama_formado = []
        let exib_formatado = "", qtd_quebras = []
        const repeticoes = result > 3 ? 3 : result
        const combinacoes = result > 3 ? diversao[5]["combinacoes"] : diversao[5]["combinacao"]

        for (let i = 0; i < repeticoes; i++) {
            anagrama_formado.push(await shuffleArray(fatori_fix).join(''))

            exib_formatado += `**-** \`${anagrama_formado[i]}\`\n`
            qtd_quebras = exib_formatado.split(anagrama_formado[i])

            if (qtd_quebras.length > 2 && fatori_fix.length > 4)
                cor_embed = 0xfbff3d
        }

        if (cor_embed === 0xfbff3d)
            exib_formatado += `\n:four_leaf_clover: | _${diversao[5]["sorte"]}_`

        const anagrama = new EmbedBuilder()
        .setTitle(`:abc: ${diversao[5]["anagrama"]}`)
        .setColor(cor_embed)
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) })
        .setDescription(`${diversao[5]["entrada"]}: \`${texto_entrada}\`\n${diversao[5]["lista_combinacoes"]}:\n${exib_formatado}`)
        .setFooter({ text: `${diversao[5]["sequencia"]} ${result.toLocaleString('pt-BR')} ${combinacoes}` })
        
		return interaction.reply({ embeds: [anagrama] })
	}
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    
    return arr
}