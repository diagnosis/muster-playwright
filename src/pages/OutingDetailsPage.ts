
// src/pages/OutingDetailsPage.ts

import {expect, Locator, Page} from "@playwright/test";
import {MemberRow} from "@pages/components/MemeberRow";
import {JoinForm} from "@pages/components/JoinForm";
import {Comments} from "@pages/components/Comments";
import {Modal} from "@pages/components/Modal";
import {HostControls} from "@pages/components/HostControls";
import {JoinRequestInput} from "@api/types";

/** Matches a CSS-module class by its local name, e.g. cls('slot') -> [class*="_slot_"] */
export const cls = (name: string) => `[class*="_${name}_"]`;

export class OutingDetailsPage{
    readonly main: Locator

    // outing info (all views)
    readonly title: Locator
    readonly date: Locator
    readonly destination: Locator
    readonly meetingPoint: Locator
    readonly terrain: Locator
    readonly pace: Locator
    readonly cost: Locator
    readonly capacitySection: Locator
    readonly capacity: Locator
    readonly capacityNote: Locator
    readonly notesSection: Locator
    readonly notes: Locator

    // status box
    readonly slotSection: Locator
    readonly slotMessage: Locator;
    readonly slotError: Locator;
    readonly requestSummary: Locator;
    readonly loginToJoinLink: Locator;
    readonly requestToJoin: Locator;
    readonly fullWarning: Locator;
    readonly editRequest: Locator;
    readonly withdraw: Locator;
    readonly chatLink: Locator;

    // who's going
    readonly rosterSection: Locator;
    readonly rosterHeading: Locator
    readonly members: Locator;
    readonly hostRow: Locator;
    readonly loginToSeeMore: Locator;
    readonly seeAllWaiting: Locator;
    readonly waitingPosition: Locator;
    readonly waitingHeading : Locator
    readonly waitingNames: Locator
    readonly withdrawn: Locator;
    readonly error: Locator;

    readonly joinForm: JoinForm;
    readonly host: HostControls;
    readonly comments: Comments;
    readonly modal: Modal;

    constructor(private readonly page: Page) {
        this.main = page.getByRole('main');

        // outing info section
        this.title = this.main.getByRole('heading', { level: 1 });
        this.date = this.main.getByTestId('outing-date');
        this.destination = this.main.getByTestId("outing-destination")
        this.meetingPoint = this.main.getByTestId("outing-meet")
        this.terrain = this.main.getByTestId("outing-terrain")
        this.pace = this.main.getByTestId("outing-pace")
        this.cost = this.main.getByTestId("outing-cost")

        // notes section
        this.notesSection = this.main.getByRole("region", {name:"Notes"})
        this.notes = this.notesSection.getByTestId("outing-notes")

        // capacity section
        this.capacitySection = this.main.getByRole('region', {name: 'Capacity'})
        this.capacity = this.main.getByTestId('outing-capacity')
        this.capacityNote = this.capacitySection.getByRole('status')

        // slot section
        this.slotSection = this.main.getByRole('region', {name: 'Slot'})
        this.slotMessage = this.slotSection.getByTestId("slot-message")
        this.slotError = this.slotSection.getByRole('alert')
        this.requestSummary = this.slotSection.getByTestId("slot-request-summary");
        this.fullWarning = this.slotSection.getByTestId('slot-full-warning')
        this.loginToJoinLink = this.slotSection.getByRole('link', { name: 'Request to join' })
        this.requestToJoin = this.slotSection.getByRole('button', { name: 'Request to join' })
        this.editRequest = this.slotSection.getByRole('button', { name: 'Edit request' })
        this.withdraw = this.slotSection.getByRole('button', { name: 'Withdraw' })
        this.chatLink = this.slotSection.getByRole('link', { name: 'Outing chat' })

        // roster section
        this.rosterSection = this.main.getByRole('region', { name: "Who's going" })
        this.rosterHeading = this.rosterSection.getByRole("heading", {level:2})
        this.hostRow = this.rosterSection.getByTestId('roster-host')
        this.members = this.rosterSection.getByTestId('roster-member')
        this.loginToSeeMore = this.rosterSection.getByTestId('roster-more')
        this.waitingHeading = this.rosterSection.getByRole('heading', { name: /^Waiting/ })
        this.waitingNames = this.rosterSection.getByTestId('waiting-names')
        this.seeAllWaiting = this.rosterSection.getByRole('button', { name: 'See all' })
        this.waitingPosition = this.rosterSection.getByRole('status')
        this.withdrawn = this.rosterSection.getByTestId('roster-withdrawn')
        this.error = this.rosterSection.getByRole('alert')

        this.joinForm = new JoinForm(this.slotSection);
        this.host = new HostControls(this.slotSection);
        this.comments = new Comments(page, this.main);
        this.modal = new Modal(page);
    }


    async goto(outingId: string) {
        await this.page.goto(`/outings/${outingId}`);
        await expect(this.title).toBeVisible();
    }

    member(name: string): MemberRow {
        return new MemberRow(
            this.members.filter({ has: this.page.getByRole('link', { name, exact: true }) }),
        );
    }

    // ---- visitor / member actions ----

    async requestJoin(req: JoinRequestInput) {
        await this.requestToJoin.click();
        await this.joinForm.fill(req);
        await this.joinForm.submit.click();
        await expect(this.joinForm.root).toBeHidden();
    }

    async editJoinRequest(req: JoinRequestInput) {
        await this.editRequest.click();
        await this.joinForm.fill(req);
        await this.joinForm.submit.click();
        await expect(this.joinForm.root).toBeHidden();
    }

    async withdrawRequest() {
        await this.withdraw.click();
        await expect(this.requestToJoin).toBeVisible();
    }

    async openChat() {
        await this.chatLink.click();
        await this.page.waitForURL(/\/conversations\//);
    }

    async messageMember(name: string) {
        await this.member(name).message.click();
        await this.page.waitForURL(/\/conversations\//);
    }

    async openWaitingList() {
        await this.seeAllWaiting.click();
        await expect(this.modal.root).toBeVisible();
    }

    // ---- host actions ----

    async openRequest(hikerName: string) {
        await this.host.tab('Waiting').click();
        await this.host.requestButton(hikerName).click();
        await expect(this.modal.title).toHaveText(hikerName);
    }

    async acceptRequest(hikerName: string) {
        await this.openRequest(hikerName);
        await this.modal.accept.click();
        await expect(this.modal.root).toBeHidden();
    }

    async declineRequest(hikerName: string) {
        await this.openRequest(hikerName);
        await this.modal.decline.click();
        await expect(this.modal.root).toBeHidden();
    }

    async restoreRequest(hikerName: string, from: 'Declined' | 'Removed') {
        await this.host.tab(from).click();
        const row = this.host.request(hikerName);
        await row.getByRole('button', { name: 'Restore' }).click();
        await expect(row).toHaveCount(0);
    }

    async removeMember(name: string) {
        await this.member(name).remove.click();
        await this.modal.confirm.click();
        await expect(this.modal.root).toBeHidden();
    }

    /** "Cancel outing" uses a native confirm(); this accepts it. */
    async cancelOuting() {
        this.page.once('dialog', (dialog) => dialog.accept());
        await this.host.cancelOuting.click();
        await expect(this.host.cancelOuting).toBeHidden();
    }

    async editOuting() {
        await this.host.editOuting.click();
        await this.page.waitForURL(/\/outings\/[0-9a-f-]+\/edit$/);
    }

    // ---- discussion actions ----

    async postComment(text: string) {
        await this.comments.input.fill(text);
        await this.comments.post.click();
        await expect(this.comments.comment(text).root).toBeVisible();
    }

    async replyTo(commentText: string, reply: string) {
        await this.comments.comment(commentText).reply.click();
        await this.comments.replyInput.fill(reply);
        await this.comments.postReply.click();
        await expect(this.comments.comment(reply).root).toBeVisible();
    }

    /** Toggles the like; asserts the pressed state flipped. */
    async toggleLike(commentText: string) {
        const like = this.comments.comment(commentText).like;
        const before = await like.getAttribute('aria-pressed');
        await like.click();
        await expect(like).toHaveAttribute('aria-pressed', before === 'true' ? 'false' : 'true');
    }

    async deleteComment(commentText: string) {
        await this.comments.comment(commentText).delete.click();
        await this.modal.confirm.click();
        await expect(this.modal.root).toBeHidden();
    }
}
