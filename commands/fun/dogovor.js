import { ButtonBuilder, ButtonStyle, SlashCommandBuilder, ActionRowBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
	.setName('dogovor')
	.setDescription('Dogovor?');

const execute = async (interaction) => {

	const yes = new ButtonBuilder()
		.setCustomId('yes')
		.setLabel('Yes')
		.setStyle(ButtonStyle.Success);
	
	const no = new ButtonBuilder()
	.setCustomId('no')
	.setLabel('No')
	.setStyle(ButtonStyle.Danger);

	const actionRow = new ActionRowBuilder()
		.addComponents(yes, no);
	
	const response = await interaction.reply({
		content: 'Dogovor?',
		components: [actionRow]
	});

	const collectorFilter = (i) => {i.user.id === interaction.user.id};

	try {
		const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

		if (confirmation.customId === 'yes') {
			await confirmation.update({
				content: 'Dogovor!',
				components: []
			});
		}
		if (confirmation.customId === 'no') {
			await confirmation.update({
				content: 'No dogovor 😢',
				components: []
			});
		}
	} catch (e) {
		await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
	}
}

export { data, execute };