import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder} from 'discord.js';
import fetch from 'node-fetch';
import fs from 'node:fs';
// import timer from 'node:timers/promises';
const URL = 'https://checkege.rustest.ru/api/captcha';

const data = new SlashCommandBuilder()
        .setName('ege')
        .setDescription('Get ege results.');

async function execute(interaction) {
    await interaction.deferReply();
    // await timer.setTimeout(4000);

    try {
        const response = await fetch(URL).then(res => res.json()).then();
        const image = Buffer.from(response["Image"], 'base64')
        fs.writeFile("assets/images/captcha.jpg", image, (err) => {
                if (err) {
                    console.log(err);
                }
            });
    }
    catch (e) { console.error(e) }

    let msg = `Введите свои данные ответом на данное сообщение (каждое поле - на новой строке):
        Фамилия
        Имя
        Отчество
        Номер паспорта (без серии)
        Регион (двузначной цифрой)
        Код с картинки`
    let embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setImage('attachment://captcha.jpg');
    const file = new AttachmentBuilder('assets/images/captcha.jpg');
    
    await interaction.editReply( {content: msg, embeds: [embed], files: [file] });
}

export { data, execute };