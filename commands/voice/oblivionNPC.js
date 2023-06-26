import { SlashCommandBuilder } from 'discord.js';
import playAudioFromFile from '../../utils/playAudioFromFile.js';

const data = new SlashCommandBuilder()
.setName('oblivion')
.setDescription('Plays Oblivion NPC theme.');

const execute = async (interaction) => {
    await interaction.deferReply();
    try {
		playAudioFromFile(interaction, 'assets/audio/oblivion.mp3');
		await interaction.deleteReply();
	} catch (error) {
		interaction.editReply('Caught error while executing the commnad. Try again.');
		console.log(error);
	}
}

export { data, execute };