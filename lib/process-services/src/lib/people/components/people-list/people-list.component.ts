/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { DataTableComponent, DataCellEvent, DataColumnListComponent, ShowHeaderMode } from '@alfresco/adf-core';
import { AfterContentInit, Component, ContentChild, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { UserEventModel } from '../../../task-list/models/user-event.model';
import { LightUserRepresentation } from '@alfresco/js-api';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'adf-people-list',
    imports: [CommonModule, DataTableComponent],
    templateUrl: './people-list.component.html',
    styleUrls: ['./people-list.component.scss']
})
export class PeopleListComponent implements AfterContentInit {
    @ContentChild(DataColumnListComponent)
    columnList: DataColumnListComponent;

    @ViewChild('dataTable', { static: true })
    peopleDataTable: DataTableComponent;

    /** The array of user data used to populate the people list. */
    @Input()
    users: LightUserRepresentation[];

    /** Toggles if actions should be visible, i.e. the 'Three-Dots' menu. */
    @Input()
    actions: boolean = false;

    /** Emitted when the user clicks a row in the people list. */
    @Output()
    clickRow = new EventEmitter<LightUserRepresentation>();

    /** Emitted when the user clicks in the 'Three Dots' drop down menu for a row. */
    @Output()
    clickAction = new EventEmitter<UserEventModel>();

    user: LightUserRepresentation;
    showHeader = ShowHeaderMode.Never;

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

        event.value.actions = [removeAction];
    }

    onExecuteRowAction(event: any) {
        const args = event.value;
        const action = args.action;
        this.clickAction.emit({ type: action.name, value: args.row.obj });
    }
}
