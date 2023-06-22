const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ege')
        .setDescription('Get ege results.'),
    async execute(interaction) {

        const Http = new XMLHttpRequest();
        const url = 'https://checkege.rustest.ru';
        Http.open("GET", url);
        Http.send();

        Http.onreadystatechange = (e) => {
            if (this.readyState === 4 && this.status === 200) {
                console.log(Http.responseText)
            }
        }

        let egePoints = {
            "profMath": 23,
            "rusLang": 34
        };
        let message = "";
        for (let key in egePoints) {
            message += `${key}: ${egePoints[key]}\n`
        }
        await interaction.reply(message);
    }
}