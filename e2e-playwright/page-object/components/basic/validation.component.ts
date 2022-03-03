/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Page } from '@playwright/test';
import { BaseComponent } from '../base.component';

export class TooltipComponent extends BaseComponent {
    private static rootElement = 'mat-tooltip-component';
    public content = this.getChild('div');

    constructor(page: Page) {
        super(page, TooltipComponent.rootElement);
    }
}
