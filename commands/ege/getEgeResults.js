import { SlashCommandBuilder, AttachmentBuilder } from 'discord.js';
import fetch from 'node-fetch';
import fs from 'node:fs';
import md5 from 'blueimp-md5';
import dotenv from 'dotenv';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const superagent = require('superagent').agent();
const CAPTCHA_URL = 'https://checkege.rustest.ru/api/captcha';
const LOGIN_URL = 'https://checkege.rustest.ru/api/participant/login';
const EXAM_URL = 'https://checkege.rustest.ru/api/exam'

dotenv.config();

const data = new SlashCommandBuilder()
    .setName('ege_get')
    .setDescription('Get ege results.');

const execute = async (interaction) => {
    await interaction.deferReply();
    try {
        const userData = JSON.parse(fs.readFileSync("userdata/ege-user-data.json"));
        if (!userData.hasOwnProperty(interaction.member.id)) {
            interaction.editReply('Current user not found in the database. Register first using /ege_reg.')
            throw 'Current user not found in the database.';
        }
        const currUserData = userData[interaction.member.id];
        const response = await fetch(CAPTCHA_URL);
        const captchaObj = await response.json();
        const image = Buffer.from(captchaObj["Image"], 'base64');
        fs.writeFile("assets/images/temp/captcha.jpg", image, (err) => {
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

        const captchaImg = new AttachmentBuilder('assets/images/temp/captcha.jpg');
        await interaction.editReply({ embeds: [captchaEmbed], files: [captchaImg] });

        const captchaToken = tokenEncodeURI(captchaObj["Token"]);

        const mesFilter = m => (m.content.length === 6) && (m.member.id !== process.env.CLIENT_ID);
        const collectedMessages = await interaction.channel.awaitMessages({ mesFilter, max: 1, time: 60_000 });
        const userCaptchaResponse = await collectedMessages.first().content.trim();
        console.log(`Entered captcha: ${userCaptchaResponse}`);

        const payload = collectPayload(hash(currUserData), currUserData["id-number"], currUserData["region"], userCaptchaResponse, captchaToken);

        await superagent
            .post(LOGIN_URL)
            .send(payload)
            .set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

        const examDataResposne = await superagent.get(EXAM_URL);
        const examData = JSON.parse(examDataResposne.text);

        const examPoints = {}
        for (const exam of examData["Result"]["Exams"]) {
            if (exam["StatusName"] === "Оценённый результат") {
                if (exam["Subject"] === "Сочинение") {
                    exam["TestMark"] === 1 ? examPoints[exam["Subject"]] = "зачёт" : examPoints[exam["Subject"]] = "незачёт";
                } else {
                    examPoints[exam["Subject"]] = exam["TestMark"];
                }
            } else {
                examPoints[exam["Subject"]] = "Нет результата";
            }
        }

        const resultsEmbed = {
            color: 0x00FF00,
            title: `Баллы ЕГЭ пользователя @${interaction.member.displayName}: \n`,
            fields: []
        };

        for (const key in examPoints) {
            resultsEmbed["fields"].push({ name: key, value: examPoints[key] });
        }

        await interaction.channel.send({ embeds: [resultsEmbed] })
        await interaction.deleteReply();

    } catch (error) {
        if (error !== 'Current user not found in the database.') {
            interaction.editReply('Caught error while executing the command. Try again ');
            console.log(error);
        }
    };
}

const tokenEncodeURI = (rawToken) => {
    let token = '';
    for (const char of rawToken) {
        if ([',', '/', '?', ':', '@', '&', '=', '+', '$', '#'].includes(char)) {
            token += encodeURIComponent(char);
        } else {
            token += char;
        }
    };
    return token;
}

const hash = (currUserData) => {
    return md5(`${currUserData["lastname"]}${currUserData["firstname"]}${currUserData["surname"]}`
        .toLowerCase()
        .replace("ё", "е")
        .replace("й", "и")
        .replace("-", ""));
}

const collectPayload = (hash, idNumber, region, userCaptchaResponse, captchaToken) => {
    const payloadData = {
        "Hash": hash,
        "Code": "",
        "Document": `000000${idNumber}`,
        "Region": region,
        "AgereeCheck": "on",
        "Captcha": userCaptchaResponse,
        "Token": captchaToken,
        "reCaptureToken": userCaptchaResponse
    };
    const payloadArray = [];
    for (const key in payloadData) {
        payloadArray.push(`${key}=${payloadData[key]}`);
    }
    return payloadArray.join('&');
}

export { data, execute };