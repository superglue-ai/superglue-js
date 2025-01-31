import { ApiCallArgs, ApiConfig, ExtractArgs, ExtractConfig, RunResult, TransformArgs, TransformConfig } from "./types";
export declare class SuperglueClient {
    private endpoint;
    private apiKey;
    private static configQL;
    constructor({ endpoint, apiKey }: {
        endpoint?: string;
        apiKey: string;
    });
    private request;
    call<T = unknown>({ id, endpoint, payload, credentials, options }: ApiCallArgs): Promise<RunResult & {
        data: T;
    }>;
    extract<T = any>({ id, endpoint, options }: ExtractArgs): Promise<RunResult & {
        data: T;
    }>;
    transform<T = any>({ id, endpoint, data, options }: TransformArgs): Promise<RunResult & {
        data: T;
    }>;
    listRuns(limit?: number, offset?: number): Promise<{
        items: RunResult[];
        total: number;
    }>;
    getRun(id: string): Promise<RunResult>;
    listApis(limit?: number, offset?: number): Promise<{
        items: ApiConfig[];
        total: number;
    }>;
    listTransforms(limit?: number, offset?: number): Promise<{
        items: TransformConfig[];
        total: number;
    }>;
    listExtracts(limit?: number, offset?: number): Promise<{
        items: ExtractConfig[];
        total: number;
    }>;
    getApi(id: string): Promise<ApiConfig>;
    getTransform(id: string): Promise<TransformConfig>;
    getExtract(id: string): Promise<ExtractConfig>;
    upsertApi(id: string, input: Record<string, unknown>): Promise<ApiConfig>;
    deleteApi(id: string): Promise<boolean>;
    createApi(input: Record<string, unknown>): Promise<ApiConfig>;
    upsertExtraction(id: string, input: Record<string, unknown>): Promise<ExtractConfig>;
    deleteExtraction(id: string): Promise<boolean>;
    upsertTransformation(id: string, input: Record<string, unknown>): Promise<TransformConfig>;
    deleteTransformation(id: string): Promise<boolean>;
}
//# sourceMappingURL=superglue.d.ts.map