import {test, expect} from "@fixtures/index";
import {uniqueIdentity} from "@data/identity";
import {EMAIL_EXISTS, INVALID_PASSWORD, SHORT_PASSWORD, VALIDATION_FAILED} from "@data/copy";

const weakPasswords = [
    { password: 'SH0rT@1', message: SHORT_PASSWORD },
    { password: 'WeakPassword', message: INVALID_PASSWORD },
]

test.describe("sign up", () => {
    test("a guest can sign up", async ({page, signupPage}) => {
        const user = uniqueIdentity()

        await signupPage.goto()
        await signupPage.signup(user)

        await expect(page).toHaveURL("/login")
    })

    test("a registered email is rejected", async ({signupPage, createActor}) => {
        const hiker = await createActor()
        const guest = { ...uniqueIdentity(), email: hiker.hiker.email }

        await signupPage.goto()
        await signupPage.signup(guest)

        await expect(signupPage.alert).toHaveText(EMAIL_EXISTS)
    })

    for (const { password, message } of weakPasswords) {
        test(`weak password "${password}" is rejected`, async ({signupPage}) => {
            const guest = { ...uniqueIdentity(), password }

            await signupPage.goto()
            await signupPage.signup(guest)

            await expect(signupPage.password).toHaveAccessibleDescription(message)
            await expect(signupPage.alert).toHaveText(VALIDATION_FAILED)
        })
    }

})