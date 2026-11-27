import {test, expect} from "@fixtures/index"
import {uniqueOuting} from "@data/outings";
import {tag} from "@data/identity";

test.describe("browse outings", ()=>{
    test("a visitor sees what an outing costs", async({createActor, db, browsePage})=>{
        const host = await createActor()
        const paid  = await host.outings.create(uniqueOuting({cost_per_seat_cents:900}))
        const free = await host.outings.create(uniqueOuting({cost_per_seat_cents:0}))
        await db.moveToFront(paid.id, free.id)
        await browsePage.goto()
        const paidCard = await browsePage.showCard(paid.title)
        await expect(paidCard.cost).toHaveText("$9.00/seat")
        const freeCard= await  browsePage.showCard(free.title)
        await expect(freeCard.cost).toBeHidden()
    })

    test('"load more" adds the next page of outings', async ({ createActor, browsePage }) => {
        const host = await createActor()
        const promises = Array.from({length:21}, ()=> host.outings.create())
        await Promise.all(promises)

        await browsePage.goto()
        await expect(browsePage.cards).toHaveCount(20)

        await browsePage.loadMore()
        expect(await browsePage.cards.count()).toBeGreaterThan(20)
    })

    test("a visitor can open an outing from the list", async({createActor, browsePage, db, page})=>{
        const host = await createActor()
        const outing  = await host.outings.create(uniqueOuting({ title: `Mount Ararat ${tag()}` }))
        await db.moveToFront(outing.id)

        await browsePage.goto()
        const card = await browsePage.showCard(outing.title)
        await card.open()
        await expect(page).toHaveURL(`/outings/${outing.id}`)
    })
})