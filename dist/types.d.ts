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
    ENABLED = "ENABLED",// Read and write to cache
    READONLY = "READONLY",// Only read from cache
    WRITEONLY = "WRITEONLY",// Only write to cache - mostly for debugging
    DISABLED = "DISABLED"
}
export declare enum FileType {
    CSV = "CSV",
    JSON = "JSON",
    XML = "XML",
    AUTO = "AUTO"
}
export declare enum AuthType {
    NONE = "NONE",// No authentication
    OAUTH2 = "OAUTH2",// OAuth 2.0 authentication
    HEADER = "HEADER",// Authentication via headers
    QUERY_PARAM = "QUERY_PARAM"
}
export declare enum DecompressionMethod {
    GZIP = "GZIP",
    DEFLATE = "DEFLATE",
    NONE = "NONE",
    AUTO = "AUTO",// Automatically detect compression
    ZIP = "ZIP"
}
export declare enum PaginationType {
    OFFSET_BASED = "OFFSET_BASED",// Uses offset/limit parameters
    PAGE_BASED = "PAGE_BASED",// Uses page number/limit parameters
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
    instruction: string;
    method: HttpMethod;
    queryParams?: Record<string, any>;
    headers?: Record<string, string>;
    body?: string;
    documentationUrl?: string;
    contentType?: string;
    responseSchema?: any;
    responseMapping?: string;
    authentication?: AuthType;
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
    authentication?: AuthType;
    fileType?: FileType;
    dataPath?: string;
}
export interface TransformConfig extends BaseConfig {
    responseSchema: any;
    responseMapping: string;
}
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
    authentication?: AuthType;
    version?: string;
};
export type ApiInputRequest = {
    id?: string;
    endpoint: ApiInput;
};
export type ExtractInputRequest = {
    id?: string;
    endpoint: ExtractInput;
};
export type TransformInputRequest = {
    id?: string;
    endpoint: TransformInput;
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
    authentication?: AuthType;
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
export interface ApiCallArgs {
    id?: string;
    endpoint?: ApiInput;
    payload?: Record<string, unknown>;
    credentials?: Record<string, unknown>;
    options?: CallOptions;
}
export interface TransformArgs {
    id?: string;
    endpoint: TransformInput;
    data: Record<string, unknown>;
    options?: CallOptions;
}
export interface ExtractArgs {
    id?: string;
    endpoint?: ExtractInput;
    options?: CallOptions;
}
//# sourceMappingURL=types.d.ts.map