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

import { DataTableComponent, DataCellEvent } from '@alfresco/adf-core';
import { DataColumnListComponent, UserProcessModel } from '@alfresco/adf-core';
import { AfterContentInit, Component, ContentChild, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { UserEventModel } from '../../../task-list/models/user-event.model';

@Component({
    selector: 'adf-people-list',
    templateUrl: './people-list.component.html',
    styleUrls: ['./people-list.component.scss']
})

export class PeopleListComponent implements AfterContentInit {

    @ContentChild(DataColumnListComponent)
    columnList: DataColumnListComponent;

    @ViewChild('dataTable')
    peopleDataTable: DataTableComponent;

    /** The array of user data used to populate the people list. */
    @Input()
    users: UserProcessModel[];

    /** Toggles whether or not actions should be visible, i.e. the 'Three-Dots' menu. */
    @Input()
    actions: boolean = false;

    /** Emitted when the user clicks a row in the people list. */
    @Output()
    clickRow = new EventEmitter<UserProcessModel>();

    /** Emitted when the user clicks in the 'Three Dots' drop down menu for a row. */
    @Output()
    clickAction = new EventEmitter<UserEventModel>();

    user: UserProcessModel;

    ngAfterContentInit() {
        this.peopleDataTable.columnList = this.columnList;
    }

    selectUser(event: any) {
        this.user = event.value.obj;
        this.clickRow.emit(this.user);
    }

    hasActions(): boolean {
        return this.actions;
    }

    onShowRowActionsMenu(event: DataCellEvent) {

        const removeAction = {
            title: 'Remove',
            name: 'remove'
        };

        event.value.actions = [
            removeAction
        ];
    }

    onExecuteRowAction(event: any) {
        const args = event.value;
        const action = args.action;
        this.clickAction.emit({type: action.name, value: args.row.obj});
    }
}
