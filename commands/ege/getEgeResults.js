import { SlashCommandBuilder, AttachmentBuilder} from 'discord.js';
import fetch from 'node-fetch';
import fs from 'node:fs';
import md5 from 'blueimp-md5';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { clientId } = require('../../config.json');
const superagent = require('superagent').agent();
const CAPTCHA_URL = 'https://checkege.rustest.ru/api/captcha';
const LOGIN_URL = 'https://checkege.rustest.ru/api/participant/login';
const EXAM_URL = 'https://checkege.rustest.ru/api/exam'

const data = new SlashCommandBuilder()
    .setName('ege_get')
    .setDescription('Get ege results.');

const execute = async (interaction) => {
    await interaction.deferReply();
    try {
        const userData = JSON.parse(fs.readFileSync("userdata/user-data.json"));
        const currUserData = userData[interaction.member.id];
        const captchaObj = await fetch(CAPTCHA_URL).then(res => res.json()).then();
        const image = Buffer.from(captchaObj["Image"], 'base64');
        fs.writeFile("assets/images/captcha.jpg", image, (err) => {
            if (err) {
                interaction.editReply('Caught error while executing the command. Try again.');
                console.error(err);
            }
        });

        const captchaEmbed = {
            color: 0xFF0000,
	        title: 'Введите капчу: \n',
            image: {
                url: 'attachment://captcha.jpg',
                },
            };
        
        const captchaImg = new AttachmentBuilder('assets/images/captcha.jpg');
        await interaction.editReply( {embeds: [captchaEmbed], files: [captchaImg] });

        let token = '';
        for (const char of captchaObj["Token"]) {
            if ([',', '/', '?', ':', '@', '&', '=', '+', '$', '#'].includes(char)) {
                token += encodeURIComponent(char);
            } else {
                token += char;
            }
        };

        const mesFilter = m => (m.content.length === 6) && (m.member.id !== clientId);
        const userResponse = await interaction.channel.awaitMessages({ mesFilter, max: 1, time: 60_000 })
            .then(collectedMessages => collectedMessages.first().content.trim());
        console.log(`Entered captcha: ${userResponse}`);
        
        const payloadData = {"Hash": hash(currUserData),
                             "Code": "",
                             "Document": `000000${currUserData["id-number"]}`,
                             "Region": currUserData["region"],
                             "AgereeCheck": "on",
                             "Captcha": userResponse,
                             "Token": token,
                             "reCaptureToken": userResponse}
        const payloadArray = [];
        for (const key in payloadData) {
            payloadArray.push(`${key}=${payloadData[key]}`);
        }
        const payload = payloadArray.join('&');

        const dashboard = await superagent
            .post(LOGIN_URL)
            .send(payload)
            .set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
            .then(dashboard => console.log(dashboard.text));
        
        const examData = await superagent
        .get(EXAM_URL)
        .then(res => JSON.parse(res.text));
        
        const examPoints = {}
        for (const exam of examData["Result"]["Exams"]) {
            if (exam["Subject"] === "Сочинение") {
                examPoints[exam["Subject"]] = "зачёт";
            } else {
                examPoints[exam["Subject"]] = exam["TestMark"];
            }
        }

        const resultsEmbed = {
            color: 0x00FF00,
	        title: 'Ваши баллы: \n',
            fields: []
            };

        for (const key in examPoints) {
            resultsEmbed["fields"].push({ name: key, value: examPoints[key]});
        }

        await interaction.channel.send({ embeds: [resultsEmbed] })

    } catch (error) {
		interaction.editReply('Caught error while executing the command. Try again or register, if you have\'n yet, using /ege_reg.');
		console.log(error);
	};
}

const hash = (currUserData) => {
    return md5(`${currUserData["lastname"]}${currUserData["firstname"]}${currUserData["surname"]}`
        .toLowerCase()
        .replace("ё", "е")
        .replace("й", "и")
        .replace("-", ""));
}

export { data, execute };