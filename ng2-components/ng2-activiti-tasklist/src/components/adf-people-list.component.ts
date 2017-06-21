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

import { Component, Input, Output, EventEmitter, ViewChild, ContentChild } from '@angular/core';
import { User, UserEventModel } from '../models/index';
import { DataColumnListComponent } from 'ng2-alfresco-core';
import { DataTableComponent } from 'ng2-alfresco-datatable';

declare let componentHandler: any;

@Component({
    selector: 'adf-people-list',
    templateUrl: './adf-people-list.component.html',
    styleUrls: ['./adf-people-list.component.css']
})

export class PeopleList {

    @ContentChild(DataColumnListComponent) columnList: DataColumnListComponent;

    @ViewChild(DataTableComponent)
    peopleDataTable: DataTableComponent;

    @Input()
    users: User[];

    @Input()
    actions: boolean = false;

    @Output()
    clickRow: EventEmitter<User> = new EventEmitter<User>();

    @Output()
    clickAction: EventEmitter<UserEventModel> = new EventEmitter<UserEventModel>();

    user: User;

    constructor() {
    }

    ngAfterContentInit() {
        this.peopleDataTable.columnList = this.columnList;
    }

    ngAfterViewInit() {
        this.setupMaterialComponents(componentHandler);
    }

    setupMaterialComponents(handler?: any): boolean {
        // workaround for MDL issues with dynamic components
        let isUpgraded: boolean = false;
        if (handler) {
            handler.upgradeAllRegistered();
            isUpgraded = true;
        }
        return isUpgraded;
    }

    selectUser(event: any) {
        this.user = event.value.obj;
        this.clickRow.emit(this.user);
    }

    hasActions(): boolean {
        return this.actions;
    }

    onShowRowActionsMenu(event: any) {

        let removeAction = {
            title: 'Remove',
            name: 'remove'
        };

        event.value.actions = [
            removeAction
        ];
    }

    onExecuteRowAction(event: any) {
        let args = event.value;
        let action = args.action;
        this.clickAction.emit(new UserEventModel({type: action.name, value: args.row.obj}));
    }
}
