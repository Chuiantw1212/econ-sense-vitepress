// 新增：後端分頁回應格式
export interface PaginatedResponse<T> {
    list: T[];
    total: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
}

/**
 * 預期壽命查詢 API 回傳格式
 * 對應後端: com.en_chu.calculator_api_spring.model.LifeExpectancyRes
 */
export interface LifeExpectancyRes {
    year: number;
    gender: string;
    age: number;
    expectedLifespan: number; // 修正為正確的後端欄位F
}