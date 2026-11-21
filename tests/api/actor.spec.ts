import {test, expect} from "@fixtures/index";


test.describe("my actor test", () => {
    test("validated actor impl", async ({createActor})=>{
        const actor =  await createActor()
        expect(actor.hiker.verified_at).not.toBeNull()
        const outings = await actor.outings.list({limit:5})
        for (const outing of outings.items){
            expect(outing.status).toBe("open")
        }
        const me = await actor.auth.me()
        expect(me.id).toBe(actor.hiker.id)
    })
    test("I should create 2 actors", async ({createActor})=> {
        const [host, hiker] = await Promise.all([createActor(), createActor()])
        const meHost = await host.auth.me()
        const meHiker = await hiker.auth.me()

        expect(meHiker.id).not.toEqual(meHost.id)
    })
})