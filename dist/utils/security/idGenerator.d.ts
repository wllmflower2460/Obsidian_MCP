/**
 * @fileoverview Provides a generic ID generator class for creating unique,
 * prefixed identifiers and standard UUIDs. It supports custom character sets,
 * lengths, and separators for generated IDs.
 * @module src/utils/security/idGenerator
 */
/**
 * Defines the structure for configuring entity prefixes, mapping entity types (strings)
 * to their corresponding ID prefixes (strings).
 */
export interface EntityPrefixConfig {
    [key: string]: string;
}
/**
 * Options for customizing ID generation.
 */
export interface IdGenerationOptions {
    /** The length of the random part of the ID. Defaults to `IdGenerator.DEFAULT_LENGTH`. */
    length?: number;
    /** The separator string used between a prefix and the random part. Defaults to `IdGenerator.DEFAULT_SEPARATOR`. */
    separator?: string;
    /** The character set from which the random part of the ID is generated. Defaults to `IdGenerator.DEFAULT_CHARSET`. */
    charset?: string;
}
/**
 * A generic ID Generator class for creating and managing unique identifiers.
 * It can generate IDs with entity-specific prefixes or standard UUIDs.
 */
export declare class IdGenerator {
    /** Default character set for the random part of generated IDs (uppercase alphanumeric). */
    private static DEFAULT_CHARSET;
    /** Default separator used between a prefix and the random part of an ID. */
    private static DEFAULT_SEPARATOR;
    /** Default length for the random part of generated IDs. */
    private static DEFAULT_LENGTH;
    private entityPrefixes;
    private prefixToEntityType;
    /**
     * Constructs an `IdGenerator` instance.
     * @param {EntityPrefixConfig} [entityPrefixes={}] - An optional map of entity types
     *   to their desired ID prefixes (e.g., `{ project: 'PROJ', task: 'TASK' }`).
     */
    constructor(entityPrefixes?: EntityPrefixConfig);
    /**
     * Sets or updates the entity prefix configuration and rebuilds the internal
     * reverse lookup table (prefix to entity type).
     * @param {EntityPrefixConfig} entityPrefixes - A map of entity types to their prefixes.
     */
    setEntityPrefixes(entityPrefixes: EntityPrefixConfig): void;
    /**
     * Retrieves a copy of the current entity prefix configuration.
     * @returns {EntityPrefixConfig} The current entity prefix configuration.
     */
    getEntityPrefixes(): EntityPrefixConfig;
    /**
     * Generates a cryptographically secure random string of a specified length
     * from a given character set.
     * @param {number} [length=IdGenerator.DEFAULT_LENGTH] - The desired length of the random string.
     * @param {string} [charset=IdGenerator.DEFAULT_CHARSET] - The character set to use for generation.
     * @returns {string} A random string.
     */
    generateRandomString(length?: number, charset?: string): string;
    /**
     * Generates a unique ID, optionally with a specified prefix.
     * @param {string} [prefix] - An optional prefix for the ID.
     * @param {IdGenerationOptions} [options={}] - Optional parameters for customizing
     *   the length, separator, and charset of the random part of the ID.
     * @returns {string} A unique identifier string.
     */
    generate(prefix?: string, options?: IdGenerationOptions): string;
    /**
     * Generates a unique ID for a specified entity type, using its configured prefix.
     * The format is typically `PREFIX_RANDOMPART`.
     * @param {string} entityType - The type of entity for which to generate an ID (must be registered
     *   via `setEntityPrefixes` or constructor).
     * @param {IdGenerationOptions} [options={}] - Optional parameters for customizing the ID generation.
     * @returns {string} A unique identifier string for the entity (e.g., "PROJ_A6B3J0").
     * @throws {McpError} If the `entityType` is not registered (i.e., no prefix is configured for it).
     */
    generateForEntity(entityType: string, options?: IdGenerationOptions): string;
    /**
     * Validates if a given ID string matches the expected format for a specified entity type,
     * including its prefix, separator, and random part characteristics.
     * @param {string} id - The ID string to validate.
     * @param {string} entityType - The expected entity type of the ID.
     * @param {IdGenerationOptions} [options={}] - Optional parameters to specify the expected
     *   length and separator if they differ from defaults for this validation.
     * @returns {boolean} `true` if the ID is valid for the entity type, `false` otherwise.
     */
    isValid(id: string, entityType: string, options?: IdGenerationOptions): boolean;
    /**
     * Strips the prefix from a prefixed ID string.
     * @param {string} id - The ID string (e.g., "PROJ_A6B3J0").
     * @param {string} [separator=IdGenerator.DEFAULT_SEPARATOR] - The separator used in the ID.
     * @returns {string} The part of the ID after the first separator, or the original ID if no separator is found.
     */
    stripPrefix(id: string, separator?: string): string;
    /**
     * Determines the entity type from a prefixed ID string.
     * @param {string} id - The ID string (e.g., "PROJ_A6B3J0").
     * @param {string} [separator=IdGenerator.DEFAULT_SEPARATOR] - The separator used in the ID.
     * @returns {string} The determined entity type.
     * @throws {McpError} If the ID format is invalid or the prefix does not map to a known entity type.
     */
    getEntityType(id: string, separator?: string): string;
    /**
     * Normalizes an entity ID to ensure the prefix matches the configured case
     * (if specific casing is important for the system) and the random part is uppercase.
     * This implementation assumes prefixes are stored/used consistently and focuses on random part casing.
     * @param {string} id - The ID to normalize.
     * @param {string} [separator=IdGenerator.DEFAULT_SEPARATOR] - The separator used in the ID.
     * @returns {string} The normalized ID string.
     * @throws {McpError} If the entity type cannot be determined from the ID.
     */
    normalize(id: string, separator?: string): string;
}
/**
 * A default, shared instance of the `IdGenerator`.
 * This instance can be configured with entity prefixes at application startup
 * or used directly for generating unprefixed random IDs or UUIDs.
 *
 * Example:
 * ```typescript
 * import { idGenerator, generateUUID } from './idGenerator';
 *
 * // Configure prefixes (optional, typically at app start)
 * idGenerator.setEntityPrefixes({ user: 'USR', order: 'ORD' });
 *
 * const userId = idGenerator.generateForEntity('user'); // e.g., USR_X7V2L9
 * const simpleId = idGenerator.generate(); // e.g., K3P8A1
 * const standardUuid = generateUUID(); // e.g., '123e4567-e89b-12d3-a456-426614174000'
 * ```
 */
export declare const idGenerator: IdGenerator;
/**
 * Generates a standard Version 4 UUID (Universally Unique Identifier).
 * Uses the `crypto.randomUUID()` method for cryptographically strong randomness.
 * @returns {string} A UUID string (e.g., "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx").
 */
export declare const generateUUID: () => string;
