import Iota from 'iota.lib.js';
import promisify from 'micro-promisify';
import { DEFAULT_SECURITY_LEVEL, DEFAULT_NODE } from './config';
import SeedStore from './SeedStore';

export const iota = new Iota({ provider: DEFAULT_NODE });

export type PrepareTransfersOptions = {
    inputs: Input[]
};

export type Input = {
    address: string;
    balance: number;
    keyIndex: number;
    security: SecurityLevels;
};

export type Transfer = {
    address: string;
    value: number;
    message?: string;
    tag?: string;
};

export interface TransactionBase {
    hash: string;
    signatureMessageFragment: string;
    address: string;
    value: number;
    obsoleteTag: string;
    timestamp: number;
    currentIndex: number;
    lastIndex: number;
    bundle: string;
    trunkTransaction: string;
    branchTransaction: string;
    tag: string;
    attachmentTimestamp: number;
    attachmentTimestampLowerBound: number;
    attachmentTimestampUpperBound: number;
    nonce: string;
};

export interface TransactionWithPersistence extends TransactionBase {
    persistence: boolean;
};

export type SecurityLevels = 1 | 2 | 3;

export type AddressHistory = {
    addresses: string[];
    hashes: string[];
    balances: number[];
    spendStatuses: boolean[];
};

export type AddressObject = {
    address: string;
    index: number;
    balance: number;
    spent: boolean;
    checksum: string;
};

export type AddressGenerationOptions = {
    index: number;
    total: number;
    security: SecurityLevels
};

/**
 * Format address data - Assign corresponding balance, spend status and checksum
 * Note: If addresses does not start with key index 0, key indexes must be provided
 * Otherwise it can cause a key index mismatch
 *
 * @method createAddressData
 *
 * @param {array} addresses
 * @param {array} balances
 * @param {array} addressesSpendStatuses
 * @param {array} keyIndexes
 *
 * @returns {array}
 */
export const createAddressData = (addressHistory: AddressHistory, keyIndexes?: number[]): AddressObject[] => {
    const hasProvidedKeyIndexes = keyIndexes && keyIndexes.length > 0;

    return addressHistory.addresses.map((address, index) => ({
        address,
        index: hasProvidedKeyIndexes ? keyIndexes[index] : index,
        spent: addressHistory.spendStatuses[index],
        balance: addressHistory.balances[index],
        checksum: iota.utils.addChecksum(address).slice(address.length)
    }));
};

/**
 * Returns a new IOTA instance if provider is passed, otherwise returns the global instance
 *
 * @method getIotaInstance
 * @param {string} [provider]
 *
 * @returns {object} IOTA instance
 */
const getIotaInstance = (provider: string): Iota => provider ? new Iota({ provider }) : iota;

const api = {
    findTransactions: (provider: string) => {
        const instance = getIotaInstance(provider);

        return promisify(instance.api.findTransactions).bind(instance.api);
    },
    findTransactionObjects: (provider: string) => {
        const instance = getIotaInstance(provider);

        return promisify(instance.api.findTransactionObjects).bind(instance.api);
    },
    getBalances: (provider: string) => {
        const instance = getIotaInstance(provider);

        return promisify(instance.api.getBalances).bind(instance.api);
    },
    getLatestInclusion: (provider: string) => {
        const instance = getIotaInstance(provider);

        return promisify(instance.api.getLatestInclusion).bind(instance.api);
    },
    getTransactionsObjects: (provider: string) => {
        const instance = getIotaInstance(provider);

        return promisify(instance.api.getTransactionsObjects).bind(instance.api);
    },
    wereAddressesSpentFrom: (provider: string) => {
        const instance = getIotaInstance(provider);

        return promisify(instance.api.wereAddressesSpentFrom).bind(instance.api);
    },
    prepareTransfers: (provider: string) => {
        const instance = getIotaInstance(provider);

        return promisify(instance.api.prepareTransfers).bind(instance.api);
    }
};

/**
 *  Finds hashes, balances and spent statuses for an address
 *
 *  @method findAddressesData
 * 
 *  @param {string} [provider]
 *
 *  @returns {function(array, [array]): Promise<{object}>
 */
const findAddressesData = (provider: string) => (addresses: string[]) => {
    return Promise.all([
        api.findTransactions(provider)({ addresses }),
        api.getBalances(provider)(addresses, 100),
        api.wereAddressesSpentFrom(provider)(addresses),
    ]).then((data) => {
        const [hashes, balances, spendStatuses] = data;

        return {
            addresses,
            hashes,
            spendStatuses,
            balances: balances.balances.map(Number),
        };
    });
};

/**
 *  Starts traversing from specified index backwards
 *  Keeps on calling findTransactions to see if there's any associated tx with address
 *  Stops at the point where it finds an address with hash
 *  Basically just removes the unused addresses
 *
 *  @method removeUnusedAddresses
 * 
 *  @param {string} [provider]
 *
 *  @returns {function(number, string, array, object): Promise<array>}
 */
export const removeUnusedAddresses = (provider: string) => (
    index: number,
    latestUnusedAddress: string,
    finalAddresses: string[],
): Promise<string[]> => {
    if (!finalAddresses[index]) {
        return Promise.resolve([...finalAddresses, latestUnusedAddress]);
    }

    return findAddressesData(provider)([finalAddresses[index]]).then(
        ({ hashes, balances, spendStatuses }) => {
            if (
                hashes.length === 0 &&
                (balances.some, (balance: number) => balance === 0) &&
                (spendStatuses.some, (status: boolean) => status === false)
            ) {
                return removeUnusedAddresses(provider)(
                    index - 1,
                    finalAddresses[index],
                    finalAddresses.slice(0, index),
                );
            }

            return [...finalAddresses, latestUnusedAddress];
        },
    );
};

/**
 *  Returns all associated addresses with history for a seed
 *
 *  @method getFullAddressHistory
 * 
 *  @param {string} [provider]
 *
 *  @returns {function(object, object): Promise<object>}
 */
const getFullAddressHistory = (provider: string) => (seedStore: SeedStore) => {
    let generatedAddresses: string[] = [];

    const addressData: AddressHistory = { addresses: [], hashes: [], balances: [], spendStatuses: [] };

    const generateAndStoreAddressesInBatch = (currentOptions: AddressGenerationOptions): Promise<AddressHistory> => {
        return seedStore
            .generateAddresses(currentOptions)
            .then((addresses: string[]) => findAddressesData(provider)(addresses))
            .then(({ hashes, balances, spendStatuses, addresses }) => {
                const shouldGenerateNextBatch: boolean =
                    hashes.length > 0 ||
                    balances.some((balance: number) => balance > 0) ||
                    spendStatuses.some((status: boolean) => status === true);

                if (shouldGenerateNextBatch) {
                    generatedAddresses = [...generatedAddresses, ...addresses];
                    addressData.hashes = [...addressData.hashes, ...hashes];
                    addressData.balances = [...addressData.balances, ...balances];
                    addressData.spendStatuses = [...addressData.spendStatuses, ...spendStatuses];

                    const newOptions = Object.assign({}, currentOptions, {
                        index: currentOptions.total + currentOptions.index,
                    });

                    return generateAndStoreAddressesInBatch(newOptions);
                }

                const lastAddressIndex: number = generatedAddresses.length - 1;

                // Before traversing backwards to remove the unused addresses,
                // Set the first address from the newly fetched addresses as the latest address.
                const latestAddress: string = addresses[0];

                return removeUnusedAddresses(provider)(
                    lastAddressIndex,
                    latestAddress,
                    generatedAddresses.slice(),
                ).then((addresses) => {
                    const sizeOfAddressesTillOneUnused = addresses.length;

                    return {
                        ...addressData,
                        addresses,
                        // Append 0 balance to the latest unused address
                        balances: [...addressData.balances.slice(0, sizeOfAddressesTillOneUnused - 1), 0],
                        // Append false as spent status to the latest unused address
                        spendStatuses: [
                            ...addressData.spendStatuses.slice(0, sizeOfAddressesTillOneUnused - 1),
                            false,
                        ],
                    };
                });
            });
    };

    const options: AddressGenerationOptions = { index: 0, total: 10, security: DEFAULT_SECURITY_LEVEL };

    return generateAndStoreAddressesInBatch(options);
};

export const syncAccount = (provider: string) => (seedStore: SeedStore): Promise<AddressObject[]> => {
    return getFullAddressHistory(provider)(seedStore).then(createAddressData);
};

/**
 * Accumulates total balance on seed
 * 
 * @method accumulateBalance
 * 
 * @param {AddressObject[]} addressHistory 
 * 
 * @returns {number}
 */
export const accumulateBalance = (addressHistory: AddressObject[]): number => {
    return addressHistory.reduce((acc: number, addressObject: AddressObject) => {
        acc = acc + addressObject.balance;

        return acc;
    }, 0);
};

/**
 * Prepares inputs
 * 
 * @method prepareInputs
 * 
 * @param {AddressObject[]} addressData 
 * 
 * @returns {Input[]}
 */
const prepareInputs = (addressData: AddressObject[]): Input[] => {
    return addressData
        .filter((addressObject: AddressObject) => addressObject.balance > 0)
        .map((addressObject: AddressObject) => ({
            balance: addressObject.balance,
            keyIndex: addressObject.index,
            security: DEFAULT_SECURITY_LEVEL,
            address: addressObject.address
        }))
};

/**
 * Prepares transfers
 * 
 * @method prepareTransfers
 * 
 * @param {string} address 
 * @param {string} value 
 * 
 * @returns {Transfer[]}
 */
export const prepareTransfers = (address: string, value: number): Transfer[] => {
    const transfer = {
        address,
        value,
    };

    return [transfer];
}

/**
 * Gets address object with highest index
 * 
 * @method getAddressObjectWithHighestIndex
 * 
 * @param {AddressObject[]} addressData 
 * 
 * @returns {AddressObject}
 */
export const getAddressObjectWithHighestIndex = (addressData: AddressObject[]): AddressObject => {
    return addressData.reduce(
        (acc: AddressObject, addressObject: AddressObject) => acc.index > addressObject.index ? acc : addressObject
    );
};

/**
 * Prepares bundle
 * 
 * @method prepareBundle
 * 
 * @param {string} provider 
 * 
 * @returns {Promise<string>}
 */
export const prepareBundle = (provider: string) => (currentSeedStore: SeedStore, newSeedStore: SeedStore): Promise<{ trytes: string[], transactionObjects: TransactionBase[] }> => {
    const balance: number = accumulateBalance(currentSeedStore.meta)
    const inputs: Input[] = prepareInputs(currentSeedStore.meta)

    const outputAddress: string = getAddressObjectWithHighestIndex(newSeedStore.meta).address;

    const transfers = prepareTransfers(outputAddress, balance)

    return currentSeedStore.prepareTransfers(provider)(transfers, { inputs }).then((trytes: string[]) => {
        return {
            transactionObjects: trytes.map(iota.utils.transactionObject),
            trytes
        };
    })
};

/**
 * Search for more addresses.
 * 
 * @method searchAddresses
 * 
 * @param {string} provider
 * 
 * @returns {Promise<AddressObject[]>} 
 */
export const searchAddresses = (provider: string) => (seedStore: SeedStore): Promise<AddressObject[]> => {
    const latestAddressObject: AddressObject = seedStore.meta.reduce(
        (acc: AddressObject, addressObject: AddressObject) => acc.index > addressObject.index ? acc : addressObject
    );

    const options: AddressGenerationOptions = { index: latestAddressObject.index + 1, total: 20, security: DEFAULT_SECURITY_LEVEL };

    return seedStore
        .generateAddresses(options)
        .then((addresses: string[]) => findAddressesData(provider)(addresses))
        .then((addressHistory: AddressHistory) => createAddressData(
            addressHistory,
            Array.from(Array(options.total), (_, idx) => idx + options.index))
        );
};

/**
 * Creates address data for export seed
 * 
 * @method createExportSeedAddressData
 * 
 * @param {SeedStore} seedStore 
 * 
 * @returns {Promise<AddressObject[]>}
 */
export const createExportSeedAddressData = (seedStore: SeedStore): Promise<AddressObject[]> => {
    const options: AddressGenerationOptions = { index: 0, total: 1, security: DEFAULT_SECURITY_LEVEL };

    return seedStore.generateAddresses(options).then((address: string) => ([{
        address,
        index: options.index,
        spent: false,
        balance: 0,
        checksum: iota.utils.addChecksum(address).slice(address.length)
    }] as AddressObject[]));
};

export default api;
