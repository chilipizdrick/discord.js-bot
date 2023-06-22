const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('women')
		.setDescription('Plays women.'),
	async execute(interaction) {
        await interaction.reply("Executig the command...");

        const audioPlayer = createAudioPlayer();

        audioPlayer.on("error", error => {
            console.error(`Error: ${error.message} with resourse.`);
        });

        const resource = createAudioResource('assets/audio/women.mp3');
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
                connection.destroy();
            }, 20_000);
        }
        
        await interaction.deleteReply();
	},
};
