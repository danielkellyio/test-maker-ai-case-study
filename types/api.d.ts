declare global {
  export interface ApiError {
    statusCode: number;
    message: string;
    data?: Record<string, unknown>;
  }
}
