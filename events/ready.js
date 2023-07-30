import { Events, ActivityType } from 'discord.js';

const name = Events.ClientReady;
const once = true;
const execute = async (client) => {
	await client.user.setActivity('Use / for commands.', { type: ActivityType.Playing });
	console.log(`Ready! Logged in as ${client.user.tag}`);
};

export { name, once, execute };