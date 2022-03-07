/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Page } from '@playwright/test';
import { BaseComponent } from '../base.component';

export class ErrorComponent extends BaseComponent {
    private static rootElement = 'mat-error';
    public content = this.getChild('');

    constructor(page: Page) {
        super(page, ErrorComponent.rootElement);
    }
}
