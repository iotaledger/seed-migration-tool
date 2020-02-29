import Iota from 'iota.lib.js'
import { DEFAULT_NODE, FALLBACK_NODE } from './config'
import { writable, Writable } from 'svelte/store'

/**
 * Formats unix timestamp
 *
 * @method formatTime
 *
 * @param {number} unixTimestamp
 *
 * @returns {string}
 */
export const formatTime = (unixTimestamp: number): string => {
    const date = new Date(unixTimestamp);

    const year = date.getFullYear();
    const month: number = date.getMonth();
    const formattedMonth: string = month < 10 ? `0${month}` : month.toString();

    const day = date.getDate();
    const formattedDay: string = day < 10 ? `0${day}` : day.toString();

    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = '0' + date.getMinutes();

    return formattedDay + '-' + formattedMonth + '-' + year + ' ' + hours + ':' + minutes.substr(-2);
};

/**
 * Create random byte array
 * @param {number} size - Random number array length.
 * @param {number} max - Random byte max range
 * @returns {array} Random number array
 */
export const randomBytes = (size: number, max = 256): number[] => {
    if (size !== parseInt(size + '', 10) || size < 0) {
        return null
    }

    const rawBytes = new Uint8Array(size)

    const bytes = (global as any).crypto.getRandomValues(rawBytes)

    for (let i = 0; i < bytes.length; i++) {
        while (bytes[i] >= 256 - (256 % max)) {
            bytes[i] = randomBytes(1, max)[0]
        }
    }

    return Array.from(bytes)
}

/**
 * Convert trit string to byte array
 * @param {string} input - input trit string
 * @returns {array} - byte array
 */
export const stringToBytes = (input: string): number[] => {
    return input
        .split('')
        .map((char) => '9ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(char.toUpperCase()))
        .filter((byte) => byte > -1)
}

/**
 * Convert byte array to trit string
 * @param {array} input - input byte array
 * @returns {string} - trit string
 */
export const bytesToString = (input: number[]): string => {
    return input.map((byte) => '9ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(byte % 27)).join('')
}

/**
 * Tryte trit mapping
 */
const trytesTrits = [
    [0, 0, 0],
    [1, 0, 0],
    [-1, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
    [-1, -1, 1],
    [0, -1, 1],
    [1, -1, 1],
    [-1, 0, 1],
    [0, 0, 1],
    [1, 0, 1],
    [-1, 1, 1],
    [0, 1, 1],
    [1, 1, 1],
    [-1, -1, -1],
    [0, -1, -1],
    [1, -1, -1],
    [-1, 0, -1],
    [0, 0, -1],
    [1, 0, -1],
    [-1, 1, -1],
    [0, 1, -1],
    [1, 1, -1],
    [-1, -1, 0],
    [0, -1, 0],
    [1, -1, 0],
    [-1, 0, 0]
]

const tritStrings = trytesTrits.map((trit) => trit.toString())

/**
 * Converts tryte string to trits
 *
 * @method trytesToTrits
 * @param {String} input - Tryte string to be converted.
 *
 * @return {array} trits
 */
const trytesToTrits = (input: string): number[][] => {
    const result = Array(input.length * 3)
    for (let i = 0; i < input.length; i++) {
        const index = '9ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(input.charAt(i))
        result[i * 3] = trytesTrits[index][0]
        result[i * 3 + 1] = trytesTrits[index][1]
        result[i * 3 + 2] = trytesTrits[index][2]
    }
    return result
}

/**
 * Convert trit array to string
 * @param {array} trits - Input trit array
 * @returns {string} Output string
 */
const tritsToChars = (trits: number[][]): string => {
    if (!trits || !trits.length) {
        return null
    }
    let chars = ''
    for (let i = 0; i < trits.length; i += 3) {
        const trit = trits.slice(i, i + 3).toString()
        for (let x = 0; x < tritStrings.length; x++) {
            if (tritStrings[x] === trit) {
                chars += '9ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(x)
            }
        }
    }
    return chars
}

/**
 * Gets seed checksum.
 * @param {string | array} input - seed trytes | seed trits
 * @returns {string}
 */
export const getSeedChecksum = (seed: string | Array<number>): string => {
    const seedString = typeof seed === 'object' ? bytesToString(seed) : seed

    if (!seedString.toUpperCase().match(/^[A-Z9]+$/)) {
        return 'Invalid seed'
    }
    const iota = new Iota()
    const checksum = iota.utils.addChecksum(trytesToTrits(seedString.toUpperCase()), 9, false).slice(-9)
    return tritsToChars(checksum)
}

/**
 * Gets relevant denomination for provided IOTA value
 *
 * @method formatIotas
 * @param {number} value
 *
 * @returns {string}
 */
export const formatIotas = (value: number): string => {
    if (value < 0) {
        value = -value
    }

    let unit = 'Ti'

    switch (true) {
        case value < 1000:
            unit = 'i'
            break
        case value < 1000000:
            unit = 'Ki'
            break
        case value < 1000000000:
            unit = 'Mi'
            break
        case value < 1000000000000:
            unit = 'Gi'
            break
        default:
            unit = 'Ti'
    }

    switch (true) {
        case value < 1000:
            break
        case value < 1000000:
            value /= 1000
            break
        case value < 1000000000:
            value /= 1000000
            break
        case value < 1000000000000:
            value /= 1000000000
            break
        default:
            value /= 1000000000000
    }

    return `${value}${unit}`
}

/**
 * Persist a writable Svelte store to local storage
 */
export const persistent = <T>(key: string, initialValue: T): Writable<T> => {
    let value = initialValue

    try {
        const json = localStorage.getItem(key)
        if (json) {
            value = JSON.parse(json)
        }
    } catch (err) {
        console.error(err)
    }

    const state = writable(value)

    state.subscribe(($value): void => {
        localStorage.setItem(key, JSON.stringify($value))
    })

    return state
}

/**
 * Converts migration log date to human readable format
 *
 * @method toHumanReadableDate
 * @param {string} value
 *
 * @returns {string}
 */
export const toHumanReadableDate = (migrationDate) => {
    const dateComponents = migrationDate.split('-');

    return `${dateComponents[0]}/${dateComponents[1]}/${dateComponents[2]} ${dateComponents[3].substring(0, 2)}:${dateComponents[3].substring(2)}`
}

/**
 * Takes a Uint8Array in string form and outputs a Uint8Array
 *
 * @method parseUint8ArrayString
 * @param {string} Uint8Array string
 *
 * @returns {Uint8Array}
 */
export const parseUint8ArrayString = (input: string): Uint8Array => {
    const arr = input.split(',');
    return Uint8Array.from(arr);
}

/**
 * Wrapper method to handle attempts on fallback node
 * 
 * @method withFallback
 * 
 * @param {function} promiseFunc
 * 
 * @returns {function} 
 */
export const withFallback = (promiseFunc: (provider?: string) => (...args: any) => Promise<any>): () => Promise<any> => {
    return (...args: any[]) => {
        let node = DEFAULT_NODE;

        const execute = (provider: string) => {
            return promiseFunc(provider)(...args).catch((error) => {
                if (node !== FALLBACK_NODE) {
                    node = FALLBACK_NODE;
                    return execute(node);
                }

                throw error;
            })
        }

        return execute(node);
    }
};

/**
 * Creates a chunk of array with 
 * 
 * @method chunk
 * 
 * @param {string[]} array 
 * @param {number} len 
 * 
 * @returns {string[][]}
 */
export const chunk = (array: string[], len: number): string[][] => {
    let chunks = [];
    let i = 0;
    let n = array.length;

    while (i < n) {
        chunks.push(array.slice(i, i += len));
    }

    return chunks;
}
