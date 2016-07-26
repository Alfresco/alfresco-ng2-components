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
import { ContainerModel } from './../widget.model';

import { MATERIAL_DESIGN_DIRECTIVES } from 'ng2-alfresco-core';
import { TextWidget } from './../text/text.widget';
import { NumberWidget } from './../number/number.widget';
import { CheckboxWidget } from './../checkbox/checkbox.widget';
import { MultilineTextWidget } from './../multiline-text/multiline-text.widget';
import { DropdownWidget } from './../dropdown/dropdown.widget';

declare let __moduleName: string;
declare var componentHandler;

@Component({
    moduleId: __moduleName,
    selector: 'container-widget',
    templateUrl: './container.widget.html',
    styleUrls: ['./container.widget.css'],
    directives: [
        MATERIAL_DESIGN_DIRECTIVES,
        TextWidget,
        NumberWidget,
        CheckboxWidget,
        MultilineTextWidget,
        DropdownWidget
    ]
})
export class ContainerWidget implements AfterViewInit {

    @Input()
    content: ContainerModel;

    onExpanderClicked() {
        if (this.content && this.content.isCollapsible()) {
            this.content.isExpanded = !this.content.isExpanded;
        }
    }

    ngAfterViewInit() {
        // workaround for MDL issues with dynamic components
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }
    }

}
