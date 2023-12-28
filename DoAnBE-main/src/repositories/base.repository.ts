// import { IBaseRepository } from '@/interfaces/baseRepository.interface';
import {
  Model,
  FilterQuery,
  PaginateOptions,
  Document,
  PaginateModel,
  PipelineStage,
  QueryOptions,
  ObjectId,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from 'mongoose';

type DynamicModel<T extends Document> = PaginateModel<T>;
// type DynamicAggregatePaginateModel<T extends Document> = PaginateModel<T>;
interface DynamicAggregatePaginateModel<T> extends PaginateModel<T> {
  aggregatePaginate(aggregation: any, options?: any): Promise<any>;
}

export type UpdatedModel = {
  matchedCount: number;
  modifiedCount: number;
  acknowledged: boolean;
  upsertedId: unknown | ObjectId;
  upsertedCount: number;
};

export type RemovedModel = {
  deletedCount: number;
  deleted: boolean;
};

export type CreatedModel = {
  id: string;
  created: boolean;
};

export default class BaseRepository<T extends Document> {
  protected readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: any): Promise<T | any> {
    const model = new this.model(data);
    return model.save();
  }

  async findPaginate(filter: FilterQuery<T>, options?: PaginateOptions): Promise<any> {
    const dynamicModel: DynamicModel<T> = this.model as DynamicModel<T>;
    const result = await dynamicModel.paginate(filter, options);
    return {
      data: result.docs,
      page: {
        pageCount: result.totalPages,
        itemCount: result.totalDocs,
        currentPage: result.page,
      },
    };
  }

  async findAggregatePaginate(pipeline?: PipelineStage[], options?: PaginateOptions): Promise<any> {
    const dynamicAggregatePaginateModel: DynamicAggregatePaginateModel<T> = this.model as DynamicAggregatePaginateModel<T>;
    const aggregate = this.model.aggregate(pipeline);
    const result = await dynamicAggregatePaginateModel.aggregatePaginate(aggregate, options);
    return {
      data: result.docs,
      page: {
        pageCount: result.totalPages,
        itemCount: result.totalDocs,
        currentPage: result.page,
      },
    };
  }

  async findOne(filter: FilterQuery<T>, options?: QueryOptions): Promise<T> {
    return this.model.findOne(filter, null, options);
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async findAll(filter: FilterQuery<T>, projection?: any, options?: QueryOptions): Promise<T[]> {
    return this.model.find(filter, projection, options);
  }

  async remove(filter: FilterQuery<T>): Promise<RemovedModel> {
    const { deletedCount } = await this.model.remove(filter);
    return { deletedCount, deleted: !!deletedCount };
  }

  async findByIdAndDelete(id: string): Promise<RemovedModel> {
    const res = await this.model.findByIdAndDelete(id);
    return { deletedCount: res ? 1 : 0, deleted: !!res };
  }

  async findOneAndUpdate(filter: FilterQuery<T>, update: UpdateQuery<T>, options?: QueryOptions): Promise<any> {
    return this.model.findOneAndUpdate(filter, update, options);
  }

  async updateOne(filter: FilterQuery<T>, updated: UpdateWithAggregationPipeline | UpdateQuery<T>, options?: QueryOptions): Promise<UpdatedModel> {
    return this.model.updateOne(filter, updated, options);
  }

  async updateMany(filter: FilterQuery<T>, updated: UpdateWithAggregationPipeline | UpdateQuery<T>, options?: QueryOptions): Promise<UpdatedModel> {
    return this.model.updateMany(filter, updated, options);
  }

  async _deleteMany(filter: FilterQuery<T>, options?: QueryOptions): Promise<RemovedModel> {
    const { deletedCount } = await this.model.deleteMany(filter, options);
    return { deletedCount, deleted: !!deletedCount };
  }
}
