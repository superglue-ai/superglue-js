"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperglueClient = void 0;
class SuperglueClient {
    constructor({ endpoint, apiKey }) {
        this.endpoint = endpoint !== null && endpoint !== void 0 ? endpoint : 'https://graphql.superglue.cloud';
        this.apiKey = apiKey;
    }
    async request(query, variables) {
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                query,
                variables,
            }),
        });
        const json = await response.json();
        if (json.errors) {
            throw new Error(json.errors[0].message);
        }
        return json.data;
    }
    // Mutations
    async call(endpoint, payload, credentials, options) {
        const mutation = `
        mutation Call($endpoint: ApiInput!, $payload: JSON, $credentials: JSON, $options: CallOptions) {
          call(endpoint: $endpoint, payload: $payload, credentials: $credentials, options: $options) {
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
            endpoint,
            payload,
            credentials,
            options,
        }).then(data => data.call);
    }
    async extract(endpoint, credentials, options) {
        const mutation = `
        mutation Extract($endpoint: ExtractInput!, $credentials: JSON, $options: CallOptions) {
          extract(endpoint: $endpoint, credentials: $credentials, options: $options) {
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
            endpoint,
            credentials,
            options,
        }).then(data => data.extract);
    }
    async transform(input, data, options) {
        const mutation = `
        mutation Transform($input: TransformInput!, $data: JSON!, $options: CallOptions) {
          transform(input: $input, data: $data, options: $options) {
            id
            success
            data
            error
            startedAt
            completedAt
            config {
              responseSchema
              responseMapping
            }
          }
        }
      `;
        return this.request(mutation, {
            input,
            data,
            options,
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