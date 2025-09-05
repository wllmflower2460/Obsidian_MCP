import { z } from "zod";
import { ObsidianRestApiService, VaultCacheService } from "../../../services/obsidianRestAPI/index.js";
import { RequestContext } from "../../../utils/index.js";
export declare const ObsidianManageTagsInputSchemaShape: {
    filePath: z.ZodString;
    operation: z.ZodEnum<["add", "remove", "list"]>;
    tags: z.ZodArray<z.ZodString, "many">;
};
export declare const ManageTagsInputSchema: z.ZodObject<{
    filePath: z.ZodString;
    operation: z.ZodEnum<["add", "remove", "list"]>;
    tags: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    operation: "add" | "remove" | "list";
    filePath: string;
    tags: string[];
}, {
    operation: "add" | "remove" | "list";
    filePath: string;
    tags: string[];
}>;
export type ObsidianManageTagsInput = z.infer<typeof ManageTagsInputSchema>;
export interface ObsidianManageTagsResponse {
    success: boolean;
    message: string;
    currentTags: string[];
}
export declare const processObsidianManageTags: (params: ObsidianManageTagsInput, context: RequestContext, obsidianService: ObsidianRestApiService, vaultCacheService: VaultCacheService | undefined) => Promise<ObsidianManageTagsResponse>;
