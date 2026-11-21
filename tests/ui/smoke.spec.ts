import {test, expect} from "@playwright/test";
import {Header} from "@pages/components/Header";


test.describe("smoke", ()=>{
    test("go to outings", async ({page, isMobile})=>{
        const header = new Header(page, isMobile)
        await page.goto("/")
        await header.expectLoggedOut()
        await expect(header.root).toBeVisible()
    })
})