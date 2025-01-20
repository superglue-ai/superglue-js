import { ApiInput, CallOptions, CallResult, ExtractInput, ExtractResult, ResultList, TransformInput, TransformResult } from "./types";

export class SuperglueClient {
    private endpoint: string;
    private apiKey: string;    


    constructor({endpoint, apiKey}: {endpoint?: string, apiKey: string}) {
      this.endpoint = endpoint ?? 'https://graphql.superglue.cloud';
      this.apiKey = apiKey;
    }
  
    private async request<T>(query: string, variables?: Record<string, any>): Promise<T> {
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
  
      return json.data as T;
    }
  
    // Mutations
    async call<T = any>(
      endpoint: ApiInput,
      payload?: any,
      credentials?: any,
      options?: CallOptions
    ): Promise<CallResult & { data: T }> {

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
  
      return this.request<{ call: CallResult & { data: T } }>(mutation, {
        endpoint,
        payload,
        credentials,
        options,
      }).then(data => data.call);
    }
  
    async extract<T = any>(
      endpoint: ExtractInput,
      credentials?: any,
      options?: CallOptions
    ): Promise<ExtractResult & { data: T }> {
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
  
      return this.request<{ extract: ExtractResult & { data: T } }>(mutation, {
        endpoint,
        credentials,
        options,
      }).then(data => data.extract);
    }
  
    async transform<T = any>(
      input: TransformInput,
      data: any,
      options?: CallOptions
    ): Promise<TransformResult & { data: T }> {
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
  
      return this.request<{ transform: TransformResult & { data: T } }>(mutation, {
        input,
        data,
        options,
      }).then(data => data.transform);
    }
  }
  
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
  