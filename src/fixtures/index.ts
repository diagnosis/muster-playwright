import {test as base} from '@playwright/test'
import {OutingsApi} from "@api/outings";

type Fixtures = {
    outings: OutingsApi
}

export const test = base.extend<Fixtures>({
    outings: async ({request}, use) => {
        const outings = new OutingsApi(request)
        await use(outings)
    }
})

export {expect} from '@playwright/test'