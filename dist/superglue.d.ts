import { ApiCallArgs, CallResult, ExtractArgs, ExtractResult, TransformArgs, TransformResult } from "./types.js";
export declare class SuperglueClient {
    private endpoint;
    private apiKey;
    constructor({ endpoint, apiKey }: {
        endpoint?: string;
        apiKey: string;
    });
    private request;
    call<T = unknown>({ id, endpoint, payload, credentials, options }: ApiCallArgs): Promise<CallResult & {
        data: T;
    }>;
    extract<T = any>({ id, endpoint, options }: ExtractArgs): Promise<ExtractResult & {
        data: T;
    }>;
    transform<T = any>({ id, endpoint, data, options }: TransformArgs): Promise<TransformResult & {
        data: T;
    }>;
}
//# sourceMappingURL=superglue.d.ts.map