import nock from 'nock'
import api, {
    iota,
    IotaApiRequest,
    createAddressData,
    findAddressesData,
    removeUnusedAddresses,
    accumulateBalance,
    prepareInputs,
    prepareBundle,
    getAddressObjectWithHighestIndex
} from '../../src/lib/iota';
import { DEFAULT_SECURITY_LEVEL } from '../../src/lib/config';
import SeedStore from '../../src/lib/SeedStore'
import { SeedState } from '../../src/lib/state'

describe('createAddressData', () => {
    test('should assign keyIndex when provided', () => {
        const addressHistory = {
            addresses: [
                'A'.repeat(81),
                'B'.repeat(81),
                'C'.repeat(81)
            ],
            hashes: [] as string[],
            balances: [120, 200, 500],
            spendStatuses: [false, true, false]
        }

        const addressData = [{
            address: 'A'.repeat(81),
            index: 33,
            balance: 120,
            spent: false,
            checksum: 'YLFHUOJUY'
        }, {
            address: 'B'.repeat(81),
            index: 34,
            balance: 200,
            spent: true,
            checksum: 'IO9LGIBVB'
        }, {
            address: 'C'.repeat(81),
            index: 35,
            balance: 500,
            spent: false,
            checksum: 'X9KV9ELOW'
        }]

        expect(createAddressData(addressHistory, [33, 34, 35])).toEqual(addressData)
    })

    test('should use array index when key indexes are not provided', () => {
        const addressHistory = {
            addresses: [
                'A'.repeat(81),
                'B'.repeat(81),
                'C'.repeat(81)
            ],
            hashes: [] as string[],
            balances: [120, 200, 500],
            spendStatuses: [false, true, false]
        }

        const addressData = [{
            address: 'A'.repeat(81),
            index: 0,
            balance: 120,
            spent: false,
            checksum: 'YLFHUOJUY'
        }, {
            address: 'B'.repeat(81),
            index: 1,
            balance: 200,
            spent: true,
            checksum: 'IO9LGIBVB'
        }, {
            address: 'C'.repeat(81),
            index: 2,
            balance: 500,
            spent: false,
            checksum: 'X9KV9ELOW'
        }]

        expect(createAddressData(addressHistory)).toEqual(addressData)
    })

    test('should throw when there is a key index size mismatch with addresses', () => {
        const addressHistory = {
            addresses: [
                'A'.repeat(81),
                'B'.repeat(81),
                'C'.repeat(81)
            ],
            hashes: [] as string[],
            balances: [120, 200, 500],
            spendStatuses: [false, true, false]
        }

        const addressData = [{
            address: 'A'.repeat(81),
            index: 0,
            balance: 120,
            spent: false,
            checksum: 'YLFHUOJUY'
        }, {
            address: 'B'.repeat(81),
            index: 1,
            balance: 200,
            spent: true,
            checksum: 'IO9LGIBVB'
        }, {
            address: 'C'.repeat(81),
            index: 2,
            balance: 500,
            spent: false,
            checksum: 'X9KV9ELOW'
        }]

        expect(() => createAddressData(addressHistory, [99])).toThrowError('Key indexes length mismatch')
    })
})

describe('findAddressesData', () => {
    test('should find address history', () => {
        const hashes = [
            '9'.repeat(81),
        ];
        const balances = [
            '10',
            '22',
            '150'
        ];
        const spendStatuses = [false, true, true];

        jest.spyOn(api, 'findTransactions').mockImplementationOnce(() => {
            return () => Promise.resolve(hashes);
        });

        jest.spyOn(api, 'getBalances').mockImplementationOnce(() => {
            return () => Promise.resolve({ balances });
        });

        jest.spyOn(api, 'wereAddressesSpentFrom').mockImplementationOnce(() => {
            return () => Promise.resolve(spendStatuses);
        });

        const addresses = ['A'.repeat(81), 'B'.repeat(81), 'C'.repeat(81)];

        const expectedAddressHistory = {
            addresses,
            hashes,
            spendStatuses,
            balances: [10, 22, 150]
        };

        return findAddressesData()(addresses).then((actualAddressHistory) => {
            expect(actualAddressHistory).toEqual(expectedAddressHistory)
        })
    })
})

describe('removeUnusedAddresses', () => {
    const addresses = [
        'A'.repeat(81),
        'B'.repeat(81),
        'C'.repeat(81),
        'D'.repeat(81),
        'E'.repeat(81),
        'F'.repeat(81),
        'G'.repeat(81),
    ];

    describe('when last address has associate meta data', () => {
        test('should return addresses with latest unused address', () => {
            const hashes = [
                '9'.repeat(81),
            ];

            jest.spyOn(api, 'findTransactions').mockImplementationOnce(() => {
                return () => Promise.resolve(hashes);
            });

            jest.spyOn(api, 'getBalances').mockImplementationOnce(() => {
                return (addresses: string[]) => Promise.resolve({ balances: addresses.map(() => '0') });
            });

            jest.spyOn(api, 'wereAddressesSpentFrom').mockImplementationOnce(() => {
                return (addresses: string[]) => Promise.resolve(addresses.map(() => false));
            });

            const latestUnusedAddress = 'H'.repeat(81);
            const lastAddressIndex = addresses.length - 1;

            return removeUnusedAddresses()(lastAddressIndex, latestUnusedAddress, addresses)
                .then((finalAddresses: string[]) => {
                    expect(finalAddresses).toEqual([...addresses, latestUnusedAddress]);
                });
        })
    })

    describe('when no address has any associated meta data', () => {
        test('should return address at zeroth index as the latest unused address', () => {
            jest.spyOn(api, 'findTransactions').mockImplementation(() => {
                return () => Promise.resolve([]);
            });

            jest.spyOn(api, 'getBalances').mockImplementation(() => {
                return (addresses: string[]) => Promise.resolve({ balances: addresses.map(() => '0') });
            });

            jest.spyOn(api, 'wereAddressesSpentFrom').mockImplementation(() => {
                return (addresses: string[]) => Promise.resolve(addresses.map(() => false));
            });

            const latestUnusedAddress = 'H'.repeat(81);
            const lastAddressIndex = addresses.length - 1;

            return removeUnusedAddresses()(lastAddressIndex, latestUnusedAddress, addresses)
                .then((finalAddresses: string[]) => {
                    expect(finalAddresses).toEqual([addresses[0]]);
                });
        })
    })

    describe('when some addresses have associated meta data', () => {
        test('should return addresses till one unused', () => {
            jest.spyOn(api, 'findTransactions').mockImplementation(() => {
                return (payload: { addresses: string[] }) => Promise.resolve(payload.addresses.includes('C'.repeat(81)) ? ['9'.repeat(81)] : []);
            });

            jest.spyOn(api, 'getBalances').mockImplementation(() => {
                return (addresses: string[]) => Promise.resolve({ balances: addresses.map(() => '0') });
            });

            jest.spyOn(api, 'wereAddressesSpentFrom').mockImplementation(() => {
                return (addresses: string[]) => Promise.resolve(addresses.map(() => false));
            });

            const latestUnusedAddress = 'H'.repeat(81);
            const lastAddressIndex = addresses.length - 1;

            return removeUnusedAddresses()(lastAddressIndex, latestUnusedAddress, addresses)
                .then((finalAddresses: string[]) => {
                    const expectedAddresses = ['A'.repeat(81), 'B'.repeat(81), 'C'.repeat(81), 'D'.repeat(81)];

                    expect(finalAddresses).toEqual(expectedAddresses);
                });
        })
    })
})

describe('accumulateBalance', () => {
    test('should accumulate total balance from address history', () => {
        const addressHistory = [{
            address: 'A'.repeat(81),
            index: 0,
            balance: 120,
            spent: false,
            checksum: 'YLFHUOJUY'
        }, {
            address: 'B'.repeat(81),
            index: 1,
            balance: 200,
            spent: true,
            checksum: 'IO9LGIBVB'
        }, {
            address: 'C'.repeat(81),
            index: 2,
            balance: 500,
            spent: false,
            checksum: 'X9KV9ELOW'
        }]

        expect(accumulateBalance(addressHistory)).toBe(820)
    })
})

describe('prepareInputs', () => {
    test('should return all addresses with positive balance', () => {
        const addressData = [{
            address: 'A'.repeat(81),
            index: 0,
            balance: 120,
            spent: false,
            checksum: 'YLFHUOJUY'
        }, {
            address: 'B'.repeat(81),
            index: 1,
            balance: 200,
            spent: true,
            checksum: 'IO9LGIBVB'
        }, {
            address: 'C'.repeat(81),
            index: 2,
            balance: 500,
            spent: false,
            checksum: 'X9KV9ELOW'
        }, {
            address: 'D'.repeat(81),
            index: 3,
            balance: 0,
            spent: false,
            checksum: 'CDCQDMVNW'
        }]

        const inputs = [{
            address: 'A'.repeat(81),
            keyIndex: 0,
            balance: 120,
            security: DEFAULT_SECURITY_LEVEL
        }, {
            address: 'B'.repeat(81),
            keyIndex: 1,
            balance: 200,
            security: DEFAULT_SECURITY_LEVEL
        }, {
            address: 'C'.repeat(81),
            keyIndex: 2,
            balance: 500,
            security: DEFAULT_SECURITY_LEVEL,
        }]

        expect(prepareInputs(addressData)).toEqual(inputs)
    })
})

describe('prepareBundle', () => {
    const inputSeedMeta = [{
        address: 'HEZAIM9QV9F9EH9TNTNAKXDDYBNFGUDWZNDIZFOOCATHAOV9FVAKXEED9DTXCCVAKIZNGVLHQGNYHYDX9',
        index: 0,
        balance: 100,
        spent: false,
        checksum: 'PLFPDQSPW'
    }, {
        address: 'WFEFK9PFRCRFJBRAZSFQDAKOLJSEC9GKTNRMKDRWRYRYFKHJOWSN9RSLWKVLPOTQRKUADRULNMPHQNNKB',
        index: 1,
        balance: 0,
        spent: true,
        checksum: 'MIVMP9BJB'
    }, {
        address: 'EHGUBXCIRWJASOFWFNPLOOQVYZJH9HORCYCLGXFKRSPD9HSOQDXKRJDI9ZFOHVF9OBKSTOGGXX9OGZSOX',
        index: 2,
        balance: 1000,
        spent: false,
        checksum: 'FCDNSDUTD'
    }, {
        address: "MVMANHDHUSMPBGGKPGWTWLADIDYRGOPXCICSSKNZSUNEYCLPSZINIBGEGAJOLLWIZHSTQPZFTITAHJROW",
        index: 3,
        balance: 1500,
        spent: false,
        checksum: 'DNTIEELHW'
    }];

    const outputSeedMeta = [{
        address: 'WVETKDNHIZPCSMEEPWOGVZSPMVUXXPAI9QVHAGOFTQNIBFHAFZCSVSSZJCB9XLDHZKVCPCV9VLVZZXFQB',
        index: 0,
        balance: 10,
        spent: false,
        checksum: 'JNBBSJWUW'
    }, {
        address: 'EZHPQXM9MDKABF9VIRVRUQ9NVBAHSDEBBFNKPG9IPZBCFFTJWWXNMZFNZVVVATUUCHKFGUCDUKANUWQRD',
        index: 1,
        balance: 0,
        spent: false,
        checksum: 'UM9WVGSOD'
    }];

    beforeEach(() => {
        nock('http://localhost:14265', {
            reqheaders: {
                'Content-Type': 'application/json',
                'X-IOTA-API-Version': '1',
            },
            filteringScope: () => true,
        })
            .filteringRequestBody(() => '*')
            .persist()
            .post('/', '*')
            .reply(200, (_, body: IotaApiRequest) => {
                if (body.command === 'getBalances') {
                    const addressMeta = [...inputSeedMeta, ...outputSeedMeta];

                    return {
                        balances: body.addresses.map((address) => {
                            return addressMeta.find((meta) => meta.address === address).balance.toString()
                        })
                    }
                }

                return {};
            });
    })

    afterEach(() => {
        nock.cleanAll()
    })

    test('should prepare a signed bundle', () => {
        const inputSeedState: SeedState = {
            seed: [
                6,
                1,
                11,
                5,
                19,
                5,
                5,
                4,
                4,
                15,
                14,
                15,
                20,
                21,
                19,
                5,
                6,
                1,
                11,
                5,
                19,
                5,
                5,
                4,
                4,
                15,
                14,
                15,
                20,
                21,
                19,
                5,
                6,
                1,
                11,
                5,
                19,
                5,
                5,
                4,
                4,
                15,
                14,
                15,
                20,
                21,
                19,
                5,
                6,
                1,
                11,
                5,
                19,
                5,
                5,
                4,
                4,
                15,
                14,
                15,
                20,
                21,
                19,
                5,
                6,
                1,
                11,
                5,
                19,
                5,
                5,
                4,
                4,
                15,
                14,
                15,
                20,
                21,
                19,
                5,
                0
            ],
            title: 'Input Seed',
            meta: inputSeedMeta
        }

        const outputSeedState: SeedState = {
            seed: [
                20,
                5,
                19,
                20,
                19,
                5,
                5,
                4,
                4,
                15,
                14,
                15,
                20,
                21,
                19,
                5,
                20,
                5,
                19,
                20,
                19,
                5,
                5,
                4,
                4,
                15,
                14,
                15,
                20,
                21,
                19,
                5,
                20,
                5,
                19,
                20,
                19,
                5,
                5,
                4,
                4,
                15,
                14,
                15,
                20,
                21,
                19,
                5,
                20,
                5,
                19,
                20,
                19,
                5,
                5,
                4,
                4,
                15,
                14,
                15,
                20,
                21,
                19,
                5,
                20,
                5,
                19,
                20,
                19,
                5,
                5,
                4,
                4,
                15,
                14,
                15,
                20,
                21,
                19,
                5,
                0
            ],
            title: 'Output Seed',
            meta: outputSeedMeta
        }

        const inputSeedStore = new SeedStore(inputSeedState)
        const outputSeedStore = new SeedStore(outputSeedState)

        return prepareBundle()(inputSeedStore, outputSeedStore).then(({ trytes, transactionObjects }) => {
            expect(iota.utils.isBundle(transactionObjects.slice().reverse())).toBe(true)
            expect(iota.utils.isBundle(trytes.slice().reverse().map(iota.utils.transactionObject))).toBe(true)
        })
    })
})

describe('getAddressObjectWithHighestIndex', () => {
    test('should return address object with highest index', () => {
        const addressData = [{
            address: 'A'.repeat(81),
            index: 0,
            balance: 120,
            spent: false,
            checksum: 'YLFHUOJUY'
        }, {
            address: 'B'.repeat(81),
            index: 1,
            balance: 200,
            spent: true,
            checksum: 'IO9LGIBVB'
        }, {
            address: 'C'.repeat(81),
            index: 2,
            balance: 500,
            spent: false,
            checksum: 'X9KV9ELOW'
        }]
        
        const expectedAddressObject = {
            address: 'C'.repeat(81),
            index: 2,
            balance: 500,
            spent: false,
            checksum: 'X9KV9ELOW'
        }

        expect(getAddressObjectWithHighestIndex(addressData)).toEqual(expectedAddressObject)
    })
})
