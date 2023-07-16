import { SlashCommandBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
	.setName('dogovor')
	.setDescription('Replies with dogovor.');

const execute = async (interaction) => {
	await interaction.reply('Dogovor!');
}

export { data, execute };