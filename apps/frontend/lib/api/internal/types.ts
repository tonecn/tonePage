/**
 * 内部 API 类型定义
 */

export interface APIResponse<T = any> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * 后端返回的通用错误格式
 */
export interface BackendError {
  success: false;
  code: number;
  message: string;
  data?: any;
}
