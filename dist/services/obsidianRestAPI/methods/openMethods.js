/**
 * @module OpenMethods
 * @description
 * Methods for opening files in Obsidian via the REST API.
 */
/**
 * Opens a specific file in Obsidian. Creates the file if it doesn't exist.
 * @param _request - The internal request function from the service instance.
 * @param filePath - Vault-relative path to the file.
 * @param newLeaf - Whether to open the file in a new editor tab (leaf).
 * @param context - Request context.
 * @returns {Promise<void>} Resolves on success (200 OK, but no body expected).
 */
export async function openFile(_request, filePath, newLeaf = false, context) {
    // This endpoint returns 200 OK, not 204
    await _request({
        method: "POST",
        url: `/open/${encodeURIComponent(filePath)}`,
        params: { newLeaf },
    }, context, "openFile");
}
