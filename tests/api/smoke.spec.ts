import {test, expect} from "@fixtures/index"
import {OutingsApi} from "@api/outings";


test("lets see if browse works", async ({outings})=>{

    const page = await outings.list({limit:5})
    const list = page.items
    expect(list.length).toBeLessThanOrEqual(5)
    for (const outing of list) {
        expect(outing.status).toBe('open')
    }

})