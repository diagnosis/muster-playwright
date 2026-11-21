// src/pages/components/Header.ts

import { expect, type Locator, type Page } from '@playwright/test';

export class Header {
    readonly root: Locator;

    // always
    readonly logo: Locator;
    readonly menuToggle: Locator; // mobile only

    // logged in
    readonly myOutings: Locator;
    readonly inbox: Locator;
    readonly createOuting: Locator;
    readonly notifications: Locator;
    readonly unreadBadge: Locator;
    readonly profile: Locator;
    readonly logout: Locator;

    // logged out
    readonly login: Locator;
    readonly signup: Locator;

    constructor(page: Page, private readonly isMobile: boolean) {
        this.root = page.getByRole('banner');

        this.logo = this.root.getByRole('link', { name: 'Muster', exact: true });
        this.menuToggle = this.root.getByRole('button', { name: 'Menu' });

        this.myOutings = this.root.getByRole('link', { name: 'My outings' });
        this.inbox = this.root.getByRole('link', { name: 'Inbox', exact: true });
        this.createOuting = this.root.getByRole('link', { name: 'Create outing' });
        this.notifications = this.root.getByRole('button', { name: 'Notifications' });
        this.unreadBadge = this.notifications.locator('span');
        this.profile = this.root.locator('a[href="/me/profile"]');
        this.logout = this.root.getByRole('button', { name: 'Log out' });

        this.login = this.root.getByRole('link', { name: 'Log in' });
        this.signup = this.root.getByRole('link', { name: 'Sign up' });
    }

    async expectLoggedIn() {
        await this.openMenu()
        await expect(this.logout).toBeVisible();
        await expect(this.login).toHaveCount(0);
        await expect(this.signup).toHaveCount(0);
    }

    async expectLoggedOut() {
        await this.openMenu()
        await expect(this.login).toBeVisible();
        await expect(this.signup).toBeVisible();
        await expect(this.logout).toHaveCount(0);
        await expect(this.profile).toHaveCount(0);
    }
    private async openMenu() {
        if (!this.isMobile) return

        if (await this.menuToggle.getAttribute('aria-expanded') === 'false') {
            await this.menuToggle.click()
        }
        await expect(this.menuToggle).toHaveAttribute('aria-expanded', 'true')
    }
}