import { Events } from 'discord.js';
import fs from 'node:fs';
import { joinVoiceChannel, createAudioPlayer, createAudioResource } from '@discordjs/voice';
import dotenv from 'dotenv';
import pickRandomFileFromDirectory from '../utils/pickRandomFileFromDirectory.js';

const GREETING_FILE_PATH = 'assets/audio/greeting.mp3';
const GREETED_USERS_PATH = 'userdata/greeting-user-data.json';
const BIRTHDAY_DIR_PATH = 'assets/audio/birthday';
const BIRTHDAY_USERS_PATH = 'userdata/birthday-user-data.json';


dotenv.config();

const name = Events.VoiceStateUpdate;

const execute = async (oldVoiceState, newVoiceState) => {
	await greetingOnConnect(oldVoiceState, newVoiceState);
	await birthdayOnConnect(oldVoiceState, newVoiceState);
};

const greetingOnConnect = async (oldVoiceState, newVoiceState) => {
	if (newVoiceState.member.id !== newVoiceState.client.user.id
		&& oldVoiceState.channel === null && newVoiceState.channel.id === process.env.GREETING_CHANNEL_ID) {

		const greetedMembers = JSON.parse(fs.readFileSync(GREETED_USERS_PATH));
		if (greetedMembers['greetedMembers'].includes(newVoiceState.member.id)) {
			return;
		}

		greetedMembers['greetedMembers'].push(newVoiceState.member.id);
		const greetedMembersStr = JSON.stringify(greetedMembers);
		fs.writeFile(GREETED_USERS_PATH, greetedMembersStr, (error) => {
			if (error) {
				console.error(error);
			}
		});

		voiceStatePlayAudioFromFile(newVoiceState, GREETING_FILE_PATH);
	}
};

const birthdayOnConnect = async (oldVoiceState, newVoiceState) => {
	if (newVoiceState.member.id !== newVoiceState.client.user.id
		&& oldVoiceState.channel === null) {

		const birthdayMembers = JSON.parse(fs.readFileSync(BIRTHDAY_USERS_PATH));
		const memberId = newVoiceState.member.id;

		if (!Object.keys(birthdayMembers).includes(memberId)) {
			return;
		}

		const timestamp = new Date();
		const currnetYear = timestamp.getFullYear().toString();
		const currentDate = `${(timestamp.getMonth() + 1).toString()}/${timestamp.getDate()}`;

		if (birthdayMembers[memberId]['birthday'] !== currentDate ||
			birthdayMembers[memberId]['years'].includes(currnetYear)) {
			return;
		}

		birthdayMembers[memberId]['years'].push(currnetYear);
		const birthdayMembersStr = JSON.stringify(birthdayMembers);
		fs.writeFile(BIRTHDAY_USERS_PATH, birthdayMembersStr, (error) => {
			if (error) {
				console.error(error);
			}
		});

		const randAudioFile = pickRandomFileFromDirectory(BIRTHDAY_DIR_PATH);
		voiceStatePlayAudioFromFile(newVoiceState, randAudioFile);
	}
};

const voiceStatePlayAudioFromFile = async (voiceState, filepath) => {
	const audioPlayer = createAudioPlayer();
	audioPlayer.on('error', err => {
		console.error(`Error: ${err.message} with resourse.`);
	});
	const resource = createAudioResource(filepath);
	audioPlayer.play(resource);
	const connection = joinVoiceChannel({
		channelId: voiceState.channel.id,
		guildId: voiceState.guild.id,
		adapterCreator: voiceState.guild.voiceAdapterCreator,
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
};

export { name, execute };