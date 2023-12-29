import fs from 'node:fs';

const VOICE_COMMAND_DIR = 'commands/voice/';
const CONFIG_FILE = 'voice-commands.json';


const generateVoiceCommands = () => {
	try {
		const voiceCommands = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
		const voiceCommandList = voiceCommands['commands'];

		if (!fs.existsSync(VOICE_COMMAND_DIR)) {
			fs.mkdirSync(VOICE_COMMAND_DIR);
		}

		for (const voiceCommand of voiceCommandList) {
			createVoiceCommand(voiceCommand);
		}
	} catch (err) {
		console.error('Could not generate voice commands.');
		throw new Error(err);
	}
};

const createVoiceCommand = (voiceCommand) => {
	const { name, description } = voiceCommand;
	const content = `import { SlashCommandBuilder } from 'discord.js';
import playAudioFromFile from '../../utils/playAudioFromFile.js';
import pickRandomFileFromDirectory from '../../utils/pickRandomFileFromDirectory.js';
const FILES_DIR = 'assets/audio/voice_commands/${name}';
const data = new SlashCommandBuilder()
	.setName('${name}')
	.setDescription('${description}');
const execute = async (interaction) => {
	await interaction.deferReply();
	const randFile = pickRandomFileFromDirectory(FILES_DIR);
	try {
		await playAudioFromFile(interaction, randFile);
		await interaction.deleteReply();
	} catch (error) {
		interaction.editReply('Caught error while executing the commnad. Try again.');
		console.log(error);
	}
};
export { data, execute };`;
	fs.writeFileSync(`${VOICE_COMMAND_DIR}${name}.js`, content);
};

generateVoiceCommands();