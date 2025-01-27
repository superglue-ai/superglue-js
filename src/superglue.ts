import axios from "axios";
import { ApiCallArgs, CallResult, ExtractArgs, ExtractResult, TransformArgs, TransformResult } from "./types.js";

export class SuperglueClient {
    private endpoint: string;
    private apiKey: string;    


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
    // Mutations
    async call<T = unknown>({ id, endpoint, payload, credentials, options }: ApiCallArgs): Promise<CallResult & { data: T }> {
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
  
      const result = await this.request<{ call: CallResult & { data: T } }>(mutation, {
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
      options
    }: ExtractArgs): Promise<ExtractResult & { data: T }> {
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
  
      return this.request<{ extract: ExtractResult & { data: T } }>(mutation, {
        input: { id, endpoint },
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
  
      return this.request<{ transform: TransformResult & { data: T } }>(mutation, {
        input: { id, endpoint },
        data,
        options
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
  