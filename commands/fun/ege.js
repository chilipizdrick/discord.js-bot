import { SlashCommandBuilder } from 'discord.js';
import fetch from 'node-fetch';
import base64 from 'base-64';
const URL = 'https://checkege.rustest.ru/api/captcha';

const data = new SlashCommandBuilder()
        .setName('ege')
        .setDescription('Get ege results.');

async function execute(interaction) {
    try {
        const response = fetch(URL).then(res => res.json())
        decodedStr = base64.decode(response["Image"]);
        console.log(decodedStr);
        const json = JSON.parse(strImage);
        console.log(json["Token"], json["Image"]);
    }
    catch (e) {
        console.error(e);
    }

    let egePoints = {
        "profMath": 23,
        "rusLang": 34
    };
    let message = "";
    for (let key in egePoints) {
        message += `${key}: ${egePoints[key]}\n`
    }
    await interaction.reply(message);
}

export { data, execute };