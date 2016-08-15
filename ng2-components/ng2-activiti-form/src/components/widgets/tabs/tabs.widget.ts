/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { Component, Input, AfterViewInit } from '@angular/core';
import { MATERIAL_DESIGN_DIRECTIVES } from 'ng2-alfresco-core';
import { TabModel } from './../core/index';
import { ContainerWidget } from './../container/container.widget';

declare let __moduleName: string;
declare var componentHandler;

@Component({
    moduleId: __moduleName,
    selector: 'tabs-widget',
    templateUrl: './tabs.widget.html',
    directives: [MATERIAL_DESIGN_DIRECTIVES, ContainerWidget]
})
export class TabsWidget implements AfterViewInit {

    @Input()
    tabs: TabModel[] = [];

    hasTabs() {
        return this.tabs && this.tabs.length > 0;
    }

    ngAfterViewInit() {
        // workaround for MDL issues with dynamic components
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }
    }
}
