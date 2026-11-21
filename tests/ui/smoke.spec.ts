import {test} from "@fixtures/index";


test.describe("smoke", ()=>{
    test("go to outings", async ({header, page})=>{
        await page.goto("/")
        await header.expectLoggedOut()
    })
    test("expect login", async ({header, page, loginAs, createActor}) =>{
        const hiker = await createActor()
        await loginAs(hiker)
        await page.goto("/")
        await header.expectLoggedIn()
    })
})