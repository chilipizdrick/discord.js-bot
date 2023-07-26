import { Events } from 'discord.js';
import fs from 'node:fs';
import { joinVoiceChannel, createAudioPlayer, createAudioResource } from '@discordjs/voice';
import dotenv from 'dotenv';
const GREETING_FILE_PATH = 'assets/audio/greeting.mp3'

dotenv.config();

const name = Events.VoiceStateUpdate;

const execute = async (oldVoiceState, newVoiceState) => {
    if (newVoiceState.member.id !== newVoiceState.client.user.id
        && oldVoiceState.channel === null && newVoiceState.channel.id === process.env.GREETING_CHANNEL_ID) {
        const greetedMembers = JSON.parse(fs.readFileSync("userdata/greeting-user-data.json"));
        if (!greetedMembers["greetedMembers"].includes(newVoiceState.member.id)) {
            greetedMembers["greetedMembers"].push(newVoiceState.member.id);
            const greetedMembersStr = JSON.stringify(greetedMembers);
            fs.writeFile("userdata/greeting-user-data.json", greetedMembersStr, (error) => {
                if (error) {
                    console.error(error);
                }
            });

            const audioPlayer = createAudioPlayer();

            audioPlayer.on("error", error => {
                console.error(`Error: ${error.message} with resourse.`);
            });

            const resource = createAudioResource(GREETING_FILE_PATH);
            audioPlayer.play(resource);

            const connection = joinVoiceChannel({
                channelId: newVoiceState.channel.id,
                guildId: newVoiceState.guild.id,
                adapterCreator: newVoiceState.guild.voiceAdapterCreator
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
        }
    }
}

export { name, execute };