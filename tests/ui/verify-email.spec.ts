import {test, expect} from "@fixtures/index";
import {VERIFY_EXPIRED_OR_USED, VERIFY_INVALID, VERIFY_SUCCESS} from "@data/copy";

const cases = [{name:"empty", token:""}, {name:"garbage", token:"garbage_token"}]

test.describe("verify email", ()=>{
    test("A valid token", async({page, createActor, db, verifyEmailPage})=> {
        const actor = await createActor({},{verified:false})
        const {hiker} = actor
        const raw = await db.mintVerification(hiker.id)
        await verifyEmailPage.goto(raw)
        await expect(verifyEmailPage.message).toHaveText(VERIFY_SUCCESS)
        await verifyEmailPage.loginLink.click()
        await expect(page).toHaveURL('/login')
    })
    test("A token used twice", async ({createActor, db, verifyEmailPage})=>{
        const actor = await createActor({},{verified:false})
        const {hiker} = actor
        const raw = await db.mintVerification(hiker.id)
        await verifyEmailPage.goto(raw)
        await expect(verifyEmailPage.message).toHaveText(VERIFY_SUCCESS)
        await verifyEmailPage.goto(raw)
        await expect(verifyEmailPage.error).toHaveText(VERIFY_EXPIRED_OR_USED)
    })
    for (const cc of cases){
        test(`${cc.name} token`, async ({verifyEmailPage})=>{
            await verifyEmailPage.goto(cc.token)
            await expect(verifyEmailPage.error).toHaveText(VERIFY_INVALID)
        })
    }

})