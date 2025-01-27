"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperglueClient = void 0;
const axios_1 = __importDefault(require("axios"));
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
    // Mutations
    async call({ id, endpoint, payload, credentials, options }) {
        const mutation = `
        mutation Call($input: ApiInputRequest!, $payload: JSON, $credentials: JSON, $options: CallOptions) {
          call(input: $input, payload: $payload, credentials: $credentials, options: $options) {
            id
            success
            data
            error
            startedAt
            completedAt
            config {
              id
              url
              instruction
              method
            }
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
        mutation Extract($input: ExtractInputRequest!, $options: CallOptions) {
          extract(input: $input, options: $options) {
            id
            success
            data
            error
            startedAt
            completedAt
            config {
              id
              url
              instruction
              method
            }
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
        mutation Transform($input: TransformInputRequest!, $data: JSON!, $options: CallOptions) {
          transform(input: $input, data: $data, options: $options) {
            id
            success
            data
            error
            startedAt
            completedAt
            config {
              id
              version
              createdAt
              updatedAt
              responseSchema
              responseMapping
            }
          }
        }
      `;
        return this.request(mutation, {
            input: { id, endpoint },
            data,
            options
        }).then(data => data.transform);
    }
}
exports.SuperglueClient = SuperglueClient;
// Usage example:
/*
const client = new SuperglueClient({
  apiKey: '********'
});

// Make a call
const result = await client.call({
  url: 'https://api.example.com',
  instruction: 'Fetch data'
});
*/
//# sourceMappingURL=superglue.js.map