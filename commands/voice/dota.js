import { SlashCommandBuilder } from 'discord.js';
import playAudioFromFile from '../../utils/playAudioFromFile.js';
import fs from 'node:fs';
const FILES_DIR = "assets/audio/dota";

const data = new SlashCommandBuilder()
    .setName('dota')
    .setDescription('Plays dota.');

const execute = async (interaction) => {
	await interaction.deferReply();
	
	const audioFiles = fs.readdirSync(FILES_DIR);
	let pathsList = [];
	audioFiles.forEach(filename => pathsList.push(`${FILES_DIR}/${filename}`));
	const randFile = pathsList[Math.floor(Math.random() * pathsList.length)];

	playAudioFromFile(interaction, randFile);
	
	await interaction.deleteReply();
}

export { data, execute };