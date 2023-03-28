import { BaseComponent } from '../../page-object/components/base.component';
import { Page } from '@playwright/test';

export class processServices extends BaseComponent {
    private static rootElement = 'Process Services';

    constructor(page: Page, rootElement = processServices.rootElement) {
        super(page, rootElement);
    }

}