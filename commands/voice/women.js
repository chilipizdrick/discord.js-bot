import { SlashCommandBuilder } from 'discord.js';
import playAudioFromFile from '../../utils/playAudioFromFile.js';
import pickRandomFileFromDirectory from '../../utils/pickRandomFileFromDirectory.js';

const FILES_DIR = 'assets/audio/voice_commands/women';

const data = new SlashCommandBuilder()
	.setName('women')
	.setDescription('Plays women.');

const execute = async (interaction) => {
	await interaction.deferReply();
	try {
		const randFile = pickRandomFileFromDirectory(FILES_DIR);
		await playAudioFromFile(interaction, randFile);
		await interaction.deleteReply();
	} catch (error) {
		interaction.editReply('Caught error while executing the commnad. Try again.');
		console.log(error);
	}
};

export { data, execute };