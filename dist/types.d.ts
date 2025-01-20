export declare enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
    HEAD = "HEAD",
    OPTIONS = "OPTIONS"
}
export declare enum CacheMode {
    ENABLED = "ENABLED",
    READONLY = "READONLY",
    WRITEONLY = "WRITEONLY",
    DISABLED = "DISABLED"
}
export declare enum FileType {
    CSV = "CSV",
    JSON = "JSON",
    XML = "XML",
    AUTO = "AUTO"
}
export declare enum AuthType {
    NONE = "NONE",
    OAUTH2 = "OAUTH2",
    HEADER = "HEADER",
    QUERY_PARAM = "QUERY_PARAM"
}
export declare enum DecompressionMethod {
    GZIP = "GZIP",
    DEFLATE = "DEFLATE",
    NONE = "NONE",
    AUTO = "AUTO",
    ZIP = "ZIP"
}
export declare enum PaginationType {
    OFFSET_BASED = "OFFSET_BASED",
    PAGE_BASED = "PAGE_BASED",
    DISABLED = "DISABLED"
}
export interface BaseConfig {
    id: string;
    version?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface BaseResult {
    id: string;
    success: boolean;
    data?: any;
    error?: string;
    startedAt: Date;
    completedAt: Date;
}
export interface ApiConfig extends BaseConfig {
    url: string;
    queryParams?: Record<string, any>;
    instruction: string;
    method: HttpMethod;
    headers?: Record<string, string>;
    body?: string;
    documentationUrl?: string;
    contentType?: string;
    responseSchema: any;
    responseMapping?: string;
    authentication?: Authentication;
    pagination?: Pagination;
    dataPath?: string;
}
export interface ExtractConfig extends BaseConfig {
    url: string;
    queryParams?: Record<string, any>;
    instruction: string;
    method: HttpMethod;
    headers?: Record<string, string>;
    body?: string;
    documentationUrl?: string;
    contentType?: string;
    decompressionMethod: DecompressionMethod;
    authentication?: Authentication;
    fileType?: FileType;
    dataPath?: string;
}
export interface TransformConfig extends BaseConfig {
    responseSchema: any;
    responseMapping: string;
}
export type Authentication = {
    type: AuthType;
    format?: string;
};
export type Pagination = {
    type: PaginationType;
    pageSize?: number;
};
export type CallResult = BaseResult & {
    config: ApiConfig;
};
export type ExtractResult = BaseResult & {
    config: ExtractConfig;
};
export type TransformResult = BaseResult & {
    config: TransformConfig;
};
export type ApiInput = {
    url: string;
    queryParams?: Record<string, any>;
    instruction: string;
    method?: HttpMethod;
    headers?: Record<string, string>;
    body?: string;
    contentType?: string;
    documentationUrl?: string;
    responseSchema?: any;
    responseMapping?: any;
    authentication?: Authentication;
    version?: string;
};
export type ExtractInput = {
    url: string;
    queryParams?: Record<string, any>;
    instruction: string;
    method?: HttpMethod;
    headers?: Record<string, string>;
    body?: string;
    contentType?: string;
    documentationUrl?: string;
    decompressionMethod?: DecompressionMethod;
    authentication?: Authentication;
    version?: string;
};
export type TransformInput = {
    instruction: string;
    responseSchema: any;
    responseMapping?: string;
    version?: string;
};
export type CallOptions = {
    cacheMode?: CacheMode;
    timeout?: number;
    retries?: number;
    retryDelay?: number;
    webhookUrl?: string;
};
export type ResultList = {
    items: CallResult[];
    total: number;
};
export type ConfigList = {
    items: ApiConfig[];
    total: number;
};
//# sourceMappingURL=types.d.ts.map