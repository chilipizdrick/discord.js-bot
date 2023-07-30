import { SlashCommandBuilder } from 'discord.js';
import fs from 'node:fs';

const data = new SlashCommandBuilder()
	.setName('ege_reg')
	.setDescription('Autheticicate at checkege.reustest.ru')
	.addStringOption(option =>
		option.setName('firstname')
			.setDescription('Ваше имя')
			.setRequired(true))
	.addStringOption(option =>
		option.setName('lastname')
			.setDescription('Ваша фамилия')
			.setRequired(true))
	.addStringOption(option =>
		option.setName('surname')
			.setDescription('Ваше отчество')
			.setRequired(true))
	.addStringOption(option =>
		option.setName('id-number')
			.setDescription('Номер вашего паспорта (без серии)')
			.setRequired(true))
	.addStringOption(option =>
		option.setName('region')
			.setDescription('Ваш регион (двузначным числом)')
			.setRequired(true));

const execute = async (interaction) => {
	await interaction.deferReply();

	try {
		const userData = JSON.parse(fs.readFileSync("userdata/ege-user-data.json"));

		const currUserData = {
			"firstname": interaction.options.getString('firstname'),
			"lastname": interaction.options.getString('lastname'),
			"surname": interaction.options.getString('surname'),
			"id-number": interaction.options.getString('id-number'),
			"region": interaction.options.getString('region')
		}

		const userId = interaction.member.id
		userData[userId] = currUserData

		const userDataStr = JSON.stringify(userData);
		fs.writeFile("userdata/ege-user-data.json", userDataStr, (error) => {
			if (error) {
				console.error(error);
			}
		});

		interaction.editReply('Registration successful!');
	} catch (error) {
		interaction.editReply('An error occured while executing the command. Try again.');
		console.log(error);
	};
}

export { data, execute };