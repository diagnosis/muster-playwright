// src/pages/ResetPasswordPage.ts

import {Locator, Page} from "@playwright/test";
import {expect} from "@fixtures/index";

export class ResetPasswordPage{
    readonly heading: Locator;
    readonly password: Locator;
    readonly confirmPassword: Locator;
    readonly submit: Locator;
    readonly alert: Locator;
    readonly status: Locator;
    readonly loginLink: Locator;

    constructor(private readonly page: Page) {
        this.heading = this.page.getByRole('heading', { name: 'Reset Password' })
        this.password = this.page.getByRole('textbox', { name: 'Password', exact: true })
        this.confirmPassword = this.page.getByRole('textbox', { name: 'Confirm password' })
        this.submit = this.page.getByRole("button", {name:"Reset Password"})

        this.alert = this.page.getByRole('alert')
        this.status = this.page.getByRole("status")

        this.loginLink = this.page.getByRole('link', { name: 'Go to login' })
    }
    async goto(token?: string) {
        await this.page.goto(token ? `/reset-password?token=${encodeURIComponent(token)}` : '/reset-password');
    }
    async fillResetFields(newPassword: string, confirm: string){
        await this.password.fill(newPassword)
        await this.confirmPassword.fill(confirm)
    }
    async submitNewPassword(){
        await this.submit.click()
    }
    async fillAndSubmitNewPassword(newPassword: string, confirm: string){
        await this.fillResetFields(newPassword, confirm)
        await expect(this.submit).toBeEnabled()
        await this.submitNewPassword()
    }
    async gotoLogin(){
        await this.loginLink.click()
    }


}