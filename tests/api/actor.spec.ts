import {test, expect} from "@fixtures/index";


test.describe("my actor test", () => {
    test("validated actor impl", async ({createActor})=>{
        const actor =  await createActor()
        expect(actor.hiker.verified_at).not.toBeNull()
        const outings = await actor.outings.list({limit:5})
        for (const outing of outings.items){
            expect(outing.status).toBe("open")
        }
    })
})