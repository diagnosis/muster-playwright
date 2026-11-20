import {APIRequestContext, request, test as base} from '@playwright/test'
import {OutingsApi} from "@api/outings";
import {Hiker, RegisterInput} from "@api/types";
import {AuthApi} from "@api/auth";
import {uniqueIdentity} from "@data/identity";
import {mintVerificationToken} from "@data/db";

export interface Actor{
    hiker: Hiker
    ctx: APIRequestContext
    password: string
    dispose: () => Promise<void>
    auth: AuthApi
    outings: OutingsApi
}

type Fixtures = {
    outings: OutingsApi
    createActor: (overrides?: Partial<RegisterInput>) => Promise<Actor>
}

export const test = base.extend<Fixtures>({
    outings: async ({request}, use) => {
        const outings = new OutingsApi(request)
        await use(outings)
    },
    createActor: async({}, use) => {
        const created: Actor[] = []

         await use( async (overrides = {}) => {
            const {name, email, password, experience} = uniqueIdentity()
            const input :RegisterInput = {
                name,
                email,
                password,
                experience,
                ...overrides
            }
            const ctx = await request.newContext({})
            const auth = new AuthApi(ctx)
            let hiker = await  auth.signup(input)
            const token = await mintVerificationToken(hiker.id)
            await auth.verifyEmail(token)
            hiker = await auth.login({email:input.email, password:input.password})

            const outings = new OutingsApi(ctx)
            const actor:Actor =  {hiker, ctx, password:input.password, dispose:()=> ctx.dispose(), auth, outings}
            created.push(actor)
            return actor
        } )
        await Promise.all(created.map(actor => actor.dispose()))
    }
})

export {expect} from '@playwright/test'