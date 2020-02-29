import argon2 from 'argon2-browser'
import kdbxweb from 'kdbxweb'

import { stringToBytes } from './helpers'

kdbxweb.CryptoEngine.argon2 = async (password, salt, memory, iterations, length, parallelism, type, version) => {
    const hash = await argon2.hash({
        pass: new Uint8Array(password),
        salt: new Uint8Array(salt),
        mem: memory,
        time: iterations,
        hashLen: length,
        parallelism
    })

    return hash.hash
}

export const createVault = async (password: string, seed: string) => {
    const credentials = new kdbxweb.Credentials(kdbxweb.ProtectedValue.fromString(password), null)
    const db = kdbxweb.Kdbx.create(credentials, 'Trinity')

    db.upgrade()

    const entry = db.createEntry(db.getDefaultGroup())
    entry.fields.Title = 'Trinity'
    entry.fields.Seed = kdbxweb.ProtectedValue.fromString(seed)

    const chunk = await db.save()

    return chunk
}

export const importVault = async (buffer: ArrayBuffer, password: string) => {
    const credentials = new kdbxweb.Credentials(kdbxweb.ProtectedValue.fromString(password), null)

    const db = await kdbxweb.Kdbx.load(buffer, credentials)
    const entries = db.getDefaultGroup().entries
    const seeds = []

    for (let i = 0; i < entries.length; i++) {
        if (entries[i].fields.Seed) {
            seeds.push({
                title: entries[i].fields.Title || `Seed #${i + 1}`,
                seed: stringToBytes(entries[i].fields.Seed.getText() as string)
            })
        }
    }

    return seeds.filter((item) => item.seed.length === 81)
}
