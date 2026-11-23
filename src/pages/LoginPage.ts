//src/pages/LoginPage.ts
import {expect, type Locator, type Page} from '@playwright/test';

export class LoginPage {
    readonly form: Locator;
    readonly heading: Locator;
    readonly email: Locator;
    readonly password: Locator;
    readonly togglePassword: Locator;
    readonly submit: Locator;
    readonly emailCodeInstead: Locator;
    readonly forgotPassword: Locator;
    readonly sendMeACode: Locator;
    readonly sixDigitCode: Locator;
    readonly resendVerification: Locator;
    readonly alert: Locator;
    readonly status: Locator;

    constructor(private readonly page: Page) {
        this.form = page.locator('form');
        this.heading = this.form.getByRole('heading', { name: 'Log in' });
        this.email = this.form.getByLabel('Email');
        this.password = this.form.getByLabel('Password', { exact: true });
        this.togglePassword = this.form.getByRole('button', { name: /(show|hide) password/i });
        this.submit = this.form.getByRole('button', { name: 'Log in' });
        this.emailCodeInstead = page.getByRole('button', { name: 'Email me a login code instead' });
        this.forgotPassword = page.getByRole('button', { name: 'Forgot password' });
        this.sendMeACode = page.getByRole('button', { name: 'Send me a code' })
        this.sixDigitCode = page.getByRole('textbox', { name: 'Six-digit code' })
        this.resendVerification = page.getByRole('button', { name: 'Resend verification' })

        this.alert = page.getByRole('alert')
        this.status = page.getByRole("status")
    }

    async goto() {
        await this.page.goto("/login")
    }

    async login(email: string, password: string) {
        await this.email.fill(email);
        await this.password.fill(password);
        await this.submit.click();
    }
    async requestCode(email:string){
        await this.email.fill(email)
        await this.emailCodeInstead.click()
        const sent = this.page.waitForResponse(r => r.url().endsWith('/api/auth/login-code'))
        await this.sendMeACode.click()
        await sent
    }
    async submitCode(code:string){
        await this.sixDigitCode.fill(code)
        await this.submit.click()
    }

}