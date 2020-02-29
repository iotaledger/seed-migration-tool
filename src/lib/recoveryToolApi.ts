import { RECOVERY_TOOL_BACKEND_API_URL, RECOVERY_TOOL_USER_AGENT } from './config';

type Methods = 'GET' | 'POST';

type SaveBundleRequestBody = {
    raw_trytes: string[];
    agent: string;
};

type GetStatesRequestBody = {
    bundle_hashes: string[];
};

type Options = {
    method: Methods;
    body?: SaveBundleRequestBody | GetStatesRequestBody;
};

type States = 'submitted' | 'pending' | 'confirmed' | 'kyc';

type GetStatusResponse = {
    states: States[]
};

type SaveBundleResponse = {
    bundle_hash: string;
};

class RecoveryTool {
    private url: string;

    constructor() {
        this.url = `${RECOVERY_TOOL_BACKEND_API_URL}/bundle`;
    }

    /**
     * A simple wrapper around fetch http method
     *
     * @method _fetch
     *
     * @param {string} url
     * @param {Options} options
     *
     * @returns {Promise<any>}
     */
    private _fetch(url: string, options: Options): Promise<any> {
        const requestOptions = Object.assign({}, options, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            ...('body' in options
                ? {
                    body: JSON.stringify(options.body),
                }
                : {}),
        });

        return fetch(url, requestOptions).then((response) => {
            if (!response.ok) {
                return response.text().then((error) => {
                    throw new Error(error);
                });

            }

            return response.json();
        });
    }

    /**
     * Fetches the latest states of provided bundle hashes
     *
     * @method getStates
     *
     * @param {string} bundleHash
     *
     * @returns {Promise<GetStatusResponse>}
     */
    getStates(bundleHashes: string[]): Promise<GetStatusResponse> {
        return this._fetch(
            `${this.url}/states`,
            {
                method: 'POST',
                body: {
                    bundle_hashes: bundleHashes
                }
            },
        );
    }

    /**
     * Requests recovery tool backend to save the bundle trytes
     *
     * @method saveBundle
     *
     * @param {string} bundleHash
     * @param {string} trytes
     *
     * @returns {Promise<SaveBundleResponse>}
     */
    saveBundle(bundleHash: string, trytes: string[]): Promise<SaveBundleResponse> {
        return this._fetch(
            `${this.url}/save/${bundleHash}`,
            {
                method: 'POST',
                body: {
                    raw_trytes: trytes,
                    agent: RECOVERY_TOOL_USER_AGENT
                }
            }
        )
    }
}

export default new RecoveryTool();
