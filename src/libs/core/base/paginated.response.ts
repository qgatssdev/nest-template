export interface Pagination {
  page: number;
  size: number;
  total: number;
}

export class PaginatedResponse<T> {
  success: boolean;
  message: string;
  data?: T | null;
  pagination: Pagination;

  constructor(
    success: boolean,
    message: string,
    data: T | null,
    pagination: Pagination,
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.pagination = pagination;
  }

  static successResponse<T>(
    data: T,
    pagination: Pagination,
    message = 'Success',
  ): PaginatedResponse<T> {
    return new PaginatedResponse<T>(true, message, data, pagination);
  }

  static errorResponse<T>(
    message: string,
    data: T | null,
    pagination: Pagination,
  ): PaginatedResponse<T> {
    return new PaginatedResponse<T>(false, message, data, pagination);
  }
}
