import { fork } from 'child_process';
import path from 'path';
import EntangledNode from 'entangled-node';

let timeout: ReturnType<typeof setTimeout> = null;

/**
 * Spawn a child process and return result in async
 * 
 * @param {string} payload - Payload to send to the child process
 * 
 * @returns {Promise}
 */
const exec = (payload: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const child = fork(path.resolve(__dirname, 'entangled.js'));

        const { job } = JSON.parse(payload);

        child.on('message', (message: string) => {
            resolve(message);

            clearTimeout(timeout);
            child.kill();
        });

        timeout = setTimeout(
            () => {
                reject(`Timeout: Entangled job: ${job}`);
                child.kill();
            },
            30 * 1000,
        );

        child.send(payload);
    });
};

/**
 * If module called as a child process, execute requested function and return response
 */
process.on('message', async (data) => {
    const payload = JSON.parse(data);

    if (payload.job === 'gen') {
        const address = await EntangledNode.genAddressTrytesFunc(payload.seed, payload.index, payload.security);
        process.send(address);
    }
});

const Entangled = {
    generateAddress: async (seed: string, index: number, security: number): Promise<string> => {
        return await exec(JSON.stringify({ job: 'gen', seed, index, security }));
    },
};

export default Entangled;
