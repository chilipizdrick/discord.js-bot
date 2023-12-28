import fs from 'node:fs';

const pickRandomFileFromDirectory = (dirPath) => {
	const audioFiles = fs.readdirSync(dirPath);
	const pathsList = [];
	audioFiles.forEach(filename => pathsList.push(`${dirPath}/${filename}`));
	const randFile = pathsList[Math.floor(Math.random() * pathsList.length)];
	return randFile;
};

export default pickRandomFileFromDirectory;
