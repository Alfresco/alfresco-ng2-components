/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

 /* tslint:disable:component-selector  */

import { AfterContentChecked, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormFieldModel, TabModel } from './../core/index';

@Component({
    selector: 'tabs-widget',
    templateUrl: './tabs.widget.html',
    encapsulation: ViewEncapsulation.None
})
export class TabsWidgetComponent implements AfterContentChecked {

    @Input()
    tabs: TabModel[] = [];

    @Output()
    formTabChanged: EventEmitter<FormFieldModel> = new EventEmitter<FormFieldModel>();

    visibleTabs: TabModel[] = [];

    hasTabs() {
        return this.tabs && this.tabs.length > 0;
    }

    ngAfterContentChecked() {
        this.filterVisibleTabs();
    }

    filterVisibleTabs() {
        this.visibleTabs = this.tabs.filter((tab) => {
            return tab.isVisible;
        });
    }

    tabChanged(field: FormFieldModel) {
        this.formTabChanged.emit(field);
    }

}
