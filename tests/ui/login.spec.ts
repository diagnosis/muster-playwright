import {test, expect} from "@fixtures/index"
import {INVALID_CREDENTIALS} from "@data/copy";

test.describe("login specs", ()=> {

    test("a guest open login from header", async ({header, page, loginPage}) => {
        await page.goto("/")
        await header.goToLogin()
        await expect(loginPage.email).toBeVisible()
    });

    test("a hiker can log in through the form", async ({loginPage, header, createActor})=>{
        await loginPage.goto()
        const {hiker:{email}, password} = await createActor()
        await loginPage.login(email, password)
        await header.expectLoggedIn()
    })

    test("wrong password shows the error", async ({loginPage, header, createActor})=>{
        await loginPage.goto()
        const {hiker:{email}} = await createActor()
        await loginPage.login(email, "WrongPassword123")
        await expect(loginPage.alert).toHaveText(INVALID_CREDENTIALS)
        await header.expectLoggedOut()
    })

    test("a hiker logs out", async ({createActor,loginAs, header, page}) => {
        const hiker = await createActor()
        await loginAs(hiker)
        await page.goto("/")
        await header.expectLoggedIn()
        await header.signOut()
        await header.expectLoggedOut()
    })
})