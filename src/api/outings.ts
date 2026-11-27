// src/api/outings.ts


import {APIRequestContext} from "@playwright/test";
import {CreateOutingInput, JoinRequest, JoinRequestInput, Outing, Page, ResponseMessage} from "@api/types";
import {unwrap} from "@api/http";
import {defaultJoinRequest, uniqueOuting} from "@data/outings";
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
    async joinRequest(outingId:string, input: JoinRequestInput = defaultJoinRequest()): Promise<JoinRequest>{
        const resp = await this.request.post(`/api/outings/${outingId}/requests`, {data:input} )
        return await unwrap<JoinRequest>(resp)
    }
    async acceptRequest(requestID:string){
        const resp = await  this.request.post(`/api/requests/${requestID}/accept`)
        return await unwrap<ResponseMessage>(resp)
    }
}

