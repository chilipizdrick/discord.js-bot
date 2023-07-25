import { SlashCommandBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
	.setName('delete_color_role')
	.setDescription('Delete user\'s personal color role.');

const execute = async (interaction) => {
    try {
        await interaction.deferReply();
        const userId = interaction.member.id;
        const guildRoles = await interaction.guild.roles.fetch();
        if (guildRoles.map(role => role.name).includes(userId)) {
            const userRole = Array.from(guildRoles.filter(role => role.name === userId))[0][1];
            await userRole.delete();
            await interaction.editReply(`Successfully deleted ${interaction.member}'s color role!`);
        } else {
            await interaction.editReply(`No personal color role found for ${interaction.member}!`);
        }
    } catch (err) {
        console.error(err);
        await interaction.editReply('An error occured while executing the command. Try again.');
    }
}

export { data, execute };