
// src/pages/components/Modal.ts

import {Locator, Page} from "@playwright/test";
import {cls} from "@pages/OutingDetailsPage";

/** All four dialogs on this page share one Modal component; only one is open at a time. */
export class Modal {
    readonly root: Locator;
    readonly title: Locator;
    readonly close: Locator;
    readonly error: Locator;
    readonly cancel: Locator;       // "Never mind"
    readonly confirm: Locator;      // "Yes, remove" (member) / "Yes" (comment)
    readonly accept: Locator;       // host request review
    readonly decline: Locator;      // host request review
    readonly facts: Locator;        // host request review: the <dd> values
    readonly capacityWarning: Locator; // host request review: won't-fit warning
    readonly waitingRows: Locator;  // waiting-list modal
    readonly myWaitingRow: Locator; // waiting-list modal

    constructor(page: Page) {
        this.root = page.getByRole('dialog');
        this.title = this.root.getByRole('heading', { level: 3 });
        this.close = this.root.getByRole('button', { name: 'Close' });
        this.error = this.root.locator(`p${cls('error')}`);
        this.cancel = this.root.getByRole('button', { name: 'Never mind' });
        this.confirm = this.root.getByRole('button', { name: /^Yes/ });
        this.accept = this.root.getByRole('button', { name: 'Accept' });
        this.decline = this.root.getByRole('button', { name: 'Decline' });
        this.facts = this.root.getByRole('definition');
        this.capacityWarning = this.root.locator(`p${cls('warn')}`);
        this.waitingRows = this.root.getByRole('listitem');
        this.myWaitingRow = this.root.locator('li[aria-current]');
    }
}