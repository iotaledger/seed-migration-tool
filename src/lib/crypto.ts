import argon2 from 'argon2-browser';
import { SALT_LENGTH, IV_LENGTH, HASH_LENGTH } from './config';
import { parseUint8ArrayString } from './helpers';

/**
 * Encrypt plain text
 * @param {any} contentPlain - Content to encrypt
 * @param {buffer} hash - Argon2 hash for encryption
 * @returns {object} Iv and cipher
 */
export const encrypt = async (contentPlain: any, hash: Uint8Array): object => {
    const content = new TextEncoder().encode(JSON.stringify(contentPlain));

    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const ivString = iv.toString();

    const algorithm = { name: 'AES-GCM', iv: iv };

    const key = await crypto.subtle.importKey('raw', hash, algorithm, false, ['encrypt']);

    const cipherBuffer = await crypto.subtle.encrypt(algorithm, key, content);
    const cipherArray = new Uint8Array(cipherBuffer);
    const cipherString = cipherArray.toString();

    return { iv: ivString, cipher: cipherString };
};

/**
 * Decrypt ciphertext
 * @param {string} cipherText - Encrypted content
 * @param {string} iv - Initialization vector
 * @param {buffer} hash - Argon2 hash for decryption
 * @returns {object} Decrypted content
 */
export const decrypt = async (cipherText: string, ivString: string, hash: Uint8Array): object => {
    if (typeof hash !== 'object') {
        throw new Error('Wrong password');
    }
    try {
        const iv = parseUint8ArrayString(ivString);

        const algorithm = { name: 'AES-GCM', iv: iv };

        const key = await crypto.subtle.importKey('raw', hash, algorithm, false, ['decrypt']);

        const cipher = parseUint8ArrayString(cipherText);

        const plainBuffer = await crypto.subtle.decrypt(algorithm, key, cipher);
        const plainText = new TextDecoder().decode(plainBuffer);

        return JSON.parse(plainText);
    } catch (err) {
        throw new Error(err)
    }
};

/**
 * Generate a salt
 *
 * @returns {Uint8Array} Random salt
 */
export const getSalt = async (): Uint8Array => {
    return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

/**
 * Hash text using Argon2
 * @param {string} password - Plain text to hashes
 * @param {string} salt - Salt hash
 * @returns {object} Argon2 raw hash
 */
export const hash = async (pass: string, salt: Uint8Array): Uint8Array => {
    if (typeof pass !== 'string' || pass.length < 1) {
        return false;
    }

    const hash = await argon2.hash({ pass, salt, hashLen: HASH_LENGTH });

    return hash.hash;
};
