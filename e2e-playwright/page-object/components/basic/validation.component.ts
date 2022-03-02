import { Page } from '@playwright/test';
import { BaseComponent } from '../../base.component';

export class TooltipComponent extends BaseComponent {
    private static rootElement = 'mat-tooltip-component';
    public content = this.getChild('div');

    constructor(page: Page) {
        super(page, TooltipComponent.rootElement);
    }
}
