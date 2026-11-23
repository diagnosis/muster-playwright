// src/pages/VerifyEmailPage.ts

import { type Locator, type Page } from '@playwright/test';

export class VerifyEmailPage{
    readonly content: Locator
    readonly message: Locator
    readonly error: Locator;
    readonly loginLink: Locator

    constructor(private readonly page: Page) {
        this.content = page.locator('#root > div[class*="_shell_"]');
        this.message = this.content.locator('p');
        this.error = this.content.locator('p[class*="_error_"]');
        this.loginLink = this.content.getByRole('link', { name: 'Log in' });
    }

    async goto(token?:string){
        await this.page.goto(token ? `/verify-email?token=${encodeURIComponent(token)}` : '/verify-email');
    }
}