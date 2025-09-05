import { z } from "zod";
import { ObsidianRestApiService } from "../../../services/obsidianRestAPI/index.js";
import { VaultCacheService } from "../../../services/obsidianRestAPI/vaultCache/index.js";
import { RequestContext } from "../../../utils/index.js";
declare const ObsidianGlobalSearchInputSchema: z.ZodObject<{
    query: z.ZodString;
    searchInPath: z.ZodOptional<z.ZodString>;
    contextLength: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    modified_since: z.ZodOptional<z.ZodString>;
    modified_until: z.ZodOptional<z.ZodString>;
    useRegex: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    caseSensitive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    pageSize: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    maxMatchesPerFile: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    caseSensitive: boolean;
    query: string;
    contextLength: number;
    useRegex: boolean;
    pageSize: number;
    page: number;
    maxMatchesPerFile: number;
    searchInPath?: string | undefined;
    modified_since?: string | undefined;
    modified_until?: string | undefined;
}, {
    query: string;
    caseSensitive?: boolean | undefined;
    searchInPath?: string | undefined;
    contextLength?: number | undefined;
    modified_since?: string | undefined;
    modified_until?: string | undefined;
    useRegex?: boolean | undefined;
    pageSize?: number | undefined;
    page?: number | undefined;
    maxMatchesPerFile?: number | undefined;
}>;
export declare const ObsidianGlobalSearchInputSchemaShape: {
    query: z.ZodString;
    searchInPath: z.ZodOptional<z.ZodString>;
    contextLength: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    modified_since: z.ZodOptional<z.ZodString>;
    modified_until: z.ZodOptional<z.ZodString>;
    useRegex: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    caseSensitive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    pageSize: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    maxMatchesPerFile: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
};
export type ObsidianGlobalSearchInput = z.infer<typeof ObsidianGlobalSearchInputSchema>;
export interface MatchContext {
    context: string;
    matchText?: string;
    position?: number;
}
export interface GlobalSearchResult {
    path: string;
    filename: string;
    matches: MatchContext[];
    modifiedTime: string;
    createdTime: string;
    numericMtime: number;
}
export interface ObsidianGlobalSearchResponse {
    success: boolean;
    message: string;
    results: GlobalSearchResult[];
    totalFilesFound: number;
    totalMatchesFound: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    alsoFoundInFiles?: string[];
}
export declare const processObsidianGlobalSearch: (params: ObsidianGlobalSearchInput, context: RequestContext, obsidianService: ObsidianRestApiService, vaultCacheService: VaultCacheService | undefined) => Promise<ObsidianGlobalSearchResponse>;
export {};
