import {test} from "playwright/test"
import {errors, expect, request} from "@playwright/test";
import {ApiEnvelope, Outing, Page} from "@api/types";
import {OutingsApi} from "@api/outings";


test("lets see if browse works", async ({request})=>{

    const page = await (new OutingsApi(request).list({limit:5}))
    const list = page.items
    expect(list.length).toBeLessThanOrEqual(5)
    for (const outing of list) {
        expect(outing.status).toBe('open')
    }

})