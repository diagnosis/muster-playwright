// src/pages/VerifyEmailPage.ts

import { type Locator, type Page } from '@playwright/test';

export class VerifyEmailPage{
    readonly content: Locator
    readonly message: Locator
    readonly error: Locator;
    readonly loginLink: Locator

    constructor(private readonly page: Page) {
        this.content = page.getByRole("main")
        this.message = this.content.getByRole("status");
        this.error = this.content.getByRole("alert")
        this.loginLink = this.content.getByRole('link', { name: 'Log in' });
    }

    async goto(token?:string){
        await this.page.goto(token ? `/verify-email?token=${encodeURIComponent(token)}` : '/verify-email');
    }
}