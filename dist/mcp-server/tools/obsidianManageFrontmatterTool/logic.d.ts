import { z } from "zod";
import { ObsidianRestApiService, VaultCacheService } from "../../../services/obsidianRestAPI/index.js";
import { RequestContext } from "../../../utils/index.js";
export declare const ObsidianManageFrontmatterInputSchemaShape: {
    filePath: z.ZodString;
    operation: z.ZodEnum<["get", "set", "delete"]>;
    key: z.ZodString;
    value: z.ZodOptional<z.ZodAny>;
};
export declare const ManageFrontmatterInputSchema: z.ZodEffects<z.ZodObject<{
    filePath: z.ZodString;
    operation: z.ZodEnum<["get", "set", "delete"]>;
    key: z.ZodString;
    value: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    operation: "get" | "delete" | "set";
    key: string;
    filePath: string;
    value?: any;
}, {
    operation: "get" | "delete" | "set";
    key: string;
    filePath: string;
    value?: any;
}>, {
    operation: "get" | "delete" | "set";
    key: string;
    filePath: string;
    value?: any;
}, {
    operation: "get" | "delete" | "set";
    key: string;
    filePath: string;
    value?: any;
}>;
export type ObsidianManageFrontmatterInput = z.infer<typeof ManageFrontmatterInputSchema>;
export interface ObsidianManageFrontmatterResponse {
    success: boolean;
    message: string;
    value?: any;
}
export declare const processObsidianManageFrontmatter: (params: ObsidianManageFrontmatterInput, context: RequestContext, obsidianService: ObsidianRestApiService, vaultCacheService: VaultCacheService | undefined) => Promise<ObsidianManageFrontmatterResponse>;
