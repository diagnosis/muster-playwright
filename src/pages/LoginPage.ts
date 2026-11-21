//src/pages/LoginPage.ts
import {type Locator, type Page} from '@playwright/test';

export class LoginPage {
    readonly form: Locator;
    readonly heading: Locator;
    readonly email: Locator;
    readonly password: Locator;
    readonly togglePassword: Locator;
    readonly submit: Locator;
    readonly emailCodeInstead: Locator;
    readonly forgotPassword: Locator;
    readonly invalidCredentials:Locator

    constructor(private readonly page: Page) {
        this.form = page.locator('form');
        this.heading = this.form.getByRole('heading', { name: 'Log in' });
        this.email = this.form.getByLabel('Email');
        this.password = this.form.getByLabel('Password', { exact: true });
        this.togglePassword = this.form.getByRole('button', { name: /(show|hide) password/i });
        this.submit = this.form.getByRole('button', { name: 'Log in' });
        this.emailCodeInstead = page.getByRole('button', { name: 'Email me a login code instead' });
        this.forgotPassword = page.getByRole('button', { name: 'Forgot password' });
        this.invalidCredentials = page.getByText('invalid login credentials')
    }

    async goto() {
        await this.page.goto("/login")
    }

    async login(email: string, password: string) {
        await this.email.fill(email);
        await this.password.fill(password);
        await this.submit.click();
    }

}