/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Page } from '@playwright/test';
import { BaseComponent } from '../base.component';
import { ErrorComponent, TooltipComponent, ListboxComponent } from './basic';

export class PeopleComponent extends BaseComponent {
    private static rootElement = 'adf-cloud-people';
    public error = new ErrorComponent(this.page);
    public tooltip = new TooltipComponent(this.page);
    public listbox = new ListboxComponent(this.page);

    public usersNaming = this.getChild('[data-automation-id="adf-cloud-people-chip-list"]');
    public usersInput = this.getChild('[data-automation-id="adf-people-cloud-search-input"]');

    constructor(page: Page, rootElement = PeopleComponent.rootElement) {
        super(page, rootElement);
    }

    public getUserLocator = (userName: 'userName1' | 'userName2') => this.getChild(`[data-automation-id="adf-people-cloud-chip-${userName}"]`);

}
