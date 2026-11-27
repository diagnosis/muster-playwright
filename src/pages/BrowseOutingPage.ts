// src/pages/BrowseOutingsPage.ts

import { expect, type Locator, type Page } from '@playwright/test';
import { OutingCard } from './components/OutingCard';

export class BrowseOutingsPage {
    readonly content: Locator;
    readonly heading: Locator;
    readonly cards: Locator;
    readonly loadMoreButton: Locator;
    readonly emptyText: Locator;
    readonly createOutingLink: Locator;

    constructor(private readonly page: Page) {
        this.content = page.getByRole('main');
        this.heading = this.content.getByRole('heading', { name: 'Outings', level: 1 });
        this.cards = this.content.getByRole('article');
        this.loadMoreButton = this.content.getByRole('button', { name: /load more|loading/i });
        this.emptyText = this.content.getByText('No outings yet.')
        this.createOutingLink = this.content.getByRole('link', { name: 'Create outing' });
    }

    async goto() {
        await this.page.goto('/');
    }

    cardByTitle(title: string): OutingCard {
        return new OutingCard(this.content.getByRole('article', { name: title, exact: true }))
    }

    async loadMore() {
        const before = await this.cards.count();
        await this.loadMoreButton.click();
        await expect(this.cards).not.toHaveCount(before);
    }

    async showCard(title:string, { maxLoads = 5} = {}){
        const card = this.cardByTitle(title)
        await expect(this.heading).toBeVisible()
        let i = 0
        while(!(await card.root.isVisible())){
            if (i === maxLoads) break;
            if (!(await this.loadMoreButton.isVisible())) break
            await this.loadMore()
            i++
        }
        await expect(card.root).toBeVisible()
        return card
    }
}