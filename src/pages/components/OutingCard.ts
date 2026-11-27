
// src/pages/components/OutingCard.ts

import {type Locator} from "@playwright/test";

export class OutingCard{
    readonly title: Locator;
    readonly date: Locator;
    readonly destination: Locator;
    readonly meetingPoint: Locator;
    readonly capacity: Locator;
    readonly terrain: Locator;
    readonly pace: Locator;
    readonly cost: Locator;
    readonly liveBadge: Locator;

    constructor(readonly root: Locator) {

        this.title = root.getByRole('heading', { level: 2 })
        this.date = root.getByTestId('outing-date')
        this.destination = root.getByTestId('outing-destination')
        this.meetingPoint = root.getByTestId('outing-meet')
        this.capacity = root.getByTestId('outing-capacity')
        this.terrain = root.getByTestId('outing-terrain')
        this.pace = root.getByTestId('outing-pace')
        this.cost = root.getByTestId('outing-cost')
        this.liveBadge = root.getByTestId('outing-live')
    }

    async open(){
        await this.root.click()
    }


}