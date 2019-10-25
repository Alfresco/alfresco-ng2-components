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

import { ENTER, ESCAPE } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { FormService } from '../../../services/form.service';
import { GroupModel } from './../core/group.model';
import { baseHost , WidgetComponent } from './../widget.component';

@Component({
    selector: 'functional-group-widget',
    templateUrl: './functional-group.widget.html',
    styleUrls: ['./functional-group.widget.scss'],
    host: baseHost,
    encapsulation: ViewEncapsulation.None
})
export class FunctionalGroupWidgetComponent extends WidgetComponent implements OnInit {

    value: string;
    oldValue: string;
    groups: GroupModel[] = [];
    minTermLength: number = 1;
    groupId: string;

    constructor(public formService: FormService,
                public elementRef: ElementRef) {
         super(formService);
    }

    ngOnInit() {
        if (this.field) {
            const group = this.field.value;
            if (group) {
                this.value = group.name;
            }

            const params = this.field.params;
            if (params && params['restrictWithGroup']) {
                const restrictWithGroup = <GroupModel> params['restrictWithGroup'];
                this.groupId = restrictWithGroup.id;
            }

            // Load auto-completion for previously saved value
            if (this.value) {
                this.formService
                    .getWorkflowGroups(this.value, this.groupId)
                    .subscribe(groups => this.groups = groups || []);
            }
        }
    }

    onKeyUp(event: KeyboardEvent) {
        if (this.value && this.value.length >= this.minTermLength  && this.oldValue !== this.value) {
            if (event.keyCode !== ESCAPE && event.keyCode !== ENTER) {
                this.oldValue = this.value;
                this.formService
                    .getWorkflowGroups(this.value, this.groupId)
                    .subscribe(groups => this.groups = groups || []);
            }
        }
    }

    flushValue() {
        const option = this.groups.find((item) => item.name.toLocaleLowerCase() === this.value.toLocaleLowerCase());

        if (option) {
            this.field.value = option;
            this.value = option.name;
        } else {
            this.field.value = null;
            this.value = null;
        }

        this.field.updateForm();
    }

    onItemClick(item: GroupModel, event: Event) {
        if (item) {
            this.field.value = item;
            this.value = item.name;
        }
        if (event) {
            event.preventDefault();
        }
    }

    onItemSelect(item: GroupModel) {
        if (item) {
            this.field.value = item;
            this.value = item.name;
        }
    }
}
