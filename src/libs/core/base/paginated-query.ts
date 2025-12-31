import {
  IsOptional,
  IsNumber,
  IsString,
  IsIn,
  IsDateString,
  Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class PaginatedQuery {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Size must be a number' })
  @Min(1, { message: 'Size must be at least 1' })
  size?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      if (value.toLowerCase() === 'true') return true;
      if (value.toLowerCase() === 'false') return false;
      return value;
    }
    return value;
  })
  filter?: string | boolean;

  @IsOptional()
  @IsString({ message: 'FilterBy must be a string' })
  filterBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'], { message: 'Order must be either "asc" or "desc"' })
  order?: 'asc' | 'desc';

  @IsOptional()
  @IsString({ message: 'OrderBy must be a string' })
  orderBy?: string;

  @IsOptional()
  @IsDateString({}, { message: 'From must be a valid date string' })
  from?: string;

  @IsOptional()
  @IsDateString({}, { message: 'To must be a valid date string' })
  to?: string;

  @IsOptional()
  @IsString({ message: 'Keyword must be a string' })
  keyword?: string;
}
