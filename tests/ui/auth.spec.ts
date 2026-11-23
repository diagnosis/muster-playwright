import {test, expect} from "@fixtures/index"
import {AuthApi} from "@api/auth";
import {Header} from "@pages/components/Header";


test.describe("auth specs", ()=>{
    test("an expired access token is refreshed", async ({createActor,loginAs, page, header, context})=>{
        const hiker  = await createActor()
        await loginAs(hiker)
        await page.goto("/")
        await header.expectLoggedIn()

        await  context.clearCookies({name:'access_token'})

        const refreshed = page.waitForResponse(
            r => r.url().endsWith("/api/auth/refresh") && r.status() === 200
        )

        await page.reload()
        await refreshed
        await header.expectLoggedIn()
    });
    test("broken refresh token logs user out", async ({createActor, loginAs, page, header, context})=>{
        const hiker = await createActor()
        await loginAs(hiker)
        await page.goto("/")
        await header.expectLoggedIn()

        await context.clearCookies()
        await context.addCookies([{name:"refresh_token", value:"donald_trump", domain: "localhost", path:"/"}])

        await page.reload()
        await header.expectLoggedOut()
    })
    test("login with code", async ({createActor, loginPage, db, header})=>{
        const {hiker} = await createActor()
        await loginPage.goto()
        await loginPage.requestCode(hiker.email)
        const code = await db.mintLoginCode(hiker.id)
        await loginPage.submitCode(code)
        await header.expectLoggedIn()
    })
    test("login with code will by-pass verification step", async ({createActor, loginPage, db, header, page})=>{
        const actor =await createActor({}, {verified:false})
        await loginPage.goto()
        await loginPage.requestCode(actor.hiker.email)
        const code = await db.mintLoginCode(actor.hiker.id)
        await loginPage.submitCode(code)
        await header.expectLoggedIn()
        const me = await new AuthApi(page.request).me()
        expect(me.verified_at).not.toBeNull()
    })
    test("A hiker logs in, with the app opens in tow tabs. They log out in the second tab", async({createActor, loginAs, context, isMobile, header, page})=>{
        const actor = await createActor()
        await loginAs(actor)
        await page.goto("/")
        await header.expectLoggedIn()
        const newTab = await  context.newPage()
        await newTab.goto("/")
        const header2 = new Header(newTab, isMobile)
        await header2.signOut()
        await page.reload()
        await header.expectLoggedOut()
    })
})

test.describe("route guards", ()=>{
    test("A guest who opens /me/outings lands on /login", async({page})=>{
        await page.goto("/me/outings")
        await expect(page).toHaveURL("/login")
    })
    test("A logged-in user who opens /login lands on /", async ({createActor, loginAs, page})=>{
        const actor = await createActor()
        await loginAs(actor)
        await page.goto("/login")
        await expect(page).toHaveURL("/")
    })
    test("An unknown URL shows the 'Dead end' page", async({page})=>{
        await page.goto("/unknown")
        await expect(page.getByText("Dead end")).toBeVisible()
        await expect(page.getByRole('link', { name: 'Back to outings' })).toBeVisible()
    } )
})