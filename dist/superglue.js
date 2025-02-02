"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperglueClient = exports.PaginationType = exports.DecompressionMethod = exports.AuthType = exports.FileType = exports.CacheMode = exports.HttpMethod = void 0;
const axios_1 = __importDefault(require("axios"));
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["POST"] = "POST";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["DELETE"] = "DELETE";
    HttpMethod["PATCH"] = "PATCH";
    HttpMethod["HEAD"] = "HEAD";
    HttpMethod["OPTIONS"] = "OPTIONS";
})(HttpMethod || (exports.HttpMethod = HttpMethod = {}));
var CacheMode;
(function (CacheMode) {
    CacheMode["ENABLED"] = "ENABLED";
    CacheMode["READONLY"] = "READONLY";
    CacheMode["WRITEONLY"] = "WRITEONLY";
    CacheMode["DISABLED"] = "DISABLED";
})(CacheMode || (exports.CacheMode = CacheMode = {}));
var FileType;
(function (FileType) {
    FileType["CSV"] = "CSV";
    FileType["JSON"] = "JSON";
    FileType["XML"] = "XML";
    FileType["AUTO"] = "AUTO";
})(FileType || (exports.FileType = FileType = {}));
var AuthType;
(function (AuthType) {
    AuthType["NONE"] = "NONE";
    AuthType["OAUTH2"] = "OAUTH2";
    AuthType["HEADER"] = "HEADER";
    AuthType["QUERY_PARAM"] = "QUERY_PARAM";
})(AuthType || (exports.AuthType = AuthType = {}));
var DecompressionMethod;
(function (DecompressionMethod) {
    DecompressionMethod["GZIP"] = "GZIP";
    DecompressionMethod["DEFLATE"] = "DEFLATE";
    DecompressionMethod["NONE"] = "NONE";
    DecompressionMethod["AUTO"] = "AUTO";
    DecompressionMethod["ZIP"] = "ZIP";
})(DecompressionMethod || (exports.DecompressionMethod = DecompressionMethod = {}));
var PaginationType;
(function (PaginationType) {
    PaginationType["OFFSET_BASED"] = "OFFSET_BASED";
    PaginationType["PAGE_BASED"] = "PAGE_BASED";
    PaginationType["DISABLED"] = "DISABLED";
})(PaginationType || (exports.PaginationType = PaginationType = {}));
class SuperglueClient {
    constructor({ endpoint, apiKey }) {
        this.endpoint = endpoint !== null && endpoint !== void 0 ? endpoint : 'https://graphql.superglue.cloud';
        this.apiKey = apiKey;
    }
    async request(query, variables) {
        try {
            const response = await axios_1.default.post(this.endpoint, {
                query,
                variables,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                }
            });
            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }
            const json = response.data;
            return json.data;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async call({ id, endpoint, payload, credentials, options }) {
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
        const result = await this.request(mutation, {
            input: { id, endpoint },
            payload,
            credentials,
            options
        }).then(data => data === null || data === void 0 ? void 0 : data.call);
        if (result.error) {
            throw new Error(result.error);
        }
        return result;
    }
    async extract({ id, endpoint, options }) {
        const mutation = `
        mutation Extract($input: ExtractInputRequest!, $options: RequestOptions) {
          extract(input: $input, options: $options) {
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
        return this.request(mutation, {
            input: { id, endpoint },
            options
        }).then(data => data.extract);
    }
    async transform({ id, endpoint, data, options }) {
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
        return this.request(mutation, {
            input: { id, endpoint },
            data,
            options
        }).then(data => data.transform);
    }
    async listRuns(limit = 100, offset = 0) {
        const query = `
        query ListRuns($limit: Int!, $offset: Int!) {
          listRuns(limit: $limit, offset: $offset) {
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
        const response = await this.request(query, { limit, offset });
        return response.listRuns;
    }
    async getRun(id) {
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
        const response = await this.request(query, { id });
        return response.getRun;
    }
    async listApis(limit = 10, offset = 0) {
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
        const response = await this.request(query, { limit, offset });
        return response.listApis;
    }
    async listTransforms(limit = 10, offset = 0) {
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
            }
            total
          }
        }
      `;
        const response = await this.request(query, { limit, offset });
        return response.listTransforms;
    }
    async listExtracts(limit = 10, offset = 0) {
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
        const response = await this.request(query, { limit, offset });
        return response.listExtracts;
    }
    async getApi(id) {
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
        const response = await this.request(query, { id });
        return response.getApi;
    }
    async getTransform(id) {
        const query = `
        query GetTransform($id: ID!) {
          getTransform(id: $id) {
            id
            version
            createdAt
            updatedAt
            responseSchema
            responseMapping
          }
        }
      `;
        const response = await this.request(query, { id });
        return response.getTransform;
    }
    async getExtract(id) {
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
        const response = await this.request(query, { id });
        return response.getExtract;
    }
    async upsertApi(id, input) {
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
        const response = await this.request(mutation, { id, input });
        return response.upsertApi;
    }
    async deleteApi(id) {
        const mutation = `
        mutation DeleteApi($id: ID!) {
          deleteApi(id: $id)
        }
      `;
        const response = await this.request(mutation, { id });
        return response.deleteApi;
    }
    async createApi(input) {
        const mutation = `
        mutation CreateApi($input: JSON!) {
          createApi(input: $input) {
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
        const response = await this.request(mutation, { input });
        return response.createApi;
    }
    async upsertExtraction(id, input) {
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
        const response = await this.request(mutation, { id, input });
        return response.upsertExtraction;
    }
    async deleteExtraction(id) {
        const mutation = `
        mutation DeleteExtraction($id: ID!) {
          deleteExtraction(id: $id)
        }
      `;
        const response = await this.request(mutation, { id });
        return response.deleteExtraction;
    }
    async upsertTransformation(id, input) {
        const mutation = `
        mutation UpsertTransformation($id: ID!, $input: JSON!) {
          upsertTransformation(id: $id, input: $input) {
            id
            version
            createdAt
            updatedAt
            responseSchema
            responseMapping
          }
        }
      `;
        const response = await this.request(mutation, { id, input });
        return response.upsertTransformation;
    }
    async deleteTransformation(id) {
        const mutation = `
        mutation DeleteTransformation($id: ID!) {
          deleteTransformation(id: $id)
        }
      `;
        const response = await this.request(mutation, { id });
        return response.deleteTransformation;
    }
}
exports.SuperglueClient = SuperglueClient;
SuperglueClient.configQL = `
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
//# sourceMappingURL=superglue.js.map