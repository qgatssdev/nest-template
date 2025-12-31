import { YadsaleItem } from 'src/modules/yadsale/entity/yadsale-item.entity';
import { DeliveryStatus } from '../constants';

export interface PaginatedQuery {
  page?: number;
  size?: number;
  filter?: string | boolean;
  filterBy?: string;
  order?: 'asc' | 'desc';
  orderBy?: string;
  from?: string;
  to?: string;
}

export interface SearchQuery extends PaginatedQuery {
  keyword: string;
}

export interface FileValidationProps {
  supportedFormats: string[];
  maxFileSize: number;
  files: Express.Multer.File[];
}

export const ShipbubbleStatusToDeliveryStatusMap: Record<
  string,
  DeliveryStatus
> = {
  Pending: DeliveryStatus.PENDING,
  Confirmed: DeliveryStatus.CONFIRMED,
  'Picked up': DeliveryStatus.PICKED_UP,
  'In transit': DeliveryStatus.IN_TRANSIT,
  Completed: DeliveryStatus.COMPLETED,
  Cancelled: DeliveryStatus.CANCELLED,
};

export interface DeliveryItem extends YadsaleItem {
  quantity: number;
}
