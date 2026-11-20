// src/data/identity.ts


import {Experience, RegisterInput} from "@api/types";

const W = Number(process.env.TEST_WORKER_INDEX ?? 0).toString(36)
let seq = 0
export function tag(): string {
    return W + (seq++ % 1296).toString(36).padStart(2, '0') + Math.random().toString(36).slice(2, 5)
}

const ADJ = ['brisk', 'sunny', 'quiet', 'amber', 'swift', 'rustic', 'clever', 'stormy']
const NOUN = ['otter', 'falcon', 'cedar', 'harbor', 'lark', 'meadow', 'pebble', 'summit']
const EXPERIENCE:Experience[] = ['beginner', 'intermediate', 'experienced']
const COMMON_PASS = "Passw0rd!123"

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const pick = <T>(a: T[]): T => {
    const item = a[Math.floor(Math.random() * a.length)]
    if (item === undefined) throw new Error('pick: empty array')
    return item
}
const HOST = 'test.dev'

export function uniqueIdentity():RegisterInput{
    const adj = pick(ADJ)
    const noun = pick(NOUN)
    const experience = pick(EXPERIENCE)
    const t = tag()
    return {
        name: `${cap(adj)} ${cap(noun)} ${t}`,
        email: `${adj}.${noun}.${t}@${HOST}`,
        password: COMMON_PASS,
        experience: experience
    }
}