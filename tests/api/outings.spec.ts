
import {test, expect} from "@fixtures/index";
import {uniqueOuting} from "@data/outings";
import {OutingsApi} from "@api/outings";

test.describe("outing specs", ()=>{
    test("host creates outing", async ({createActor})=>{
        const host = await createActor()
        const input = uniqueOuting({ max_size: 6 })
        const outing = await host.outings.create(input)
        expect(outing).toMatchObject({ title: input.title, max_size: 6, status: 'open', host_id:host.hiker.id })
    })

    test("an anonymous user cannot create outing", async ({request})=>{
        const outings = new OutingsApi(request)
        await expect(outings.create(uniqueOuting()))
            .rejects.toMatchObject({ httpStatus: 401, apiErrorDetails: { code: 'unauthorized' } })
    })
})