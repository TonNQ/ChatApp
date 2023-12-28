import { NextFunction, Request, Response } from 'express';
import UtilService from '@services/utils.service';
import { HttpException } from '@/exceptions/HttpException';

class UtilController {
  public untilService = new UtilService();

  public findAudio = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const word: string = req.params.word;
      const findOneAudio: { audio: string } = await this.untilService.findAudio(word);

      res.status(200).json({ data: findOneAudio, message: 'findAudio' });
    } catch (error) {
      next(error);
    }
  };
  public uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) throw new HttpException(400, 'fileUpload is empty');
      res.status(200).json({ data: { file: `/public/uploads/${req.file.filename}` }, message: 'uploadFile' });
    } catch (error) {
      next(error);
    }
  };
}

export default UtilController;
