import fs from 'node:fs';
import { SlashCommandBuilder } from 'discord.js';

const BIRTHDAY_USERS_PATH = 'userdata/birthday-user-data.json';

const data = new SlashCommandBuilder()
	.setName('set_birthday')
	.setDescription('Set user\'s birthday for congratulations.')
	.addStringOption(option =>
		option.setName('member')
			.setDescription('Server member to set birthday for.')
			.setRequired(true))
	.addStringOption(option =>
		option.setName('month')
			.setDescription('Month in numeric format.')
			.setRequired(true))
	.addStringOption(option =>
		option.setName('day')
			.setDescription('Day of the month.')
			.setRequired(true));

const execute = async (interaction) => {
	try {
		await interaction.deferReply();

		const day = interaction.options.getString('day').replace(/^0+/, '');
		const month = interaction.options.getString('month').replace(/^0+/, '');
		const dateStr = `${month}/${day}`;
		const memberId = interaction.options.getString('member').replace(/\D/g, '');
		const birthdayMembers = JSON.parse(fs.readFileSync(BIRTHDAY_USERS_PATH));

		if (!birthdayMembers[memberId]) {
			birthdayMembers[memberId] = {};
		}

		birthdayMembers[memberId]['birthday'] = dateStr;
		birthdayMembers[memberId]['years'] = [];
		fs.writeFileSync(BIRTHDAY_USERS_PATH, JSON.stringify(birthdayMembers));

		await interaction.editReply(`Successfully set birthday date of <@${memberId}> to be ${dateStr}.`);
	} catch (err) {
		console.error(err);
		await interaction.editReply('An error occured while executing the command. Try again.');
	}
};

export { data, execute };