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

import { Component, OnInit, ElementRef } from '@angular/core';
import { WidgetComponent } from './../widget.component';
import { FormService } from '../../../services/form.service';
import { GroupModel } from './../core/group.model';

@Component({
    selector: 'functional-group-widget',
    templateUrl: './functional-group.widget.html',
    styleUrls: ['./functional-group.widget.css']
})
export class FunctionalGroupWidget extends WidgetComponent implements OnInit {

    value: string;
    popupVisible: boolean = false;
    groups: GroupModel[] = [];
    minTermLength: number = 1;
    groupId: string;

    constructor(private formService: FormService,
                private elementRef: ElementRef) {
        super();
    }

    // TODO: investigate, called 2 times
    // https://github.com/angular/angular/issues/6782
    ngOnInit() {
        if (this.field) {
            let group = this.field.value;
            if (group) {
                this.value = group.name;
            }

            let params = this.field.params;
            if (params && params['restrictWithGroup']) {
                let restrictWithGroup = <GroupModel> params['restrictWithGroup'];
                this.groupId = restrictWithGroup.id;
            }

            // Load auto-completion for previously saved value
            if (this.value) {
                this.formService
                    .getWorkflowGroups(this.value, this.groupId)
                    .subscribe((result: GroupModel[]) => this.groups = result || []);
            }
        }
    }

    onKeyUp(event: KeyboardEvent) {
        if (this.value && this.value.length >= this.minTermLength) {
            this.formService.getWorkflowGroups(this.value, this.groupId)
                .subscribe((result: GroupModel[]) => {
                    this.groups = result || [];
                    this.popupVisible = this.groups.length > 0;
                });
        } else {
            this.popupVisible = false;
        }
    }

    onBlur() {
        setTimeout(() => {
            this.flushValue();
        }, 200);
    }

    flushValue() {
        this.popupVisible = false;

        let option = this.groups.find(item => item.name.toLocaleLowerCase() === this.value.toLocaleLowerCase());

        if (option) {
            this.field.value = option;
            this.value = option.name;
        } else {
            this.field.value = null;
            this.value = null;
        }

        this.field.updateForm();
    }

    // TODO: still causes onBlur execution
    onItemClick(item: GroupModel, event: Event) {
        if (item) {
            this.field.value = item;
            this.value = item.name;
        }
        if (event) {
            event.preventDefault();
        }
    }

    setupMaterialComponents(handler: any): boolean {
        super.setupMaterialComponents(handler);
        if (handler) {
            if (this.elementRef && this.value) {
                this.setupMaterialTextField(this.elementRef, handler, this.value);
                return true;
            }
        }
        return false;
    }
}
