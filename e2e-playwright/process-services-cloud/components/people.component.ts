/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Page } from '@playwright/test';
import { BaseComponent } from '../../page-object/components/base.component';
import { ErrorComponent, TooltipComponent, ListboxComponent } from '../../page-object/components/basic';

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

    public getUserLocator = (userName: string) => this.getChild(`[data-automation-id="adf-people-cloud-chip-${userName}"]`);

}
