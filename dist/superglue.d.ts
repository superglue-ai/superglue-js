import { ApiInput, CallOptions, CallResult, ExtractInput, ExtractResult, TransformInput, TransformResult } from "./types";
export declare class SuperglueClient {
    private endpoint;
    private apiKey;
    constructor({ endpoint, apiKey }: {
        endpoint?: string;
        apiKey: string;
    });
    private request;
    call<T = any>(endpoint: ApiInput, payload?: any, credentials?: any, options?: CallOptions): Promise<CallResult & {
        data: T;
    }>;
    extract<T = any>(endpoint: ExtractInput, credentials?: any, options?: CallOptions): Promise<ExtractResult & {
        data: T;
    }>;
    transform<T = any>(input: TransformInput, data: any, options?: CallOptions): Promise<TransformResult & {
        data: T;
    }>;
}
//# sourceMappingURL=superglue.d.ts.map