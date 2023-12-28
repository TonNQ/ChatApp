import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class PaginationInputDTO {
  @IsNotEmpty()
  page: number;

  @IsNotEmpty()
  limit: number;

  @IsOptional()
  sort?: string[] | object;

  @IsOptional()
  filter?: string[] | object;

  @IsOptional()
  @IsString()
  searchKey?: string;
}
