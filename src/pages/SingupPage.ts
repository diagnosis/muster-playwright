// src/pages/SignupPage.ts

import {expect, type Locator, type Page} from '@playwright/test';
import {Experience, RegisterInput} from "@api/types";

const EXPERIENCE_LEVEL: Record<Experience, string> = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    experienced: "Experienced",
}

export class SignupPage {
    readonly form: Locator;
    readonly heading: Locator;
    readonly name: Locator;
    readonly email: Locator;
    readonly password: Locator;
    readonly togglePassword: Locator;
    readonly experience: Locator;
    readonly submit: Locator;

    constructor(private readonly page: Page) {
        this.form = page.locator('form');
        this.heading = this.form.getByRole('heading', { name: 'Sign up' });
        this.name = this.form.getByLabel('Name');
        this.email = this.form.getByLabel('Email');
        this.password = this.form.getByLabel('Password', { exact: true });
        this.togglePassword = this.form.getByRole('button', { name: /(show|hide) password/i });
        this.experience = this.form.getByRole('group', { name: 'Experience' });
        this.submit = this.form.getByRole('button', { name: 'Sign up' });
    }

    experienceOptionLabel(experience:Experience): Locator {
        return this.experience.getByText(EXPERIENCE_LEVEL[experience], {exact:true});
    }
    experienceOptionRadio(experience:Experience): Locator {
        return this.experience.getByRole('radio', {name:EXPERIENCE_LEVEL[experience],exact:true});
    }
    pageError(text: string): Locator {
        return this.form.getByText(text)
    }
    async goto() {
        await this.page.goto('/signup');
    }

    async signup(user: RegisterInput) {
        await this.name.fill(user.name);
        await this.email.fill(user.email);
        await this.password.fill(user.password);
        await this.experienceOptionLabel(user.experience).click()
        await expect(this.experienceOptionRadio(user.experience)).toBeChecked()
        await this.submit.click();
    }
}