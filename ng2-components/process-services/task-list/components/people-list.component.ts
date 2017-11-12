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

import { DataTableComponent } from '@alfresco/core';
import { DataColumnListComponent, UserProcessModel } from '@alfresco/core';
import { AfterContentInit, AfterViewInit, Component, ContentChild, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { UserEventModel } from '../models/user-event.model';

@Component({
    selector: 'adf-people-list',
    templateUrl: './people-list.component.html',
    styleUrls: ['./people-list.component.scss']
})

export class PeopleListComponent implements AfterViewInit, AfterContentInit {

    @ContentChild(DataColumnListComponent) columnList: DataColumnListComponent;

    @ViewChild(DataTableComponent)
    peopleDataTable: DataTableComponent;

    @Input()
    users: UserProcessModel[];

    @Input()
    actions: boolean = false;

    @Output()
    clickRow: EventEmitter<UserProcessModel> = new EventEmitter<UserProcessModel>();

    @Output()
    clickAction: EventEmitter<UserEventModel> = new EventEmitter<UserEventModel>();

    user: UserProcessModel;

    ngAfterContentInit() {
        this.peopleDataTable.columnList = this.columnList;
    }

    ngAfterViewInit() {
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
