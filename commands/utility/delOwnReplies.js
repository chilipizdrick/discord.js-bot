import { SlashCommandBuilder } from 'discord.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { clientId } = require('../../config.json');

const data = new SlashCommandBuilder()
	.setName('del_own_repl')
	.setDescription("Deletes bot's messages.");

const execute = async (interaction) => {
    await interaction.deferReply();
    try {
        const messages = interaction.channel.messages;
        await messages.fetch({limit: 100})
            .then(messages => messages.filter(m => m.author.id === clientId && m.deletable))
            .then(messages => messages.each(message => message.delete()));
    }
    catch (error) { console.log(error) }
    await interaction.deleteReply();
}

export { data, execute };