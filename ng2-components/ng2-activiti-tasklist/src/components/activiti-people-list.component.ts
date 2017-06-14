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

import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter, TemplateRef, ContentChild } from '@angular/core';
import { User } from '../models/user.model';
import { DataColumnListComponent } from 'ng2-alfresco-core';
import { DataColumn, DataTableAdapter, ObjectDataTableAdapter, ObjectDataRow } from 'ng2-alfresco-datatable';

declare let componentHandler: any;

@Component({
    selector: 'activiti-people-list',
    templateUrl: './activiti-people-list.component.html',
    styleUrls: ['./activiti-people-list.component.css']
})

export class ActivitiPeopleList implements OnChanges {

    @ContentChild(DataColumnListComponent) columnList: DataColumnListComponent;

    @Input()
    users: User[];

    @Input()
    actions: boolean = false;

    @Output()
    clickRow: EventEmitter<any> = new EventEmitter();

    @Output()
    clickAction: EventEmitter<any> = new EventEmitter();

    user: User;
    data: DataTableAdapter;

    private defaultSchemaColumn: DataColumn[] = [
        { type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true },
        { type: 'text', key: 'created', title: 'Created', cssClass: 'hidden', sortable: true }
    ];

    constructor() {
        this.data = new ObjectDataTableAdapter([], this.defaultSchemaColumn);
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log(this.users);
        this.renderInstances(this.createDataRow(this.users));
    }

    ngAfterContentInit() {
        this.setupSchema();
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

    selectUser(event) {
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
        this.clickAction.emit({type: action.name, value: args.row.obj});
    }

    /**
     * Setup html-based (html definitions) or code behind (data adapter) schema.
     * If component is assigned with an empty data adater the default schema settings applied.
     */
    setupSchema(): void {
        let schema: DataColumn[] = [];

        if (this.columnList && this.columnList.columns && this.columnList.columns.length > 0) {
            schema = this.columnList.columns.map(c => <DataColumn> c);
        }

        if (!this.data) {
            this.data = new ObjectDataTableAdapter([], schema.length > 0 ? schema : this.defaultSchemaColumn);
        } else {
            if (schema && schema.length > 0) {
                this.data.setColumns(schema);
            } else if (this.data.getColumns().length === 0) {
                this.data.setColumns(this.defaultSchemaColumn);
            }
        }
    }

    /**
     * Create an array of ObjectDataRow
     * @param instances
     * @returns {ObjectDataRow[]}
     */
    private createDataRow(instances: any[]): ObjectDataRow[] {
        let instancesRows: ObjectDataRow[] = [];
        instances.forEach((row) => {
            instancesRows.push(new ObjectDataRow(row));
        });
        return instancesRows;
    }

    /**
     * Render the instances list
     *
     * @param instances
     */
    private renderInstances(instances: any[]) {
        this.data.setRows(instances);
    }
}
