import { NextFunction, Request, Response } from 'express';
import { CreateTopicDto } from '@dtos/topics.dto';
import { Topic } from '@interfaces/topics.interface';
import topicService from '@services/topics.service';

class TopicsController {
  public topicService = new topicService();

  public getTopics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sort = { createAt: '-1' } } = req.query;
      const findAllTopicsData: Topic[] = await this.topicService.findAllTopic(sort);

      res.status(200).json({ data: findAllTopicsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getTopicById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topicId: string = req.params.id;
      const findOneTopicData: Topic = await this.topicService.findTopicById(topicId);

      res.status(200).json({ data: findOneTopicData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createTopic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topicData: CreateTopicDto = req.body;
      const createTopicData: Topic = await this.topicService.createTopic(topicData);

      res.status(201).json({ data: createTopicData, message: 'Topic create success' });
    } catch (error) {
      next(error);
    }
  };

  public updateTopic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topicId: string = req.params.id;
      const topicData: CreateTopicDto = req.body;
      const updateTopicData: Topic = await this.topicService.updateTopic(topicId, topicData);

      res.status(200).json({ data: updateTopicData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteTopic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topicId: string = req.params.id;
      const deleteTopicData: Topic = await this.topicService.deleteTopic(topicId);

      res.status(200).json({ data: deleteTopicData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default TopicsController;
