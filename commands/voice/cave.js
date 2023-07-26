import { SlashCommandBuilder } from 'discord.js';
import playAudioFromFile from '../../utils/playAudioFromFile.js';
import fs from 'node:fs';
const FILES_DIR = "assets/audio/cave_sounds";

const data = new SlashCommandBuilder()
    .setName('cave')
    .setDescription('Plays random minecraft cave sound.');

const execute = async (interaction) => {
	await interaction.deferReply();
	
	const audioFiles = fs.readdirSync(FILES_DIR);
	let pathsList = [];
	audioFiles.forEach(filename => pathsList.push(`${FILES_DIR}/${filename}`));
	const randFile = pathsList[Math.floor(Math.random() * pathsList.length)];

	try {
		await playAudioFromFile(interaction, randFile);
		await interaction.deleteReply();
	} catch (error) {
		interaction.editReply('Caught error while executing the commnad. Try again.');
		console.log(error);
	}
}

export { data, execute };