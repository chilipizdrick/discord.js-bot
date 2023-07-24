import { joinVoiceChannel, createAudioPlayer, createAudioResource } from '@discordjs/voice';
import getDurationOfAudioFile from './getDurationOfAudioFile.js';
import dotenv from 'dotenv';

dotenv.config();

const playAudioFromFile = async (interaction, filePath) => {
    const connectedGuildsIds = Array.from(interaction.client.voice.adapters.keys());
    if (!connectedGuildsIds.includes(process.env.GUILD_ID)) {
        const audioPlayer = createAudioPlayer();

        audioPlayer.on("error", error => {
            console.error(`Error: ${error.message} with resourse.`);
        });

        const resource = createAudioResource(filePath);
        audioPlayer.play(resource);

        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channelId,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator
        });

        const subscription = connection.subscribe(audioPlayer);

        if (subscription) {
            try {
                setTimeout(() => {
                    subscription.unsubscribe();
                    connection.destroy();
                }, await getDurationOfAudioFile(filePath));
            } catch (error) {
                console.error(error);
            }
        }
    } else {
        console.log('Voice client already connected.');
    }

}

export default playAudioFromFile;