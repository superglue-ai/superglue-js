// HTTP methods supported by superglue
export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
  HEAD = "HEAD",
  OPTIONS = "OPTIONS"
}

// Cache behavior configuration options
export enum CacheMode {
  ENABLED = "ENABLED",    // Read and write to cache
  READONLY = "READONLY",  // Only read from cache
  WRITEONLY = "WRITEONLY", // Only write to cache - mostly for debugging
  DISABLED = "DISABLED"   // No caching
}

// Supported file formats for data extraction
export enum FileType {
  CSV = "CSV",
  JSON = "JSON",
  XML = "XML",
  AUTO = "AUTO"  // Automatically detect file type
}

// Authentication methods for API requests
export enum AuthType {
  NONE = "NONE",           // No authentication
  OAUTH2 = "OAUTH2",       // OAuth 2.0 authentication
  HEADER = "HEADER",       // Authentication via headers
  QUERY_PARAM = "QUERY_PARAM" // Authentication via query parameters
}

// Supported decompression methods for compressed data
export enum DecompressionMethod {
  GZIP = "GZIP",
  DEFLATE = "DEFLATE",
  NONE = "NONE",
  AUTO = "AUTO",  // Automatically detect compression
  ZIP = "ZIP"
}

// Pagination strategies
export enum PaginationType {
  OFFSET_BASED = "OFFSET_BASED", // Uses offset/limit parameters
  PAGE_BASED = "PAGE_BASED",     // Uses page number/limit parameters
  DISABLED = "DISABLED"          // No pagination
}

// Base configuration interface for all config types
export interface BaseConfig {
  id: string;              // Unique identifier
  version?: string;        // Optional version identifier
  createdAt: Date;        // Creation timestamp
  updatedAt: Date;        // Last update timestamp
}

// Base result interface for all operation results
export interface BaseResult {
  id: string;             // Unique identifier
  success: boolean;       // Operation success status
  data?: any;            // Optional response data
  error?: string;        // Error message if operation failed
  startedAt: Date;       // Operation start timestamp
  completedAt: Date;     // Operation completion timestamp
}

// Configuration for API calls
export interface ApiConfig extends BaseConfig {
  url: string;            // API endpoint URL
  instruction: string;    // Natural language instruction
  method: HttpMethod;     // HTTP method to use
  queryParams?: Record<string, any>;  // Query parameters
  headers?: Record<string, string>;   // HTTP headers
  body?: string;          // Request body
  documentationUrl?: string;          // API documentation URL
  contentType?: string;   // Request content type
  responseSchema?: any;   // Expected response schema
  responseMapping?: string; // Response transformation mapping
  authentication?: AuthType; // Authentication method
  pagination?: Pagination;  // Pagination configuration
  dataPath?: string;      // Path to data in response
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

// Configuration options for API calls
export type CallOptions = {
  cacheMode?: CacheMode;     // Caching behavior
  timeout?: number;          // Request timeout in milliseconds
  retries?: number;          // Number of retry attempts
  retryDelay?: number;       // Delay between retries in milliseconds
  webhookUrl?: string;       // Webhook URL for async notifications
};

// List response for API call results
export type ResultList = {
  items: CallResult[];       // Array of call results
  total: number;            // Total number of results
};

// List response for API configurations
export type ConfigList = {
  items: ApiConfig[];       // Array of API configs
  total: number;           // Total number of configs
};

// Arguments for making an API call
export interface ApiCallArgs {
  id?: string;              // Optional config ID to use
  endpoint?: ApiInput;      // API configuration
  payload?: Record<string, unknown>;     // Request payload
  credentials?: Record<string, unknown>; // Authentication credentials
  options?: CallOptions;    // Call options
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
