export interface PaginatedResponse<T> {
  rows: T[];
  total: number;
}
