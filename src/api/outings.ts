// src/api/outings.ts


import {APIRequestContext} from "@playwright/test";
import {Outing, Page} from "@api/types";
import {unwrap} from "@api/http";
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
}