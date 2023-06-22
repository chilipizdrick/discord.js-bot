import { SlashCommandBuilder } from 'discord.js';
import { joinVoiceChannel, createAudioPlayer, createAudioResource } from '@discordjs/voice';
import fs from 'node:fs';
const FILES_DIR = "assets/audio/dota";

const data = new SlashCommandBuilder()
    .setName('dota')
    .setDescription('Plays dota.');

async function execute(interaction) {
	await interaction.reply("Executig the command...");
	
	const audioFiles = fs.readdirSync(FILES_DIR);
	let pathsList = [];
	audioFiles.forEach(filename => pathsList.push(`${FILES_DIR}/${filename}`));
	const randFile = pathsList[Math.floor(Math.random() * pathsList.length)];
	
	const audioPlayer = createAudioPlayer();
	
	audioPlayer.on("error", error => {
		console.error(`Error: ${error.message} with resourse.`);
	});
	
	const resource = createAudioResource(randFile);
	audioPlayer.play(resource);
	
	const connection = joinVoiceChannel({
		channelId: interaction.member.voice.channelId,
		guildId: interaction.guild.id,
		adapterCreator: interaction.guild.voiceAdapterCreator
	});
	
	const subscription = connection.subscribe(audioPlayer);
	
	if (subscription) {
		setTimeout(() => {
			subscription.unsubscribe();
			try {
				connection.destroy();
			}
			catch (e) {
				console.error(e);
			}
		}, 20_000);
	}
	
	await interaction.deleteReply();
}

export { data, execute };