import { getAudioDurationInSeconds } from 'get-audio-duration';

const getDurationOfAudioFile = async (filepath) => {
    return Math.ceil((0.5 + await getAudioDurationInSeconds(filepath)) * 1000);
}

export default getDurationOfAudioFile;