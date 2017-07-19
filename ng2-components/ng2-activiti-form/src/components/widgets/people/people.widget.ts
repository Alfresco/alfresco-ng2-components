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

 /* tslint:disable:component-selector  */

import { Component, ElementRef, OnInit } from '@angular/core';
import { FormService } from '../../../services/form.service';
import { GroupUserModel } from '../core/group-user.model';
import { GroupModel } from '../core/group.model';
import { baseHost , WidgetComponent } from './../widget.component';

@Component({
    selector: 'people-widget',
    templateUrl: './people.widget.html',
    styleUrls: ['./people.widget.scss'],
    host: baseHost
})
export class PeopleWidgetComponent extends WidgetComponent implements OnInit {

    popupVisible: boolean = false;
    minTermLength: number = 1;
    value: string;
    users: GroupUserModel[] = [];
    groupId: string;

    constructor(public formService: FormService,
                public elementRef: ElementRef) {
         super(formService);
    }

    // TODO: investigate, called 2 times
    // https://github.com/angular/angular/issues/6782
    ngOnInit() {
        if (this.field) {
            let user: GroupUserModel = this.field.value;
            if (user) {
                this.value = this.getDisplayName(user);
            }

            let params = this.field.params;
            if (params && params['restrictWithGroup']) {
                let restrictWithGroup = <GroupModel> params['restrictWithGroup'];
                this.groupId = restrictWithGroup.id;
            }

            // Load auto-completion for previously saved value
            if (this.value) {
                this.formService
                    .getWorkflowUsers(this.value, this.groupId)
                    .subscribe((result: GroupUserModel[]) => this.users = result || []);
            }
        }
    }

    onKeyUp(event: KeyboardEvent) {
        if (this.value && this.value.length >= this.minTermLength) {
            this.formService.getWorkflowUsers(this.value, this.groupId)
                .subscribe((result: GroupUserModel[]) => {
                    this.users = result || [];
                    this.popupVisible = this.users.length > 0;
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

        let option = this.users.find(item => {
            let fullName = this.getDisplayName(item).toLocaleLowerCase();
            return fullName === this.value.toLocaleLowerCase();
        });

        if (option) {
            this.field.value = option;
            this.value = this.getDisplayName(option);
        } else {
            this.field.value = null;
            this.value = null;
        }

        this.field.updateForm();
    }

    getDisplayName(model: GroupUserModel) {
        if (model) {
            let displayName = `${model.firstName || ''} ${model.lastName || ''}`;
            return displayName.trim();
        }

        return '';
    }

    // TODO: still causes onBlur execution
    onItemClick(item: GroupUserModel, event: Event) {
        if (item) {
            this.field.value = item;
            this.value = this.getDisplayName(item);
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
