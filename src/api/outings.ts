// src/api/outings.ts


import {APIRequestContext} from "@playwright/test";
import {CreateOutingInput, Outing, Page} from "@api/types";
import {unwrap} from "@api/http";
import {uniqueOuting} from "@data/outings";
type ListOutingsParams =  {
    limit?: number
    after?:string
}

export class OutingsApi {
    constructor(private readonly request:APIRequestContext) {
    }
    async list(params:ListOutingsParams={}){
        const resp =
            await this.request.get('/api/outings', {params})
        return await unwrap<Page<Outing>>(resp)
    }
    async create(input: CreateOutingInput = uniqueOuting()) {
        const resp = await this.request.post('/api/outings', { data: input })
        return await unwrap<Outing>(resp)
    }
}

