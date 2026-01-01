// 新增：後端分頁回應格式
export interface PaginatedResponse<T> {
    list: T[];
    total: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
}