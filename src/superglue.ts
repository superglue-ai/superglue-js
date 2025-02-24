import axios from "axios";


export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
  HEAD = "HEAD",
  OPTIONS = "OPTIONS"
}

export enum CacheMode {
  ENABLED = "ENABLED",
  READONLY = "READONLY",
  WRITEONLY = "WRITEONLY",
  DISABLED = "DISABLED"
}

export enum FileType {
  CSV = "CSV",
  JSON = "JSON",
  XML = "XML",
  AUTO = "AUTO"
}

export enum AuthType {
  NONE = "NONE",
  OAUTH2 = "OAUTH2",
  HEADER = "HEADER",
  QUERY_PARAM = "QUERY_PARAM"
}

export enum DecompressionMethod {
  GZIP = "GZIP",
  DEFLATE = "DEFLATE",
  NONE = "NONE",
  AUTO = "AUTO",
  ZIP = "ZIP"
}

export enum PaginationType {
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
  maxRateLimitWaitSec?: number;
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
  instruction: string;
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
  maxRateLimitWaitSec?: number;
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
  endpoint?: TransformInput;
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

// Arguments for making an API call
export interface ApiCallArgs {
  id?: string;              // Optional config ID to use
  endpoint?: ApiInput;      // API configuration
  payload?: Record<string, any>;     // Request payload
  credentials?: Record<string, any>; // Authentication credentials
  options?: RequestOptions;    // Call options
}

export interface TransformArgs {
  id?: string;
  endpoint?: TransformInput;
  data: Record<string, any>;
  options?: RequestOptions;
}

export interface ExtractArgs {
  id?: string;
  endpoint?: ExtractInput;
  file?: File | Blob;
  options?: RequestOptions;
  payload?: Record<string, any>;
  credentials?: Record<string, any>;
}

export class SuperglueClient {
    private endpoint: string;
    private apiKey: string;    

    private static configQL = `
    config {
      ... on ApiConfig {
        id
        version
        createdAt
        updatedAt
        urlHost
        urlPath
        instruction
        method
        queryParams
        headers
        body
        documentationUrl
        responseSchema
        responseMapping
        authentication
        pagination {
          type
          pageSize
        }
        dataPath
        maxRateLimitWaitSec
      }
      ... on ExtractConfig {
        id
        version
        createdAt
        updatedAt
        urlHost
        urlPath
        instruction
        queryParams
        method
        headers
        body
        documentationUrl
        decompressionMethod
        authentication
        fileType
        dataPath
      }
      ... on TransformConfig {
        id
        version
        createdAt
        updatedAt
        responseSchema
        responseMapping
      }
    }
    `;

    constructor({endpoint, apiKey}: {endpoint?: string, apiKey: string}) {
      this.endpoint = endpoint ?? 'https://graphql.superglue.cloud';
      this.apiKey = apiKey;
    }
  
    private async request<T>(query: string, variables?: Record<string, any>): Promise<T> {
        try { 
            const response = await axios.post(this.endpoint, {
                query,
                variables,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                }
            });  
            if(response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }
            const json = response.data;
            return json.data as T;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async call<T = unknown>({ id, endpoint, payload, credentials, options }: ApiCallArgs): Promise<RunResult & { data: T }> {
      const mutation = `
        mutation Call($input: ApiInputRequest!, $payload: JSON, $credentials: JSON, $options: RequestOptions) {
          call(input: $input, payload: $payload, credentials: $credentials, options: $options) {
            id
            success
            data
            error
            startedAt
            completedAt
            ${SuperglueClient.configQL}
          }
        }
      `;
  
      const result = await this.request<{ call: RunResult & { data: T } }>(mutation, {
        input: { id, endpoint },
        payload,
        credentials,
        options
      }).then(data => data?.call);

      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    }
  
    async extract<T = any>({
      id,
      endpoint,
      file,
      payload,
      credentials,    
      options
    }: ExtractArgs): Promise<RunResult & { data: T }> {
      const mutation = `
        mutation Extract($input: ExtractInputRequest!, $payload: JSON, $credentials: JSON, $options: RequestOptions) {
          extract(input: $input, payload: $payload, credentials: $credentials, options: $options) {
            id
            success
            data
            error
            startedAt
            completedAt
            ${SuperglueClient.configQL}
          }
        }
      `;

      if (file) {
        const operations = {
          query: mutation,
          variables: { 
            input: { file: null },
            payload,
            credentials,
            options 
          }
        };
    
        const formData = new FormData();
        formData.append('operations', JSON.stringify(operations));
        formData.append('map', JSON.stringify({ "0": ["variables.input.file"] }));
        formData.append('0', file);

        const response = await axios.post(this.endpoint, formData, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          }
        });

        if (response.data.errors) {
          throw new Error(response.data.errors[0].message);
        }

        return response.data.data.extract;
      }

      return this.request<{ extract: RunResult & { data: T } }>(mutation, {
        input: { id, endpoint },
        payload,
        credentials,
        options
      }).then(data => data.extract);
    }
  
    async transform<T = any>({
      id,
      endpoint,
      data,
      options
    }: TransformArgs): Promise<RunResult & { data: T }> {
      const mutation = `
        mutation Transform($input: TransformInputRequest!, $data: JSON!, $options: RequestOptions) {
          transform(input: $input, data: $data, options: $options) {
            id
            success
            data
            error
            startedAt
            completedAt
            ${SuperglueClient.configQL}
          }
        }
      `;
  
      return this.request<{ transform: RunResult & { data: T } }>(mutation, {
        input: { id, endpoint },
        data,
        options
      }).then(data => data.transform);
    }

    async listRuns(limit: number = 100, offset: number = 0, configId?: string): Promise<{ items: RunResult[], total: number }> {
      const query = `
        query ListRuns($limit: Int!, $offset: Int!, $configId: ID) {
          listRuns(limit: $limit, offset: $offset, configId: $configId) {
            items {
              id
              success
              data
              error
              startedAt
              completedAt
              ${SuperglueClient.configQL}
            }
            total
          }
        }
      `;
      const response = await this.request<{ listRuns: { items: RunResult[], total: number } }>(query, { limit, offset, configId }); 
      return response.listRuns;
    }

    async getRun(id: string): Promise<RunResult> {
      const query = `
        query GetRun($id: ID!) {
          getRun(id: $id) {
            id
            success
            data
            error
            startedAt
            completedAt
            ${SuperglueClient.configQL}
          }
        }
      `;
      const response = await this.request<{ getRun: RunResult }>(query, { id });
      return response.getRun;
    }
    
    async listApis(limit: number = 10, offset: number = 0): Promise<{ items: ApiConfig[], total: number }> {
      const query = `
        query ListApis($limit: Int!, $offset: Int!) {
          listApis(limit: $limit, offset: $offset) {
            items {
              id
              version
              createdAt
              updatedAt
              urlHost
              urlPath
              instruction
              method
              queryParams
              headers
              body
              documentationUrl
              responseSchema
              responseMapping
              authentication
              pagination {
                type
                pageSize
              }
              dataPath
              maxRateLimitWaitSec
            }
            total
          }
        }
      `;
      const response = await this.request<{ listApis: { items: ApiConfig[], total: number } }>(query, { limit, offset });
      return response.listApis;
    }

    async listTransforms(limit: number = 10, offset: number = 0): Promise<{ items: TransformConfig[], total: number }> {
      const query = `
        query ListTransforms($limit: Int!, $offset: Int!) {
          listTransforms(limit: $limit, offset: $offset) {
            items {
              id
              version
              createdAt
              updatedAt
              responseSchema
              responseMapping
              instruction
            }
            total
          }
        }
      `;
      const response = await this.request<{ listTransforms: { items: TransformConfig[], total: number } }>(query, { limit, offset });
      return response.listTransforms;
    }

    async listExtracts(limit: number = 10, offset: number = 0): Promise<{ items: ExtractConfig[], total: number }> {
      const query = `
        query ListExtracts($limit: Int!, $offset: Int!) {
          listExtracts(limit: $limit, offset: $offset) {
            items {
              id
              version
              createdAt
              updatedAt
              urlHost
              urlPath
              instruction
              queryParams
              method
              headers
              body
              documentationUrl
              decompressionMethod
              authentication
              fileType
              dataPath
            }
            total
          }
        }
      `;
      const response = await this.request<{ listExtracts: { items: ExtractConfig[], total: number } }>(query, { limit, offset });
      return response.listExtracts;
    }

    async getApi(id: string): Promise<ApiConfig> {
      const query = `
        query GetApi($id: ID!) {
          getApi(id: $id) {
            id
            version
            createdAt
            updatedAt
            urlHost
            urlPath
            instruction
            method
            queryParams
            headers
            body
            documentationUrl
            responseSchema
            responseMapping
            authentication
            pagination {
              type
              pageSize
            }
            dataPath
            maxRateLimitWaitSec
          }
        }
      `;
      const response = await this.request<{ getApi: ApiConfig }>(query, { id });
      return response.getApi;
    }

    async getTransform(id: string): Promise<TransformConfig> {
      const query = `
        query GetTransform($id: ID!) {
          getTransform(id: $id) {
            id
            version
            createdAt
            updatedAt
            responseSchema
            responseMapping
            instruction
          }
        }
      `;
      const response = await this.request<{ getTransform: TransformConfig }>(query, { id });
      return response.getTransform;
    }

    async getExtract(id: string): Promise<ExtractConfig> {
      const query = `
        query GetExtract($id: ID!) {
          getExtract(id: $id) {
            id
            version
            createdAt
            updatedAt
            urlHost
            urlPath
            instruction
            queryParams
            method
            headers
            body
            documentationUrl
            decompressionMethod
            authentication
            fileType
            dataPath
          }
        }
      `;
      const response = await this.request<{ getExtract: ExtractConfig }>(query, { id });
      return response.getExtract;
    }

    async upsertApi(id: string, input: Partial<ApiConfig>): Promise<ApiConfig> {
      const mutation = `
        mutation UpsertApi($id: ID!, $input: JSON!) {
          upsertApi(id: $id, input: $input) {
            id
            version
            createdAt
            updatedAt
            urlHost
            urlPath
            instruction
            method
            queryParams
            headers
            body
            documentationUrl
            responseSchema
            responseMapping
            authentication
            pagination {
              type
              pageSize
            }
            dataPath
            maxRateLimitWaitSec
          }
        }
      `;
      const response = await this.request<{ upsertApi: ApiConfig }>(mutation, { id, input });
      return response.upsertApi;
    }

    async deleteApi(id: string): Promise<boolean> {
      const mutation = `
        mutation DeleteApi($id: ID!) {
          deleteApi(id: $id)
        }
      `;
      const response = await this.request<{ deleteApi: boolean }>(mutation, { id });
      return response.deleteApi;
    }

    async upsertExtraction(id: string, input: Partial<ExtractConfig>): Promise<ExtractConfig> {
      const mutation = `
        mutation UpsertExtraction($id: ID!, $input: JSON!) {
          upsertExtraction(id: $id, input: $input) {
            id
            version
            createdAt
            updatedAt
            urlHost
            urlPath
            instruction
            queryParams
            method
            headers
            body
            documentationUrl
            decompressionMethod
            authentication
            fileType
            dataPath
          }
        }
      `;
      const response = await this.request<{ upsertExtraction: ExtractConfig }>(mutation, { id, input });
      return response.upsertExtraction;
    }

    async deleteExtraction(id: string): Promise<boolean> {
      const mutation = `
        mutation DeleteExtraction($id: ID!) {
          deleteExtraction(id: $id)
        }
      `;
      const response = await this.request<{ deleteExtraction: boolean }>(mutation, { id });
      return response.deleteExtraction;
    }

    async upsertTransformation(id: string, input: Partial<TransformConfig>): Promise<TransformConfig> {
      const mutation = `
        mutation UpsertTransformation($id: ID!, $input: JSON!) {
          upsertTransformation(id: $id, input: $input) {
            id
            version
            createdAt
            updatedAt
            responseSchema
            responseMapping
            instruction
          }
        }
      `;
      const response = await this.request<{ upsertTransformation: TransformConfig }>(mutation, { id, input });
      return response.upsertTransformation;
    }

    async deleteTransformation(id: string): Promise<boolean> {
      const mutation = `
        mutation DeleteTransformation($id: ID!) {
          deleteTransformation(id: $id)
        }
      `;
      const response = await this.request<{ deleteTransformation: boolean }>(mutation, { id });
      return response.deleteTransformation;
    }

    async generateSchema(instruction: string, responseData: string): Promise<any> {
      const query = `
        query GenerateSchema($instruction: String!, $responseData: String) {
          generateSchema(instruction: $instruction, responseData: $responseData)
        }
      `;
      const response = await this.request<{ generateSchema: string }>(query, { instruction, responseData });
      return response.generateSchema;
    }

}
  
  // Usage example:
  /*
  const client = new SuperglueClient({
    apiKey: '********'
  });
  
  // Make a call
  const config = {
    urlHost: "https://futuramaapi.com",
    urlPath: "/graphql",
    instruction: "get all characters from the show",
  };
  
  const result = await client.call({endpoint: config});
  */
  