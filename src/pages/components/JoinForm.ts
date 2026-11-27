
// src/pages/components/JoinForm.ts

import {Locator} from "@playwright/test";
import {HikerRole, JoinRequestInput} from "@api/types";
const ROLE_LABEL: Record<HikerRole, string> = { rider: 'Rider', driver: 'Driver' }

export class JoinForm {
    readonly root: Locator;
    readonly roles: Locator;
    readonly seatsOffered: Locator; // rendered only when Driver is selected
    readonly guests: Locator;
    readonly note: Locator;
    readonly notice: Locator;       // "moves you to the back of the waiting list"
    readonly error: Locator;
    readonly submit: Locator;       // "Request to join" or "Save changes"
    readonly cancel: Locator;

    constructor(scope: Locator) {
        this.root = scope.getByRole('form', { name: /Join outing|Edit your request/ });
        this.roles = this.root.getByRole('group', { name: 'Hiker role' });
        this.seatsOffered = this.root.getByRole('spinbutton', { name: 'Seats offered' });
        this.guests = this.root.getByRole('spinbutton', { name: 'Guests' });
        this.note = this.root.getByRole('textbox', { name: 'Note to the host' });
        this.notice = this.root.getByRole('status');
        this.error = this.root.getByRole('alert')
        this.submit = this.root.getByRole('button', { name: /Request to join|Save changes/ });
        this.cancel = this.root.getByRole('button', { name: 'Never mind' });
    }

    /** Fills without submitting, so error-path tests can assert before or after the click. */
    async fill(req: JoinRequestInput) {
        // Role first: changing it resets seats to 0.
        await this.roles.getByText(ROLE_LABEL[req.role], { exact: true }).click();
        if (req.role === 'driver' && req.seats_offered !== undefined) await this.seatsOffered.fill(String(req.seats_offered));
        if (req.guests !== undefined) await this.guests.fill(String(req.guests));
        if (req.note !== undefined) await this.note.fill(req.note);
    }
}