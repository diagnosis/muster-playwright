// src/data/db.ts

import {Pool} from "pg";
import {createHash, randomBytes} from "node:crypto";


type MintOverrides = {purpose?: string, ttlHours?: number, ttlMins?: number}
export class DBClient{
    private readonly pool: Pool
    constructor() {
        const dsn = process.env.DATABASE_URL
        if  (!dsn) throw new Error("DATABASE_URL not set - api test needs it")
        this.pool = new Pool({connectionString:dsn})

    }
    private hashToken = (raw:string) => createHash('sha256').update(raw).digest('hex')
    async mintVerification(hikerId:string, overrides: MintOverrides={}){
        const raw = randomBytes(32).toString('hex')
        await this.pool.query(
            `INSERT INTO auth_tokens (id, hiker_id, token_hash, purpose, created_at, expires_at)
        VALUES(gen_random_uuid(), $1,$2, $3, now(), now()+make_interval(hours=>$4))`,
            [hikerId, this.hashToken(raw), overrides.purpose ?? 'email_verification', overrides.ttlHours ?? 24],
        )
        return raw
    }
    async close(){
        await this.pool.end()
    }
    async mintLoginCode(hikerId:string, overrides: MintOverrides={}) {
       const raw = String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0')
       await this.pool.query(
           `INSERT INTO auth_tokens (id, hiker_id, token_hash, purpose, created_at, expires_at)
         VALUES (gen_random_uuid(), $1, $2, $3, now(), now() + make_interval(mins => $4))`,
           [hikerId, this.hashToken(hikerId+raw), overrides.purpose ?? 'login_code', overrides.ttlMins ?? 10],
       )
        return raw
    }

}



