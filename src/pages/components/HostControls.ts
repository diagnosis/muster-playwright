
// src/pages/components/HostControls.ts

import {Locator} from "@playwright/test";
import {cls} from "@pages/OutingDetailsPage";

export class HostControls {
    readonly root: Locator;
    readonly tabs: Locator;
    readonly requests: Locator;
    readonly empty: Locator;
    readonly error: Locator;
    readonly lockedNote: Locator; // outing already started with requests still waiting
    readonly editOuting: Locator;
    readonly cancelOuting: Locator;

    constructor(scope: Locator) {
        this.root = scope.locator(`div${cls('host')}`);
        this.tabs = this.root.getByRole('tablist', { name: 'Filter requests by status' });
        this.requests = this.root.locator(cls('requestItem'));
        this.empty = this.root.locator(`p${cls('empty')}`);
        this.error = this.root.locator(`p${cls('error')}`);
        this.lockedNote = this.root.locator(cls('lockedNote'));
        this.editOuting = this.root.getByRole('link', { name: 'Edit outing' });
        this.cancelOuting = this.root.getByRole('button', { name: 'Cancel outing' });
    }

    /** Tab labels carry a count, e.g. "Waiting (2)"; assert it with toContainText('2'). */
    tab(name: 'Waiting' | 'Declined' | 'Removed'): Locator {
        return this.tabs.getByRole('tab', { name: new RegExp(`^${name}`) });
    }

    /** A row in whichever tab is active. */
    request(hikerName: string): Locator {
        return this.requests.filter({ hasText: hikerName });
    }

    /** Waiting tab only: the row button that opens the review modal. */
    requestButton(hikerName: string): Locator {
        return this.root.getByRole('button', { name: `${hikerName} requests` });
    }
}