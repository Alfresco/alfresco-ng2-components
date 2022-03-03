/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Page } from '@playwright/test';
import { BaseComponent } from '../../page-object/components/base.component';
import { ErrorComponent, TooltipComponent, ListboxComponent } from '../../page-object/components/basic';

export class GroupComponent extends BaseComponent {
    private static rootElement = 'adf-cloud-group';
    public error = new ErrorComponent(this.page);
    public tooltip = new TooltipComponent(this.page);
    public listbox = new ListboxComponent(this.page);

    public groupNaming = this.getChild('[data-automation-id="adf-cloud-group-chip-list"]');
    public groupInput = this.getChild('[data-automation-id="adf-group-cloud-search-input"]');

    constructor(page: Page, rootElement = GroupComponent.rootElement) {
        super(page, rootElement);
    }

    public getUserLocator = (userName: string) => this.getChild(`[data-automation-id="adf-cloud-group-chip-${userName}"]`);

}
