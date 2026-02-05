// src/types/metadata.ts

/**
 * =============================================================================
 * 基礎資料結構定義 (Base Data Structures)
 * =============================================================================
 */

/**
 * 定義 opt_ 系列 (選單陣列) 內的物件結構
 * 對應 Element Plus 的 Option 格式，通常包含 label 和 value
 */
export interface OptionItem {
    /** 顯示文字 (對應 el-option 的 label) */
    label?: string;
    /** 選項值 (對應 el-option 的 value) */
    value?: string | number | boolean;
    disabled?: boolean;
    /** 允許其他額外欄位 (例如: description, order 等) */
    [key: string]: any;
}

/**
 * 核心設定檔介面 (Metadata Data Transfer Object)
 * 對應後端 Java MetadataDTO
 * * 特性：
 * 1. 包含固定欄位 id, name, list
 * 2. 使用索引簽章 (Index Signature) 來處理被「攤平」的動態屬性
 */
export interface MetadataDTO {
    /** * 設定檔識別碼 
     * 例如: "cfg_financial", "opt_gender" 
     */
    id: string;

    /** * 設定檔顯示名稱 
     * 例如: "台灣金融指標", "性別選項" 
     */
    name: string;

    /** * 選單陣列 (僅 opt_ 系列會有此欄位)
     * 用於產生 <el-select> 或 <el-checkbox-group>
     */
    list?: OptionItem[];

    /**
     * 動態屬性容器 (Flattened Properties)
     * * 這裡承接後端 Map<String, Object> properties 攤平後的欄位
     * 例如: unit, bond_yield_2y, max_limit 等
     * * 注意：因為 id/name 是 string，這裡必須允許 string，
     * 但為了相容數值或布林值，我們使用 any。
     */
    [key: string]: any;
}

/**
 * =============================================================================
 * 特定設定檔擴充範例 (Specific Config Extensions)
 * * 建議：為了讓開發時有 IntelliSense (自動補全)，
 * 您可以針對已知的特定 id 定義專屬介面來繼承 MetadataDTO
 * =============================================================================
 */

/**
 * 範例：金融指標設定 (cfg_financial)
 * 擴充了 unit 和 bond_yield_2y 欄位
 */
export interface FinancialConfig extends MetadataDTO {
    id: 'cfg_financial'; // 字串常值型別 (String Literal Type)，鎖定 id

    /** 單位 (例如: "percentage") */
    unit: string;

    /** 2年期債券殖利率 */
    bond_yield_2y: number;

    /** 預留其他可能的數值欄位 */
    bond_yield_5y?: number;
    bond_yield_10y?: number;
}

/**
 * 範例：系統開關設定 (cfg_system)
 * 擴充了 boolean 類型的開關
 */
export interface SystemConfig extends MetadataDTO {
    id: 'cfg_system';

    /** 系統維護模式開關 */
    maintenance_mode: boolean;

    /** 最大連線數限制 */
    max_connections: number;
}

/**
 * =============================================================================
 * API 回傳聚合結構 (API Response Aggregates)
 * =============================================================================
 */

/**
 * 假設後端 API 一次回傳多個設定檔的 Map 結構
 * Key 是 id，Value 是設定物件
 */
export type MetadataMap = Record<string, MetadataDTO>;

/**
 * 泛型輔助工具：用來強制轉型特定設定
 * 用法: const fin = config as ConcreteMetadata<FinancialConfig>;
 */
export type ConcreteMetadata<T extends MetadataDTO> = T;