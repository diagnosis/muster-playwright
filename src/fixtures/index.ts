import {APIRequestContext, request,  test as base} from '@playwright/test'
import {OutingsApi} from "@api/outings";
import {Hiker, RegisterInput} from "@api/types";
import {AuthApi} from "@api/auth";
import {uniqueIdentity} from "@data/identity";
import {DBClient} from "@data/db";
import {Header} from "@pages/components/Header";
import {LoginPage} from "@pages/LoginPage";
import {SignupPage} from "@pages/SingupPage";
import {VerifyEmailPage} from "@pages/VerifyEmailPage";
import {ResetPasswordPage} from "@pages/ResetPasswordPage";
import {BrowseOutingsPage} from "@pages/BrowseOutingPage";
import {OutingDetailsPage} from "@pages/OutingDetailsPage";

export interface Actor{
    hiker: Hiker
    ctx: APIRequestContext
    password: string
    dispose: () => Promise<void>
    auth: AuthApi
    outings: OutingsApi
}

type Fixtures = {
    createActor: (overrides?: Partial<RegisterInput>, options?:{verified?:boolean}) => Promise<Actor>
    header: Header
    loginAs: (actor:Actor) => Promise<void>
    openResetPage: (options?: { expired?: boolean }) => Promise<{ actor: Actor; raw: string }>
    loginPage: LoginPage
    signupPage: SignupPage
    verifyEmailPage: VerifyEmailPage
    resetPasswordPage: ResetPasswordPage
    browsePage: BrowseOutingsPage
    detailsPage: OutingDetailsPage
}

type WorkerFixtures = {
    db: DBClient
}

export const test = base.extend<Fixtures, WorkerFixtures>({
    db: [async ({}, use)=>{
        const db = new DBClient()
        await use(db)
        await db.close()
    }, {scope:'worker'}],
    createActor: async({db}, use) => {
        const created: Actor[] = []

         await use( async (overrides = {}, {verified = true} = {}) => {
            const input :RegisterInput = {
                ...uniqueIdentity(),
                ...overrides
            }
            const ctx = await request.newContext({})
             const auth = new AuthApi(ctx)
             const outings = new OutingsApi(ctx)
             let hiker = await auth.signup(input)
             if (verified) {
                 const token = await db.mintVerification(hiker.id)
                 await auth.verifyEmail(token)
                 hiker = await auth.login({ email: input.email, password: input.password })
             }
             const actor: Actor = { hiker, ctx, password: input.password, dispose: () => ctx.dispose(), auth, outings }
             created.push(actor)
             return actor
        } )
        await Promise.all(created.map(actor => actor.dispose()))
    },
    openResetPage: async({createActor, resetPasswordPage, db}, use) => {
        await use(async (options = {}) => {
            const actor = await createActor()
            const raw = await db.mintVerification(actor.hiker.id, {purpose: "forgot_password",  ttlHours: options.expired ? -1 : undefined,})
            await resetPasswordPage.goto(raw)
            return {actor, raw}
        })
    },

    header: async ({page, isMobile}, use)=>{
        const header = new Header(page, isMobile)
        await use (header)
    },
    loginAs: async({ context }, use) => {
        await use(async (actor:Actor)=>{
            const state = await actor.ctx.storageState()
            await context.addCookies(state.cookies)
        })
    },
    loginPage: async ({page}, use) =>{
        const login = new LoginPage(page)
        await use(login)
    },
    signupPage: async ({page}, use) =>{
        const signup = new SignupPage(page)
        await use(signup)
    },
    verifyEmailPage: async ({page}, use) =>{
        const verifyEmail = new VerifyEmailPage(page)
        await use(verifyEmail)
    },
    resetPasswordPage: async({page}, use)=>{
        const resetPassword = new ResetPasswordPage(page)
        await use(resetPassword)
    },
    browsePage: async({page}, use)=>{
        const browse = new BrowseOutingsPage(page)
        await use(browse)
    },
    detailsPage: async ({page}, use)=>{
        const details = new OutingDetailsPage(page)
        await use(details)
    }



})

export {expect} from '@playwright/test'