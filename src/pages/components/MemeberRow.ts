
// src/pages/components/MemberRow.ts

import {Locator} from "@playwright/test";

export class MemberRow {
    readonly profileLink: Locator;
    readonly message: Locator; // logged-in members and host, never on your own row
    readonly remove: Locator;  // host only

    constructor(readonly root: Locator) {
        this.profileLink = root.getByRole('link');
        this.message = root.getByRole('button', { name: /^Message / });
        this.remove = root.getByRole('button', { name: 'Remove' });
    }
}