const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ege')
        .setDescription('Get ege results.'),
    async execute(interaction) {
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