import { Page } from '@playwright/test';
import { BaseComponent } from '../../base.component';
export class ErrorComponent extends BaseComponent {
    private static rootElement = 'mat-error';
    public content = this.getChild('');

    constructor(page: Page) {
        super(page, ErrorComponent.rootElement);
    }
}
