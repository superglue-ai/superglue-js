import axios from "axios";

export type JSONSchema = any;
export type JSONata = string;
export type Upload = File | Blob;

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
  EXCEL = "EXCEL",
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
  CURSOR_BASED = "CURSOR_BASED", // Added new type
  DISABLED = "DISABLED"
}

export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR"
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

export interface Pagination {
  type: PaginationType;
  pageSize?: string;
  cursorPath?: string;
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
  responseSchema?: JSONSchema;
  responseMapping?: JSONata;
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
  instruction: string;
  responseSchema: JSONSchema;
  responseMapping?: JSONata;
}

export interface ExecutionStep {
  id: string;
  apiConfig: ApiConfig;
  executionMode?: 'DIRECT' | 'LOOP';
  loopSelector?: JSONata;
  loopMaxIters?: number;
  inputMapping?: JSONata;
  responseMapping?: JSONata;
}

export interface Workflow extends BaseConfig {
  steps: ExecutionStep[];
  finalTransform?: JSONata;
  inputSchema?: JSONSchema;
  responseSchema?: JSONSchema;
  instruction?: string;
}

export interface WorkflowStepResult {
  stepId: string;
  config?: ApiConfig; 
  success: boolean;
  rawData?: any;
  transformedData?: any;
  error?: string;
}

export interface WorkflowResult extends BaseResult {
  config: Workflow;
  stepResults: WorkflowStepResult[];
}

export interface Log {
  id: string;
  message: string;
  level: LogLevel;
  timestamp: Date;
  runId?: string;
}

export interface SystemInput {
  id: string;
  urlHost: string;
  urlPath?: string;
  documentationUrl?: string;
  documentation?: string;
  credentials?: Record<string, string>;
}

export type RunResult = BaseResult & {
  config: ApiConfig | ExtractConfig | TransformConfig | Workflow;
};

export type ApiInputRequest = {
  id?: string;
  endpoint?: ApiConfig;
};

export type ExtractInputRequest = {
  id?: string;
  endpoint?: ExtractConfig;
  file?: Upload;
};

export type TransformInputRequest = {
  id?: string;
  endpoint?: TransformConfig;
};

export type WorkflowInputRequest = {
  id?: string;
  workflow?: Workflow;
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
  endpoint?: ApiConfig;
  payload?: Record<string, any>;
  credentials?: Record<string, string>;
  options?: RequestOptions;
}

export interface TransformArgs {
  id?: string;
  endpoint?: TransformConfig;
  data: Record<string, any>;
  options?: RequestOptions;
}

export interface ExtractArgs {
  id?: string;
  endpoint?: ExtractConfig;
  file?: Upload;
  options?: RequestOptions;
  payload?: Record<string, any>;
  credentials?: Record<string, string>;
}

export interface WorkflowArgs {
  id?: string;
  workflow?: Workflow;
  payload?: Record<string, any>;
  credentials?: Record<string, string>;
  options?: RequestOptions;
}

export class SuperglueClient {
    private endpoint: string;
    private apiKey: string;    
    private static workflowQL = `
        id
        version
        createdAt
        updatedAt
        steps {
          id
          apiConfig {
            id
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
              cursorPath
            }
            dataPath
          }
          executionMode
          loopSelector
          loopMaxIters
          inputMapping
          responseMapping
        }
        responseSchema
        finalTransform
        inputSchema
    `;
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
          cursorPath
        }
        dataPath
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
        instruction
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
  
      let gqlInput: Partial<ApiInputRequest> = {};

      if (id) {
        gqlInput = { id };
      } else if (endpoint) {
        const apiInput = {
          id: endpoint.id,
          urlHost: endpoint.urlHost,
          instruction: endpoint.instruction,
          urlPath: endpoint.urlPath,
          method: endpoint.method,
          queryParams: endpoint.queryParams,
          headers: endpoint.headers,
          body: endpoint.body,
          documentationUrl: endpoint.documentationUrl,
          responseSchema: endpoint.responseSchema,
          responseMapping: endpoint.responseMapping,
          authentication: endpoint.authentication,
          pagination: endpoint.pagination ? {
            type: endpoint.pagination.type,
            ...(endpoint.pagination.pageSize !== undefined && { pageSize: endpoint.pagination.pageSize }),
            ...(endpoint.pagination.cursorPath !== undefined && { cursorPath: endpoint.pagination.cursorPath }),
          } : undefined,
          dataPath: endpoint.dataPath,
          version: endpoint.version,
        };
        // Remove undefined optional fields
        Object.keys(apiInput).forEach(key => (apiInput as any)[key] === undefined && delete (apiInput as any)[key]);
        gqlInput = { endpoint: apiInput };
      } else {
        throw new Error("Either id or endpoint must be provided for call.");
      }

      const result = await this.request<{ call: RunResult & { data: T } }>(mutation, {
        input: gqlInput,
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
            input: { file: null }, // This adheres to GQL multipart spec for file uploads
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

      let gqlInput: Partial<ExtractInputRequest> = {};
      if (id) {
        gqlInput = { id };
      } else if (endpoint) {
        const extractInput = {
          id: endpoint.id,
          urlHost: endpoint.urlHost,
          instruction: endpoint.instruction,
          urlPath: endpoint.urlPath,
          queryParams: endpoint.queryParams,
          method: endpoint.method,
          headers: endpoint.headers,
          body: endpoint.body,
          documentationUrl: endpoint.documentationUrl,
          decompressionMethod: endpoint.decompressionMethod,
          fileType: endpoint.fileType,
          authentication: endpoint.authentication,
          dataPath: endpoint.dataPath,
          version: endpoint.version,
        };
        Object.keys(extractInput).forEach(key => (extractInput as any)[key] === undefined && delete (extractInput as any)[key]);
        gqlInput = { endpoint: extractInput };
      } else {
        // If file is not provided, either id or endpoint must be.
        throw new Error("Either id, endpoint, or file must be provided for extract.");
      }

      return this.request<{ extract: RunResult & { data: T } }>(mutation, {
        input: gqlInput,
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
  
      let gqlInput: Partial<TransformInputRequest> = {};
      if (id) {
        gqlInput = { id };
      } else if (endpoint) {
        const transformInput = {
          id: endpoint.id,
          instruction: endpoint.instruction,
          responseSchema: endpoint.responseSchema,
          responseMapping: endpoint.responseMapping,
          version: endpoint.version,
        };
        Object.keys(transformInput).forEach(key => (transformInput as any)[key] === undefined && delete (transformInput as any)[key]);
        gqlInput = { endpoint: transformInput };
      } else {
        throw new Error("Either id or endpoint must be provided for transform.");
      }

      return this.request<{ transform: RunResult & { data: T } }>(mutation, {
        input: gqlInput,
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

    async getWorkflow(id: string): Promise<Workflow> {
      const query = `
        query GetWorkflow($id: ID!) {
          getWorkflow(id: $id) {
            id
            version
            createdAt
            updatedAt
            steps {
              id
              apiConfig {
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
                  cursorPath
                }
                dataPath
              }
              executionMode
              loopSelector
              loopMaxIters
              inputMapping
              responseMapping
            }
            finalTransform
            inputSchema
            responseSchema
            instruction
          }
        }
      `;
      const response = await this.request<{ getWorkflow: Workflow }>(query, { id });
      return response.getWorkflow;
    }

    async listWorkflows(limit: number = 10, offset: number = 0): Promise<{ items: Workflow[], total: number }> {
      const query = `
        query ListWorkflows($limit: Int!, $offset: Int!) {
          listWorkflows(limit: $limit, offset: $offset) {
            items {${SuperglueClient.workflowQL}}
            total
          }
        }
      `;
      // Note: The schema indicates listWorkflows returns [Workflow!]!, not a structure with items/total.
      const response = await this.request<{ listWorkflows: { items: Workflow[], total: number } }>(query, { limit, offset });
      return response.listWorkflows;
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

    async updateApiConfigId(oldId: string, newId: string): Promise<ApiConfig> {
      const mutation = `
        mutation UpdateApiConfigId($oldId: ID!, $newId: ID!) {
          updateApiConfigId(oldId: $oldId, newId: $newId) {
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
          }
        }
      `;
      const response = await this.request<{ updateApiConfigId: ApiConfig }>(mutation, { oldId, newId });
      return response.updateApiConfigId;
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

    async executeWorkflow<T = any>({
      id,
      workflow,
      payload,
      credentials,
      options
    }: WorkflowArgs): Promise<WorkflowResult & { data?: T }> {
      const mutation = `
        mutation ExecuteWorkflow($input: WorkflowInputRequest!, $payload: JSON, $credentials: JSON, $options: RequestOptions) {
          executeWorkflow(input: $input, payload: $payload, credentials: $credentials, options: $options) {
            success
            data
            config {${SuperglueClient.workflowQL}}
            stepResults {
              stepId
              success
              rawData
              transformedData
              error
            }
            error
            startedAt
            completedAt
          }
        }
      `;

      let gqlInput: Partial<WorkflowInputRequest> = {};

      if (id) {
        gqlInput = { id };
      } else if (workflow) {
        const workflowInput = {
          id: workflow.id,
          steps: workflow.steps.map(step => {
            const apiConfigInput = {
              id: step.apiConfig.id,
              urlHost: step.apiConfig.urlHost,
              instruction: step.apiConfig.instruction,
              urlPath: step.apiConfig.urlPath,
              method: step.apiConfig.method,
              queryParams: step.apiConfig.queryParams,
              headers: step.apiConfig.headers,
              body: step.apiConfig.body,
              documentationUrl: step.apiConfig.documentationUrl,
              responseSchema: step.apiConfig.responseSchema,
              responseMapping: step.apiConfig.responseMapping,
              authentication: step.apiConfig.authentication,
              pagination: step.apiConfig.pagination ? {
                type: step.apiConfig.pagination.type,
                ...(step.apiConfig.pagination.pageSize !== undefined && { pageSize: step.apiConfig.pagination.pageSize }),
                ...(step.apiConfig.pagination.cursorPath !== undefined && { cursorPath: step.apiConfig.pagination.cursorPath }),
              } : undefined,
              dataPath: step.apiConfig.dataPath,
              version: step.apiConfig.version,
            };
            Object.keys(apiConfigInput).forEach(key => (apiConfigInput as any)[key] === undefined && delete (apiConfigInput as any)[key]);
            
            const executionStepInput = {
              id: step.id,
              apiConfig: apiConfigInput,
              executionMode: step.executionMode,
              loopSelector: step.loopSelector,
              loopMaxIters: step.loopMaxIters,
              inputMapping: step.inputMapping,
              responseMapping: step.responseMapping,
            };
            Object.keys(executionStepInput).forEach(key => (executionStepInput as any)[key] === undefined && delete (executionStepInput as any)[key]);
            return executionStepInput;
          }),
          finalTransform: workflow.finalTransform,
          inputSchema: workflow.inputSchema,
          responseSchema: workflow.responseSchema,
          instruction: workflow.instruction,
        };
        Object.keys(workflowInput).forEach(key => (workflowInput as any)[key] === undefined && delete (workflowInput as any)[key]);
        gqlInput = { workflow: workflowInput };
      } else {
        throw new Error("Either id or workflow must be provided for executeWorkflow.");
      }

      return this.request<{ executeWorkflow: WorkflowResult & { data: T } }>(mutation, {
        input: gqlInput,
        payload,
        credentials,
        options
      }).then(data => data.executeWorkflow);
    }

    async buildWorkflow(instruction: string, payload: any, systems: Array<SystemInput>, responseSchema?: JSONSchema): Promise<Workflow> {
      const mutation = `
        mutation BuildWorkflow($instruction: String!, $payload: JSON!, $systems: [SystemInput!]!, $responseSchema: JSONSchema) {
          buildWorkflow(instruction: $instruction, payload: $payload, systems: $systems, responseSchema: $responseSchema) {${SuperglueClient.workflowQL}}
        }
      `;

      return this.request<{ buildWorkflow: Workflow }>(mutation, {
        instruction,
        payload,
        systems,
        responseSchema: responseSchema ?? {}
      }).then(data => data.buildWorkflow);
    }

    async upsertWorkflow(id: string, input: Partial<Workflow>): Promise<Workflow> {
      const mutation = `
        mutation UpsertWorkflow($id: ID!, $input: JSON!) {
          upsertWorkflow(id: $id, input: $input) {${SuperglueClient.workflowQL}}
        }
      `;

      return this.request<{ upsertWorkflow: Workflow }>(mutation, { id, input })
        .then(data => data.upsertWorkflow);
    }

    async deleteWorkflow(id: string): Promise<boolean> {
      const mutation = `
        mutation DeleteWorkflow($id: ID!) {
          deleteWorkflow(id: $id)
        }
      `;
      return this.request<{ deleteWorkflow: boolean }>(mutation, { id })
        .then(data => data.deleteWorkflow);
    }
}
  
  // Usage example:
  /*
  const client = new SuperglueClient({
    apiKey: '********'
  });
  
  // Make a call
  const config = {
    id: "futurama-api",
    urlHost: "https://futuramaapi.com",
    urlPath: "/graphql",
    instruction: "get all characters from the show",
  };
  
  const result = await client.call({endpoint: config});
  */
  