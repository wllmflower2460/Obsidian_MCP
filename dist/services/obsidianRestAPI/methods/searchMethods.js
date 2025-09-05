/**
 * @module SearchMethods
 * @description
 * Methods for performing searches via the Obsidian REST API.
 */
/**
 * Performs a simple text search across the vault.
 * @param _request - The internal request function from the service instance.
 * @param query - The text query string.
 * @param contextLength - Number of characters surrounding each match (default 100).
 * @param context - Request context.
 * @returns An array of search results.
 */
export async function searchSimple(_request, query, contextLength = 100, context) {
    return _request({
        method: "POST",
        url: "/search/simple/",
        params: { query, contextLength }, // Send as query parameters
    }, context, "searchSimple");
}
/**
 * Performs a complex search using Dataview DQL or JsonLogic.
 * @param _request - The internal request function from the service instance.
 * @param query - The query string (DQL) or JSON object (JsonLogic).
 * @param contentType - The content type header indicating the query format.
 * @param context - Request context.
 * @returns An array of search results.
 */
export async function searchComplex(_request, query, contentType, context) {
    return _request({
        method: "POST",
        url: "/search/",
        headers: { "Content-Type": contentType },
        data: query,
    }, context, "searchComplex");
}
