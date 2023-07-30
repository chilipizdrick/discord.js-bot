import { joinVoiceChannel, createAudioPlayer, createAudioResource } from '@discordjs/voice';
import dotenv from 'dotenv';

dotenv.config();

const playAudioFromFile = async (interaction, filePath) => {
	const connectedGuildsIds = Array.from(interaction.client.voice.adapters.keys());
	if (!connectedGuildsIds.includes(process.env.GUILD_ID)) {
		const audioPlayer = createAudioPlayer();

		audioPlayer.on('error', error => {
			console.error(`Error: ${error.message} with resourse.`);
		});

		const resource = createAudioResource(filePath);
		audioPlayer.play(resource);

		const connection = joinVoiceChannel({
			channelId: interaction.member.voice.channelId,
			guildId: interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});

		const subscription = connection.subscribe(audioPlayer);

		if (subscription) {
			audioPlayer.on('stateChange', (oldState, newState) => {
				if (oldState.status === 'playing' && newState.status === 'idle') {
					try {
						subscription.unsubscribe();
						connection.destroy();
					} catch (err) {
						console.error(err);
					}
				}
			});
		}
	} else {
		console.log('Voice client already connected.');
	}
};

export default playAudioFromFile;