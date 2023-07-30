import { SlashCommandBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
	.setName('color')
	.setDescription('Change user\'s personal role color.')
	.addStringOption(option =>
		option.setName('color')
			.setDescription('Color in HEX format (e.g #ff9300)')
			.setRequired(true));

const execute = async (interaction) => {
	try {
		await interaction.deferReply();
		const userId = interaction.member.id;
		const guildRoles = await interaction.guild.roles.fetch();
		if (guildRoles.map(role => role.name).includes(userId)) {
			const userRole = Array.from(guildRoles.filter(role => role.name === userId))[0][1];
			await userRole.setColor(interaction.options.getString('color'));
			await interaction.editReply(`Successfully changed ${interaction.member}'s role color!`);
		} else {
			const newMemberRole = await interaction.guild.roles.create({
				name: userId,
				color: interaction.options.getString('color'),
				permissions: [],
				position: 5,
				reason: 'New member needs a personal role.',
			});
			await interaction.member.roles.add(newMemberRole);
			await interaction.editReply(`Successfully created a personal color role for ${interaction.member} and changed its color!`);
		}
	} catch (err) {
		console.error(err);
		await interaction.editReply('An error occured while executing the command. Try again.');
	}
};

export { data, execute };