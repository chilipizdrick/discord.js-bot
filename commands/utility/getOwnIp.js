import { SlashCommandBuilder } from 'discord.js';
import http from 'http';

const data = new SlashCommandBuilder()
    .setName('get_ip')
    .setDescription('Returns current ip of the host server.');

const execute = async (interaction) => {
    await interaction.deferReply();
    await http.get({ 'host': 'api.ipify.org', 'port': 80, 'path': '/' }, (resp) => {
        resp.on('data', (ip) => {
            interaction.editReply(`Public IP of the host server is:\n${ip}`);
        });
    });
}

export { data, execute };