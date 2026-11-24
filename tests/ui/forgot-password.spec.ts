
// src/tests/ui/forgot-password.spec.ts

import {expect, test} from "@fixtures/index"
import {
    INVALID_CREDENTIALS,
    INVALID_TOKEN,
    PASS_CHANGE_SUCCESS,
    RESET_EMAIL_TEXT, SHORT_PASSWORD,
    VALIDATION_FAILED, WEAK_PASSWORDS
} from "@data/copy";
import {LoginPage} from "@pages/LoginPage";
import {Header} from "@pages/components/Header";
import {uniqueIdentity} from "@data/identity";



test.describe("reset-page", ()=>{
    test("reset password: A user can reset their password and log in with the new one", async ({loginPage, createActor, db, resetPasswordPage, header}) => {
        const actor = await createActor()
        const {hiker} =actor
        await loginPage.goto()
        await loginPage.requestPasswordReset(hiker.email)
        await expect(loginPage.status).toHaveText(RESET_EMAIL_TEXT)
        const raw = await db.mintVerification(hiker.id, {purpose:"forgot_password"})

        await resetPasswordPage.goto(raw)
        await expect(resetPasswordPage.heading).toHaveText("Reset Password")
        const newPassword = "53aryS3cur3!"

        await resetPasswordPage.fillAndSubmitNewPassword(newPassword, newPassword)
        await expect(resetPasswordPage.status).toHaveText(PASS_CHANGE_SUCCESS)

        await resetPasswordPage.gotoLogin()
        await loginPage.login(hiker.email, newPassword)
        await header.expectLoggedIn()


    })

    test("reset password: No token in the url", async ({resetPasswordPage})=>{
        await resetPasswordPage.goto()
        await expect(resetPasswordPage.alert).toHaveText(INVALID_TOKEN)
    })

    test("reset password: garbage token", async ({resetPasswordPage})=>{
        await resetPasswordPage.goto("garbage-token")
        await expect(resetPasswordPage.alert).toHaveText(INVALID_TOKEN)
    })

    test("reset password: token already used", async ({resetPasswordPage, openResetPage})=>{
        const {raw} = await openResetPage()
        const newPassword = "53aryS3cur3!"

        await resetPasswordPage.fillAndSubmitNewPassword(newPassword, newPassword)
        await expect(resetPasswordPage.status).toHaveText(PASS_CHANGE_SUCCESS)
        await resetPasswordPage.goto(raw)
        await expect(resetPasswordPage.alert).toHaveText(INVALID_TOKEN)
    })

    test("reset password: token expired", async({openResetPage, resetPasswordPage})=>{
        await openResetPage({expired:true})
        await expect(resetPasswordPage.alert).toHaveText(INVALID_TOKEN)
    })

    test("reset password: passwords dont match", async({openResetPage,resetPasswordPage})=>{
        await openResetPage()
        const newPassword = "53aryS3cur3!"
        const confrim = "53artScur3!"

        await resetPasswordPage.fillResetFields(newPassword, confrim)
        await expect(resetPasswordPage.submit).toBeDisabled()
    })

    for (const pp of WEAK_PASSWORDS){
        test(`reset password: ${pp.name} password`, async ({openResetPage, resetPasswordPage})=>{
            await openResetPage()

            await resetPasswordPage.fillAndSubmitNewPassword(pp.password, pp.password)
            await expect(resetPasswordPage.password).toHaveAccessibleDescription(pp.message)
            await expect(resetPasswordPage.alert).toHaveText(VALIDATION_FAILED)

        })
    }

    test("reset password: old password stops working after a reset", async ({resetPasswordPage, loginPage, page, openResetPage})=>{
        const {actor:{hiker, password}} = await openResetPage()
        const newPassword = "Secure@123!"
        await resetPasswordPage.fillAndSubmitNewPassword(newPassword, newPassword)
        await resetPasswordPage.gotoLogin()
        await expect(page).toHaveURL("/login")
        await loginPage.login(hiker.email, password)
        await expect(loginPage.alert).toHaveText(INVALID_CREDENTIALS)
    })

    test("reset password: other sessions are signed out after a reset", async ({openResetPage, resetPasswordPage, context, isMobile})=>{
        const {actor:{hiker,password}} = await openResetPage()

        const page1 = await context.newPage()
        await page1.goto("/login")
        const login1 = new LoginPage(page1)
        await login1.login(hiker.email, password)
        const header1 = new Header(page1, isMobile)
        await header1.expectLoggedIn()


        const newPassword = "Secure@123!"
        await resetPasswordPage.fillAndSubmitNewPassword(newPassword, newPassword)
        await expect(resetPasswordPage.status).toHaveText(PASS_CHANGE_SUCCESS)

        await context.clearCookies({ name: 'access_token' })
        await page1.reload()
        await header1.expectLoggedOut()
    })

    test("reset password: a rejected weak password doesn't use up the link", async ({openResetPage, resetPasswordPage})=>{

        await openResetPage()
        const newPassword = "Reject"
        const strongPass = "Secure123$"
        await resetPasswordPage.fillAndSubmitNewPassword(newPassword, newPassword)
        await expect(resetPasswordPage.password).toHaveAccessibleDescription(SHORT_PASSWORD)
        await expect(resetPasswordPage.alert).toHaveText(VALIDATION_FAILED)
        await resetPasswordPage.fillAndSubmitNewPassword(strongPass, strongPass)
        await expect(resetPasswordPage.status).toHaveText(PASS_CHANGE_SUCCESS)

    })

    test( "reset password: requesting a reset for an unknown email shows the same confirmation", async ({loginPage})=>{
        await loginPage.goto()
        await loginPage.requestPasswordReset(uniqueIdentity().email)
        await expect(loginPage.status).toHaveText(RESET_EMAIL_TEXT)
    })

})

