import { SecurityLevels } from './iota';
import { version } from '../../package.json'

/** Address security level used as default */
export const DEFAULT_SECURITY_LEVEL: SecurityLevels = 2;

/** Default node */
export const DEFAULT_NODE: string = 'https://nodes-ng.iota.org';

/** Fallback node */
export const FALLBACK_NODE: string = 'https://nodes.iota.org';

/** Recovery tool backend API url */
export const RECOVERY_TOOL_BACKEND_API_URL: string = 'https://backend-ng.iota.org';

/** Recovery tool user agent */
export const RECOVERY_TOOL_USER_AGENT: string = `recovery_tool_frontend v${version}`;

/** Transaction/Bundle hash length */
export const BUNDLE_HASH_LENGTH: number = 81;

/** Password hash length */
export const HASH_LENGTH: number = 32;

/** Password salt length */
export const SALT_LENGTH: number = 16;

/** Encryption IV length */
export const IV_LENGTH: number = 12;

/** Empty hash trytes */
export const NULL_HASH_TRYTES = '9'.repeat(BUNDLE_HASH_LENGTH);

/**
 * Maximum bundle hashes that can be queried for states
 * See: https://github.com/iotaledger/recovery_tool_backend/blob/master/http_api_swagger_spec.yml#L36
 */
export const MAX_BUNDLE_HASHES = 25;
