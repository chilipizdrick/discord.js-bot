import { joinVoiceChannel, createAudioPlayer, createAudioResource } from '@discordjs/voice';

const playAudioFromFile = (interaction, filePath) => {
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
            }, 25_000);
        } catch (error) {
            console.error(error);
        }
    }
}

export default playAudioFromFile;