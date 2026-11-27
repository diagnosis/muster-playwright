
// src/tests/ui/outing-details.spe.ts

import {test, expect} from "@fixtures/index"
import {defaultJoinRequest, uniqueOuting} from "@data/outings";
import {tag} from "@data/identity";
import {SLOT_FULL_WARNING, SLOT_MESSAGE} from "@data/copy";
import {ApiErrorBody} from "@api/types";

test.describe("outing details", ()=>{

    test("A guest can view an outing", async({createActor, detailsPage })=>{
        const host = await createActor()
        const outing = await host.outings.create(uniqueOuting({title:`Mount Tahtali ${tag()}`}))
        await detailsPage.goto(outing.id)
        await expect(detailsPage.title).toHaveText(outing.title)
        await expect(detailsPage.hostRow).toContainText(host.hiker.name)
        await expect(detailsPage.destination).toHaveText(outing.destination)
        await expect(detailsPage.meetingPoint).toHaveText(outing.meet_label)
        await expect(detailsPage.date).not.toBeEmpty()
        await expect(detailsPage.rosterHeading).toHaveText("Who's going")

    })

    test("A guest requests to join then redirected to login", async ({createActor, detailsPage, page})=>{
        const host = await createActor()
        const outing = await host.outings.create(uniqueOuting())
        await detailsPage.goto(outing.id)
        await detailsPage.loginToJoinLink.click()
        await expect(page).toHaveURL("/login")
    })

    test("A hiker requests to join as a rider", async({createActor, detailsPage, loginAs})=>{
        const host = await createActor()
        const hiker = await createActor()
        await loginAs(hiker)

        const outing = await host.outings.create(uniqueOuting({max_size:5, host_seats:4}))
        await detailsPage.goto(outing.id)
        const joinRequest = defaultJoinRequest({guests:1})
        await detailsPage.requestJoin(joinRequest)
        await expect(detailsPage.slotMessage).toHaveText(SLOT_MESSAGE["requested"])
        await expect(detailsPage.requestSummary).toHaveText('You asked as a rider, bringing 1 guest')
        await expect(detailsPage.editRequest).toBeVisible()
        await expect(detailsPage.withdraw).toBeVisible()
    })

    test("A hiker requests to join as a driver", async({createActor, detailsPage, loginAs})=>{
        const host = await createActor()
        const hiker = await createActor()
        await loginAs(hiker)

        const outing = await host.outings.create(uniqueOuting({max_size:6, host_seats:2}))
        await detailsPage.goto(outing.id)
        const joinRequest = defaultJoinRequest({role:"driver", seats_offered:4, guests:2})
        await detailsPage.requestJoin(joinRequest)
        await expect(detailsPage.slotMessage).toHaveText(SLOT_MESSAGE["requested"])
        await expect(detailsPage.requestSummary).toHaveText('You asked as a driver with 4 seats, bringing 2 guests')
        await expect(detailsPage.editRequest).toBeVisible()
        await expect(detailsPage.withdraw).toBeVisible()
    })

    test("A hiker edits a rider request to driver", async({createActor, detailsPage, loginAs})=>{
        const host = await createActor()
        const hiker = await createActor()

        const outing = await host.outings.create(uniqueOuting({max_size:6, host_seats:3}))
        await hiker.outings.joinRequest(outing.id)

        await loginAs(hiker)
        await detailsPage.goto(outing.id)
        await expect(detailsPage.requestSummary).toHaveText('You asked as a rider, bringing no guests')

        const editedJoinRequest = defaultJoinRequest({role:"driver", seats_offered:4, guests:2})
        await detailsPage.editJoinRequest(editedJoinRequest)
        await expect(detailsPage.requestSummary).toHaveText('You asked as a driver with 4 seats, bringing 2 guests')
    })

    test("A hiker withdraws join request", async({createActor, detailsPage, loginAs})=>{
        const host = await createActor()
        const hiker = await createActor()

        const outing = await host.outings.create(uniqueOuting({max_size:4, host_seats:4}))
        await hiker.outings.joinRequest(outing.id)

        await loginAs(hiker)
        await detailsPage.goto(outing.id)
        await expect(detailsPage.requestSummary).toHaveText('You asked as a rider, bringing no guests')

        await detailsPage.withdrawRequest()
        await expect(detailsPage.requestToJoin).toBeVisible()
        await expect(detailsPage.withdrawn).toContainText(hiker.hiker.name)

    })

    test("Picking no role will disable submit btn", async ({createActor, detailsPage, loginAs})=>{
        const host = await createActor()
        const hiker = await createActor()

        const outing = await host.outings.create(uniqueOuting({max_size:4, host_seats:4}))
        await loginAs(hiker)
        await detailsPage.goto(outing.id)
        await detailsPage.requestToJoin.click()
        await expect(detailsPage.joinForm.submit).toBeDisabled()
        await detailsPage.joinForm.fill(defaultJoinRequest())
        await expect(detailsPage.joinForm.submit).toBeEnabled()
    })

    test("Clicking never mind will cancel join form and takes user to outing details page", async ({createActor, loginAs, detailsPage})=>{
        const host = await createActor()
        const hiker = await createActor()

        const outing = await host.outings.create(uniqueOuting({max_size:4, host_seats:4}))
        await loginAs(hiker)
        await detailsPage.goto(outing.id)
        await detailsPage.requestToJoin.click()
        await detailsPage.joinForm.cancel.click()
        await expect(detailsPage.joinForm.root).toBeHidden()
        await expect(detailsPage.requestToJoin).toBeVisible()
    })

    test("failing withdraws mutation will be handled", async ({createActor, detailsPage, loginAs ,page})=>{
        const host = await createActor()
        const hiker = await createActor()

        const outing = await host.outings.create(uniqueOuting({max_size:4, host_seats:4}))
        await hiker.outings.joinRequest(outing.id)

        await loginAs(hiker)
        await detailsPage.goto(outing.id)

        const errorBody: ApiErrorBody = {
            error:{
                status: 500,
                code: 'internal_error',
                message: 'withdraw exploded',
                correlation_id: 'mocked',
                timestamp: new Date().toISOString(),
            }
        }
        await page.route(`**/api/outings/${outing.id}/requests/me`, async (route) => {
            if (route.request().method() !== 'DELETE') return route.fallback()
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify(errorBody),
            })
        })

        await detailsPage.withdraw.click()

        await expect(detailsPage.slotError).toHaveText('withdraw exploded')
        await expect(detailsPage.withdraw).toBeVisible()
        await expect(detailsPage.slotMessage).toHaveText(SLOT_MESSAGE.requested)
    })

    test("failing join request will be handled", async ({createActor, detailsPage, loginAs, page})=>{
        const host = await createActor()
        const hiker = await createActor()

        const outing = await host.outings.create(uniqueOuting({max_size:4, host_seats:4}))

        await loginAs(hiker)
        await detailsPage.goto(outing.id)
        await detailsPage.requestToJoin.click()
        await detailsPage.joinForm.fill(defaultJoinRequest())

        const errBody:ApiErrorBody = {
            error:{
                status: 500,
                message: "interrupted join request",
                correlation_id: "faked",
                code: "internal_error",
                timestamp: new Date().toISOString()
            }
        }
        await page.route(`**/api/outings/${outing.id}/requests`, async (route)=>{
            if (route.request().method() !== "POST") return route.fallback()
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify(errBody),
            })
        })

        await detailsPage.joinForm.submit.click()
        await expect(detailsPage.joinForm.error).toHaveText("interrupted join request")
        await expect(detailsPage.joinForm.submit).toBeVisible()


    })

    test("Hiker requests in full outing, validate warning message", async ({createActor, detailsPage, loginAs})=>{
        const host = await createActor()
        const hiker = await createActor()
        const member = await createActor()

        const outing = await host.outings.create(uniqueOuting({max_size:2, host_seats:2}))
        const joinRequest = await member.outings.joinRequest(outing.id)
        await host.outings.acceptRequest(joinRequest.id)
        await loginAs(hiker)
        await detailsPage.goto(outing.id)
        await expect(detailsPage.fullWarning).toHaveText(SLOT_FULL_WARNING)
        await detailsPage.requestJoin(defaultJoinRequest())
        await expect(detailsPage.slotMessage).toHaveText(SLOT_MESSAGE["requested"])

    })

    test("Adding guest will cost your place in waiting list", async ({createActor, detailsPage, loginAs})=>{
        const host = await createActor()
        const hiker = await  createActor()
        const member1 = await createActor()
        const member2 = await createActor()

        const outing = await host.outings.create(uniqueOuting({max_size:6}))
        await hiker.outings.joinRequest(outing.id)
        await member1.outings.joinRequest(outing.id)
        await member2.outings.joinRequest(outing.id)

        await loginAs(hiker)
        await detailsPage.goto(outing.id)
        await expect(detailsPage.waitingPosition).toContainText('1st of 3')
        await detailsPage.editJoinRequest(defaultJoinRequest({guests:2}))
        await expect(detailsPage.waitingPosition).toContainText('3rd of 3')
    })



})

