import axios from 'axios';
import { createWriteStream } from 'fs';
import {dirname, resolve} from 'path';
import { fileURLToPath } from 'url';
import ffmpeg from 'fluent-ffmpeg';
import installer from '@ffmpeg-installer/ffmpeg';
import {removeFile} from "./utils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
class Oggconverter {
    constructor() {
        ffmpeg.setFfmpegPath(installer.path);
    }

    toMp3(input, output) {
        try {
         const outputPath = resolve(dirname(input), `${output}.mp3`);
         return new Promise((resolve, reject) => {
            ffmpeg(input)
                .inputOptions('-t 30')
                .output(outputPath)
                .on('end', () => {
                    removeFile(input);
                    resolve(outputPath)})
                .on('error', (e) => reject(e.message))
                .run();
            });
        } catch (e) {
            console.log(`Error while converting to mp3:`, e.message);
        }
    }

    async create(url, filename) {
        try {
            const oggPath = resolve(__dirname, '../voices', `${filename}.ogg`);
            const response = await axios({
                method: 'get',
                url,
                responseType: 'stream',
            });
            return new Promise((resolve, reject) => {
                const stream = createWriteStream(oggPath);
                response.data.pipe(stream);
                stream.on('finish', () => resolve(oggPath));
            });
        } catch (e) {
            console.log(`Error while creating ogg:`, e.message);
        }
    }
}

export const oggInstance = new Oggconverter();