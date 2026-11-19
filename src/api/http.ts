// src/api/http.ts

import {APIResponse} from "@playwright/test";
import {ApiEnvelope, ApiErrorBody, ApiErrorDetails} from "@api/types";


export class ApiError extends Error{

    constructor(readonly httpStatus:number, readonly apiErrorDetails:ApiErrorDetails | null, readonly rawText:string) {
        super(
            `httpStatus:${httpStatus}, code:${apiErrorDetails?.code}, message:${apiErrorDetails?.message??rawText},correlation_id:${apiErrorDetails?.correlation_id},timestamp:${apiErrorDetails?.timestamp}`
        );
        this.name = 'ApiError'
    }
}

export async function unwrap<T>(resp: APIResponse):Promise<T>{
    if(!resp.ok()){
        const text = await resp.text()
        let apiErr : ApiErrorDetails | null = null 
        try{
            apiErr = (JSON.parse(text) as ApiErrorBody).error ?? null 
            
        }catch {
        }
        throw new ApiError(resp.status(), apiErr, text)
    }
    const body = (await resp.json()) as ApiEnvelope<T>
    return body.data
}