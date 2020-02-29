import { HASH_LENGTH, SALT_LENGTH } from '../lib/config'
import { writable } from 'svelte/store'
import { AddressObject } from './iota'
import { persistent } from './helpers'

export type SeedState = {
    seed: number[];
    title: string;
    meta: AddressObject[]
};

export type MigrationLogs = {
    [key: string]: string[];
};

export type ErrorLog = {
    error: string;
    timestamp: number;
};

export type SeedFirstAddresses = string[];

/**
 * Current view
 */
export const view = writable<string>('')

/**
 * Current imported seed
 */
export const importSeed = writable<number[]>(null)

/**
 * Current exported seed
 */
export const exportSeed = writable<number[]>(null)

/**
 * Active migration bundle hash
 */
export const activeMigrationLog = writable<object>({})

/**
 * Migration logs
 */
export const migrationLogs = persistent<MigrationLogs>('migrationLogs', {})

/**
 * First addresses (index 0) of every seed migrated from this tool.
 * Stored to detect if a new imported seed has already migrated.
 */
export const seedFirstAddresses = persistent<SeedFirstAddresses>('seedFirstAddresses', [])

/**
 * Timestamp for last API call made to fetch states
 */
export const lastFetchedStatesAt = persistent<number | null>('lastFetchedStatesAt', null)

/**
 * Error log for failed backend API calls
 */
export const errorLog = persistent<ErrorLog[]>('errorLog', [])

/**
 * Reset application state
 */
export const resetState = () => {
    importSeed.set(null)
    exportSeed.set(null)
    view.set('')

    importError.set(false)
    prepareBundleError.set(false)
    activeMigrationLog.set({})
    hasExportedSeedVault.set(false)
    passwordHash.set(new Uint8Array(HASH_LENGTH))
    passwordSalt.set(new Uint8Array(SALT_LENGTH))
}

/**
 * Import error
 */
export const importError = writable<boolean>(false)

/**
 * prepareBundleError error
 */
export const prepareBundleError = writable<boolean>(false)

/**
 * Determines whether a SeedVault has been exported
 */
export const hasExportedSeedVault = writable<boolean>(false)

/**
 * Password hash
 */
export const passwordHash = writable<Uint8Array>(new Uint8Array(HASH_LENGTH))

/**
 * Password salt
 */
export const passwordSalt = writable<Uint8Array>(new Uint8Array(SALT_LENGTH))

/**
 * Determines if privacy policy should be skipped on load
 */
export const hasReadPrivacyPolicy = persistent<boolean>(false)
