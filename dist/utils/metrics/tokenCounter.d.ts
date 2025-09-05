import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { RequestContext } from "../index.js";
/**
 * Calculates the number of tokens for a given text using the 'gpt-4o' tokenizer.
 * Uses ErrorHandler for consistent error management.
 *
 * @param text - The input text to tokenize.
 * @param context - Optional request context for logging and error handling.
 * @returns The number of tokens.
 * @throws {McpError} Throws an McpError if tokenization fails.
 */
export declare function countTokens(text: string, context?: RequestContext): Promise<number>;
/**
 * Calculates the number of tokens for chat messages using the ChatCompletionMessageParam structure
 * and the 'gpt-4o' tokenizer, considering special tokens and message overhead.
 * This implementation is based on OpenAI's guidelines for gpt-4/gpt-3.5-turbo models.
 * Uses ErrorHandler for consistent error management.
 *
 * See: https://github.com/openai/openai-cookbook/blob/main/examples/How_to_count_tokens_with_tiktoken.ipynb
 *
 * @param messages - An array of chat messages in the `ChatCompletionMessageParam` format.
 * @param context - Optional request context for logging and error handling.
 * @returns The estimated number of tokens.
 * @throws {McpError} Throws an McpError if tokenization fails.
 */
export declare function countChatTokens(messages: ReadonlyArray<ChatCompletionMessageParam>, // Use the complex type
context?: RequestContext): Promise<number>;
