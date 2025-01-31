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
    createdAt?: Date;
    updatedAt?: Date;
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
    urlHost: string;
    urlPath?: string;
    instruction: string;
    method?: HttpMethod;
    queryParams?: Record<string, any>;
    headers?: Record<string, any>;
    body?: string;
    documentationUrl?: string;
    responseSchema?: any;
    responseMapping?: string;
    authentication?: AuthType;
    pagination?: Pagination;
    dataPath?: string;
}
export interface ExtractConfig extends BaseConfig {
    urlHost: string;
    urlPath?: string;
    instruction: string;
    queryParams?: Record<string, any>;
    method?: HttpMethod;
    headers?: Record<string, any>;
    body?: string;
    documentationUrl?: string;
    decompressionMethod?: DecompressionMethod;
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
export type RunResult = BaseResult & {
    config: ApiConfig | ExtractConfig | TransformConfig;
};
export type ApiInput = {
    urlHost: string;
    urlPath?: string;
    queryParams?: Record<string, any>;
    instruction: string;
    method?: HttpMethod;
    headers?: Record<string, any>;
    body?: string;
    documentationUrl?: string;
    responseSchema?: any;
    responseMapping?: any;
    authentication?: AuthType;
    pagination?: Pagination;
    dataPath?: string;
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
    urlHost: string;
    urlPath?: string;
    queryParams?: Record<string, any>;
    instruction: string;
    method?: HttpMethod;
    headers?: Record<string, any>;
    body?: string;
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
export type RequestOptions = {
    cacheMode?: CacheMode;
    timeout?: number;
    retries?: number;
    retryDelay?: number;
    webhookUrl?: string;
};
export type ResultList = {
    items: RunResult[];
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
    options?: RequestOptions;
}
export interface TransformArgs {
    id?: string;
    endpoint: TransformInput;
    data: Record<string, unknown>;
    options?: RequestOptions;
}
export interface ExtractArgs {
    id?: string;
    endpoint?: ExtractInput;
    options?: RequestOptions;
}
export declare class SuperglueClient {
    private endpoint;
    private apiKey;
    private static configQL;
    constructor({ endpoint, apiKey }: {
        endpoint?: string;
        apiKey: string;
    });
    private request;
    call<T = unknown>({ id, endpoint, payload, credentials, options }: ApiCallArgs): Promise<RunResult & {
        data: T;
    }>;
    extract<T = any>({ id, endpoint, options }: ExtractArgs): Promise<RunResult & {
        data: T;
    }>;
    transform<T = any>({ id, endpoint, data, options }: TransformArgs): Promise<RunResult & {
        data: T;
    }>;
    listRuns(limit?: number, offset?: number): Promise<{
        items: RunResult[];
        total: number;
    }>;
    getRun(id: string): Promise<RunResult>;
    listApis(limit?: number, offset?: number): Promise<{
        items: ApiConfig[];
        total: number;
    }>;
    listTransforms(limit?: number, offset?: number): Promise<{
        items: TransformConfig[];
        total: number;
    }>;
    listExtracts(limit?: number, offset?: number): Promise<{
        items: ExtractConfig[];
        total: number;
    }>;
    getApi(id: string): Promise<ApiConfig>;
    getTransform(id: string): Promise<TransformConfig>;
    getExtract(id: string): Promise<ExtractConfig>;
    upsertApi(id: string, input: Record<string, unknown>): Promise<ApiConfig>;
    deleteApi(id: string): Promise<boolean>;
    createApi(input: Record<string, unknown>): Promise<ApiConfig>;
    upsertExtraction(id: string, input: Record<string, unknown>): Promise<ExtractConfig>;
    deleteExtraction(id: string): Promise<boolean>;
    upsertTransformation(id: string, input: Record<string, unknown>): Promise<TransformConfig>;
    deleteTransformation(id: string): Promise<boolean>;
}
//# sourceMappingURL=superglue.d.ts.map