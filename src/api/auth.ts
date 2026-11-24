import {APIRequestContext} from "@playwright/test";
import {unwrap} from "@api/http";
import {Hiker, LoginInput, RegisterInput, ResponseMessage} from "@api/types";


export class AuthApi{
    constructor(private readonly request:APIRequestContext) {
    }
    async signup(data:RegisterInput){
        const resp = await this.request.post('/api/auth/signup', {data})
        return unwrap<Hiker>(resp)
    }
    async verifyEmail(token:string){
        const resp = await this.request.post('/api/auth/verify-email', {data:{token}})
        return unwrap<ResponseMessage>(resp)
    }
    async login(data:LoginInput){
        const resp = await this.request.post('/api/auth/login', {data})
        return unwrap<Hiker>(resp)
    }
    async me(){
        const resp = await this.request.get('/api/auth/me')
        return unwrap<Hiker>(resp)
    }
}
