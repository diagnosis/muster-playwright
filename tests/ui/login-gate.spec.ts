// src/tests/ui/login-gate.spec.ts

import {expect, test} from "@fixtures/index"
import {RESEND_VERIFICATION_STATUS, VERIFY_EMAIL, VERIFY_SUCCESS} from "@data/copy";

test.describe("login gate", ()=>{

    test("An unverified user cannot login with password", async ({createActor, loginPage}) => {
        const actor = await createActor({},{verified:false})
        const {hiker} = actor
        await loginPage.goto()
        await loginPage.login(hiker.email, actor.password)
        await expect(loginPage.alert).toHaveText(VERIFY_EMAIL)
    })

    test("an unverified user can ask for a new verification email", async ({createActor, loginPage}) => {
        const actor = await createActor({},{verified:false})
        const {hiker} = actor
        await loginPage.goto()
        await loginPage.login(hiker.email, actor.password)
        await loginPage.resendVerification.click()
        await expect(loginPage.status).toHaveText(RESEND_VERIFICATION_STATUS)
    })

    test("once verified, the user can log in", async ({createActor, loginPage, db, verifyEmailPage, header})=>{
        const actor = await createActor({},{verified:false})
        const {hiker} = actor
        await loginPage.goto()
        await loginPage.login(hiker.email, actor.password)
        await expect(loginPage.alert).toHaveText(VERIFY_EMAIL)
        const raw = await db.mintVerification(hiker.id)
        await verifyEmailPage.goto(raw)
        await expect(verifyEmailPage.message).toHaveText(VERIFY_SUCCESS)
        await verifyEmailPage.loginLink.click()
        await loginPage.login(hiker.email, actor.password)
        await header.expectLoggedIn()
    })

})