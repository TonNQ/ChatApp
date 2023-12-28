import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
var gtts = require('node-gtts')('en');
import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';

class UtilService {
  constructor() {}

  public async findAudio(word: string): Promise<{ audio: string }> {
    if (isEmpty(word)) throw new HttpException(400, 'Word is empty');
    const filePath = path.join(__dirname, `../../src/public/words/${word.toLowerCase()}.mp3`);
    const fileExist = fs.existsSync(filePath);
    if (!fileExist) {
      const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~ ]/;
      if (format.test(word)) throw new HttpException(409, 'Word cannot contain spaces or special characters');
      else
        gtts.save(filePath, word, function () {
          console.log('Created MP3');
          return { audio: `/public/words/${word}.mp3` };
        });
    } else {
      return { audio: `/public/words/${word}.mp3` };
    }
  }
}

export default UtilService;
