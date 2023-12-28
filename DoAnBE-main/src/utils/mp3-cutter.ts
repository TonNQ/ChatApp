import path from 'path';
const { v4: uuidv4 } = require('uuid');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

export const CutMp3 = (src: string, start: number, end: number) => {
  const result = `/public/uploads/${uuidv4()}.mp3`;

  const command = ffmpeg(path.join(__dirname, '../', src))
    .setStartTime(start)
    .setDuration(end - start)
    .output(path.join(__dirname, '../', result));
  command
    .on('error', err => {
      console.error('Error cutting MP3 file:', err.message);
    })
    .on('end', () => {
      console.log('MP3 file cut successfully');
    })
    .run();
  return result;
};
