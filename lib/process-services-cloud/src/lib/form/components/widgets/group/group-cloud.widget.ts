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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { baseHost, WidgetComponent, IdentityGroupCountModel } from '@alfresco/adf-core';

/* tslint:disable:component-selector  */

@Component({
    selector: 'group-cloud-widget',
    templateUrl: './group-cloud.widget.html',
    host: baseHost,
    encapsulation: ViewEncapsulation.None
})
export class GroupCloudWidgetComponent extends WidgetComponent implements OnInit {

    roles: string[];
    mode: string;
    title: string;
    preSelectGroup: IdentityGroupCountModel[];

    ngOnInit() {
        if (this.field) {
            this.roles = this.field.roles;
            this.mode = this.field.optionType;
            this.title = this.field.placeholder;
            this.preSelectGroup = this.field.value ? this.field.value : [];
        }
    }
}
