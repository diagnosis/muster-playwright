
// src/pages/components/Comments.ts

import {Locator, Page} from "@playwright/test";
import {cls} from "@pages/OutingDetailsPage";

export class Comments {
    readonly root: Locator;
    readonly all: Locator;
    readonly emptyText: Locator;
    readonly input: Locator;
    readonly post: Locator;
    readonly replyInput: Locator; // visible after clicking Reply on a comment
    readonly postReply: Locator;
    readonly error: Locator;

    constructor(readonly page: Page, scope: Locator) {
        this.root = scope
            .locator('section')
            .filter({ has: page.getByRole('heading', { name: 'Discussion' }) });
        this.all = this.root.getByRole('article');
        this.emptyText = this.root.locator(`${cls('thread')} > p`);
        this.input = this.root.getByPlaceholder('Add to the discussion');
        this.post = this.root.getByRole('button', { name: 'Post', exact: true });
        this.replyInput = this.root.getByPlaceholder('Write a reply...');
        this.postReply = this.root.getByRole('button', { name: 'Post reply' });
        this.error = this.root.locator(`p${cls('error')}`);
    }

    comment(text: string): CommentRow {
        return new CommentRow(
            this.all.filter({ has: this.page.getByText(text, { exact: true }) }),
        );
    }
}

export class CommentRow {
    readonly author: Locator;
    readonly body: Locator;
    readonly like: Locator;   // aria-pressed reflects liked state; text is the like count
    readonly reply: Locator;  // top-level comments only, while discussion is open
    readonly delete: Locator; // comment author or host

    constructor(readonly root: Locator) {
        this.author = root.getByRole('link');
        this.body = root.locator(`p${cls('body')}`);
        this.like = root.getByRole('button', { name: 'Like' });
        this.reply = root.getByRole('button', { name: 'Reply' });
        this.delete = root.getByRole('button', { name: 'Delete' });
    }
}