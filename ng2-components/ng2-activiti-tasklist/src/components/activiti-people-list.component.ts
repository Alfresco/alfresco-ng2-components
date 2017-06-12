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

import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { User } from '../models/user.model';

@Component({
    selector: 'activiti-people-list',
    template: `
<alfresco-datatable
    [rows]="users"
    [actions]="hasActions()"
    (rowClick)="selectUser($event)"
    (showRowActionsMenu)="onShowRowActionsMenu($event)"
    (executeRowAction)="onExecuteRowAction($event)">
    <data-columns>
        <data-column key="email" type="text" title="email" class="full-width ellipsis-cell"></data-column>
    </data-columns>
</alfresco-datatable>
`
})

export class ActivitiPeopleList implements OnChanges {

    @Input()
    users: User[];

    @Input()
    actions: boolean = false;

    @Output()
    onRowClicked: EventEmitter<any> = new EventEmitter();

    @Output()
    clickAction: EventEmitter<any> = new EventEmitter();

    user: User;

    constructor(){}

    ngOnChanges(changes: SimpleChanges) {
        console.log(this.users);
    }

    selectUser(event) {
        this.user = event.value.obj;
        this.onRowClicked.emit(this.user);

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
        this.clickAction.emit({type: action.name, value: args.row.obj});
    }

}
