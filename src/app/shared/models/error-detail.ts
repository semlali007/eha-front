export interface ErrorDetail {
  title: string;
  message: string;
  supportId?: string;
  rawBody?: string;
  httpStatus?: number;
}
