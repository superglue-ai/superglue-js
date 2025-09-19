import axios from "axios";
import { LogSubscriptionOptions, WebSocketManager, WebSocketSubscription } from "./websocket-manager.js";
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
  RAW = "RAW",
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

export enum UpsertMode {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  UPSERT = "UPSERT"
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
  headers?: Record<string, any>;
  statusCode?: number;
  startedAt: Date;
  completedAt: Date;
}

export interface Pagination {
  type: PaginationType;
  pageSize?: string;
  cursorPath?: string;
  stopCondition?: string;
}

export interface ApiConfig extends BaseConfig {
  urlHost?: string;
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
  urlHost?: string;
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
  integrationId?: string;
  executionMode?: 'DIRECT' | 'LOOP';
  loopSelector?: JSONata;
  loopMaxIters?: number;
  inputMapping?: JSONata;
  responseMapping?: JSONata;
}

export interface Workflow extends BaseConfig {
  steps: ExecutionStep[];
  integrationIds?: string[];
  finalTransform?: JSONata;
  inputSchema?: JSONSchema;
  responseSchema?: JSONSchema;
  instruction?: string;
  originalResponseSchema?: JSONSchema;
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

export interface Integration extends BaseConfig {
  name?: string;
  type?: string;
  urlHost?: string;
  urlPath?: string;
  credentials?: Record<string, any>;
  documentationUrl?: string;
  documentation?: string;
  documentationPending?: boolean;
  openApiSchema?: string;
  openApiUrl?: string;
  specificInstructions?: string;
  documentationKeywords?: string[];
  icon?: string;
}

export interface IntegrationInput {
  id: string;
  urlHost?: string;
  urlPath?: string;
  documentationUrl?: string;
  documentation?: string;
  documentationPending?: boolean;
  specificInstructions?: string;
  documentationKeywords?: string[];
  credentials?: Record<string, string>;
}

export interface SuggestedIntegration {
  id: string;
  reason: string;
  savedCredentials: string[];
}

export interface Log {
  id: string;
  message: string;
  level: LogLevel;
  timestamp: Date;
  runId?: string;
}

export type RunResult = ApiResult | ExtractResult | TransformResult | WorkflowResult;

export type TransformResult = BaseResult & {
  config: TransformConfig;
};

export type ExtractResult = BaseResult & {
  config: ExtractConfig;
};

export type ApiResult = BaseResult & {
  config: ApiConfig;
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
  selfHealing?: SelfHealingMode;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  webhookUrl?: string;
  testMode?: boolean;
};

export enum SelfHealingMode {
    ENABLED = "ENABLED",
    TRANSFORM_ONLY = "TRANSFORM_ONLY",
    REQUEST_ONLY = "REQUEST_ONLY",
    DISABLED = "DISABLED"
}

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
  verbose?: boolean;
}

export interface BuildWorkflowArgs {
  instruction: string;
  payload?: Record<string, any>;
  integrationIds?: string[];
  responseSchema?: JSONSchema;
  save?: boolean;
  verbose?: boolean;
}

export type IntegrationList = {
  items: Integration[];
  total: number;
};

export class SuperglueClient {
    private endpoint: string;
    private apiKey: string;
    private wsManager: WebSocketManager;
    
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
              stopCondition
            }
            dataPath
          }
          integrationId
          executionMode
          loopSelector
          loopMaxIters
          inputMapping
          responseMapping
        }
        integrationIds
        responseSchema
        originalResponseSchema
        finalTransform
        inputSchema
        instruction
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
          stopCondition
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
      ... on Workflow {
        ${SuperglueClient.workflowQL}
      }
    }
    `;

    constructor({endpoint, apiKey}: {endpoint?: string, apiKey: string}) {
      this.endpoint = endpoint ?? 'https://graphql.superglue.cloud';
      this.apiKey = apiKey;
      this.wsManager = new WebSocketManager(this.endpoint, this.apiKey);
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

    // WebSocket methods delegated to WebSocketManager
    async subscribeToLogs(options: LogSubscriptionOptions = {}): Promise<WebSocketSubscription> {
      return this.wsManager.subscribeToLogs(options);
    }

    async disconnect(): Promise<void> {
      return this.wsManager.disconnect();
    }

    // Enhanced executeWorkflow with log subscription
    async executeWorkflow<T = any>({
      id,
      workflow,
      payload,
      credentials,
      options,
      verbose = true
    }: WorkflowArgs): Promise<WorkflowResult & { data?: T }> {
      const mutation = `
        mutation ExecuteWorkflow($input: WorkflowInputRequest!, $payload: JSON, $credentials: JSON, $options: RequestOptions) {
          executeWorkflow(input: $input, payload: $payload, credentials: $credentials, options: $options) {
            id
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
                ...(step.apiConfig.pagination.stopCondition !== undefined && { stopCondition: step.apiConfig.pagination.stopCondition }),
              } : undefined,
              dataPath: step.apiConfig.dataPath,
              version: step.apiConfig.version,
            };
            Object.keys(apiConfigInput).forEach(key => (apiConfigInput as any)[key] === undefined && delete (apiConfigInput as any)[key]);
            
            const executionStepInput = {
              id: step.id,
              apiConfig: apiConfigInput,
              integrationId: step.integrationId,
              executionMode: step.executionMode,
              loopSelector: step.loopSelector,
              loopMaxIters: step.loopMaxIters,
              inputMapping: step.inputMapping,
              responseMapping: step.responseMapping,
            };
            Object.keys(executionStepInput).forEach(key => (executionStepInput as any)[key] === undefined && delete (executionStepInput as any)[key]);
            return executionStepInput;
          }),
          integrationIds: workflow.integrationIds,
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

      // Set up log subscription if verbose is enabled
      let logSubscription: WebSocketSubscription | undefined;
      if (verbose) {
        try {
        logSubscription = await this.subscribeToLogs({
          onLog: (log: Log) => {
            const timestamp = log.timestamp.toLocaleTimeString();
            const levelColor = log.level === 'ERROR' ? '\x1b[31m' : 
                              log.level === 'WARN' ? '\x1b[33m' : 
                              log.level === 'DEBUG' ? '\x1b[36m' : '\x1b[0m';
            console.log(`${levelColor}[${timestamp}] ${log.level}\x1b[0m: ${log.message}`);
          },
          onError: (error: Error) => {
            console.error('Log subscription error:', error);
          },
            includeDebug: true
          });
        } catch (error) {
          console.error('Log subscription error:', error);
        }
      }

      try {
        const result = await this.request<{ executeWorkflow: WorkflowResult & { data: T } }>(mutation, {
          input: gqlInput,
          payload,
          credentials,
          options
        }).then(data => data.executeWorkflow);

        if (result.error) {
          throw new Error(result.error);
        }

        return result;
      } finally {
        // Clean up log subscription
        if (logSubscription) {
          // Wait a bit to catch any final logs
          setTimeout(() => {
            logSubscription.unsubscribe();
          }, 1000);
        }
      }
    }

    async buildWorkflow({instruction, payload, integrationIds, responseSchema, save = true, verbose = true}: BuildWorkflowArgs): Promise<Workflow> {
      const mutation = `
        mutation BuildWorkflow($instruction: String!, $payload: JSON, $integrationIds: [ID!], $responseSchema: JSONSchema) {
          buildWorkflow(instruction: $instruction, payload: $payload, integrationIds: $integrationIds, responseSchema: $responseSchema) {${SuperglueClient.workflowQL}}
        }
      `;

      let logSubscription: WebSocketSubscription | undefined;
      if (verbose) {
        try {
        logSubscription = await this.subscribeToLogs({
          onLog: (log: Log) => {
            const timestamp = log.timestamp.toLocaleTimeString();
            const levelColor = log.level === 'ERROR' ? '\x1b[31m' : 
                              log.level === 'WARN' ? '\x1b[33m' : 
                              log.level === 'DEBUG' ? '\x1b[36m' : '\x1b[0m';
            console.log(`${levelColor}[${timestamp}] ${log.level}\x1b[0m: ${log.message}`);
          },
          onError: (error: Error) => {
            console.error('Log subscription error:', error);
          },
          includeDebug: true
        });
        } catch (error) {
          console.error('Log subscription error:', error);
        }
      }

      try {
        const workflow = await this.request<{ buildWorkflow: Workflow }>(mutation, {
          instruction,
          payload,
          integrationIds,
          responseSchema: responseSchema ?? {}
        }).then(data => data.buildWorkflow);

        if (save) {
          await this.upsertWorkflow(workflow.id, workflow);
        }

        return workflow;
      } finally {
        // Clean up log subscription
        if (logSubscription) {
          // Wait a bit to catch any final logs
          setTimeout(() => {
            logSubscription.unsubscribe();
          }, 2000);
        }
      }
    }

    async call<T = unknown>({ id, endpoint, payload, credentials, options }: ApiCallArgs): Promise<ApiResult & { data: T }> {
      const mutation = `
        mutation Call($input: ApiInputRequest!, $payload: JSON, $credentials: JSON, $options: RequestOptions) {
          call(input: $input, payload: $payload, credentials: $credentials, options: $options) {
            id
            success
            data
            error
            headers
            statusCode
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
            ...(endpoint.pagination.stopCondition !== undefined && { stopCondition: endpoint.pagination.stopCondition }),
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

      const result = await this.request<{ call: ApiResult & { data: T } }>(mutation, {
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
    }: ExtractArgs): Promise<ExtractResult & { data: T }> {
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

      return this.request<{ extract: ExtractResult & { data: T } }>(mutation, {
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
    }: TransformArgs): Promise<TransformResult & { data: T }> {
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

      return this.request<{ transform: TransformResult & { data: T } }>(mutation, {
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
              headers
              statusCode
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
            headers
            statusCode
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
                cursorPath
                stopCondition
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
              cursorPath
              stopCondition
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
                  stopCondition
                }
                dataPath
              }
              integrationId
              executionMode
              loopSelector
              loopMaxIters
              inputMapping
              responseMapping
            }
            integrationIds
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
              cursorPath
              stopCondition
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
              cursorPath
              stopCondition
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

    async listIntegrations(limit: number = 10, offset: number = 0): Promise<{ items: Integration[], total: number }> {
      const query = `
        query ListIntegrations($limit: Int!, $offset: Int!) {
          listIntegrations(limit: $limit, offset: $offset) {
            items {
              id
              name
              type
              urlHost
              urlPath
              credentials
              documentationUrl
              documentationPending
              openApiSchema
              openApiUrl
              specificInstructions
              documentationKeywords
              icon
              version
              createdAt
              updatedAt
            }
            total
          }
        }
      `;
      const response = await this.request<{ listIntegrations: { items: Integration[], total: number } }>(query, { limit, offset });
      return response.listIntegrations;
    }

    async findRelevantIntegrations(instruction: string): Promise<SuggestedIntegration[]> {
      const query = `
        query FindRelevantIntegrations($instruction: String) {
          findRelevantIntegrations(instruction: $instruction) {
            reason
            integration {
              id
              name
              type
              urlHost
              urlPath
              credentials
              documentationUrl
              documentation
              documentationPending
              openApiUrl
              openApiSchema
              specificInstructions
              documentationKeywords
              icon
              version
              createdAt
              updatedAt
            }
          }
        }
      `;
      const response = await this.request<{ findRelevantIntegrations: SuggestedIntegration[] }>(query, { instruction });
      return response.findRelevantIntegrations;
    }

    async getIntegration(id: string): Promise<Integration> {
      const query = `
        query GetIntegration($id: ID!) {
          getIntegration(id: $id) {
            id
            name
            type
            urlHost
            urlPath
            credentials
            documentationUrl
            documentation
            documentationPending
            openApiSchema
            openApiUrl
            specificInstructions
            documentationKeywords
            icon
            version
            createdAt
            updatedAt
          }
        }
      `;
      const response = await this.request<{ getIntegration: Integration }>(query, { id });
      return response.getIntegration;
    }

    async upsertIntegration(id: string, input: Partial<Integration>, mode: UpsertMode = UpsertMode.UPSERT): Promise<Integration> {
      const mutation = `
        mutation UpsertIntegration($input: IntegrationInput!, $mode: UpsertMode) {
          upsertIntegration(input: $input, mode: $mode) {
            id
            name
            type
            urlHost
            urlPath
            credentials
            documentationUrl
            documentation
            documentationPending
            openApiSchema
            openApiUrl
            specificInstructions
            documentationKeywords
            icon
            version
            createdAt
            updatedAt
          }
        }
      `;
      // The backend expects the id to be in the input object
      const integrationInput = { id, ...input };
      const response = await this.request<{ upsertIntegration: Integration }>(mutation, { input: integrationInput, mode });
      return response.upsertIntegration;
    }

    async deleteIntegration(id: string): Promise<boolean> {
      const mutation = `
        mutation DeleteIntegration($id: ID!) {
          deleteIntegration(id: $id)
        }
      `;
      const response = await this.request<{ deleteIntegration: boolean }>(mutation, { id });
      return response.deleteIntegration;
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
  