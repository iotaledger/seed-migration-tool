import api, {
    AddressObject,
    AddressGenerationOptions,
    PrepareTransfersOptions,
    Transfer
} from './iota'
import { bytesToString } from './helpers'
import { SeedState } from './state'

class SeedStore {
    private seed: number[];
    meta: AddressObject[];

    /**
     * Gets seed
     * 
     * @method getSeed
     * 
     * @returns{Promise<string>}
     */
    constructor(seedState: SeedState) {
        this.seed = seedState.seed;
        this.meta = seedState.meta;
    }

    /**
     * Generate addresses
     * 
     * @method generateAddresses
     * 
     * @param {AddressGenerationOptions} options
     * 
     * @returns {Promise<string[]>} 
     */
    generateAddresses(options: AddressGenerationOptions): Promise<string[] | string> {
        return global.Electron.generateAddress(
            bytesToString(this.seed),
            options.index,
            options.security,
            options.total
        );
    }

    /**
     * Prepares transfers
     * 
     * @method prepareTransfers
     * 
     * @param {string} [provider]
     * 
     * @returns {Promise<string[]>}
     */
    prepareTransfers(provider?: string) {
        return (transfers: Transfer[], options: PrepareTransfersOptions): Promise<string[]> => {
            return api.prepareTransfers(provider)(
                bytesToString(this.seed),
                transfers,
                options
            )
        }
    }
}

export default SeedStore;
