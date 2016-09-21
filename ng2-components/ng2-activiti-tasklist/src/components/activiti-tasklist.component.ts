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

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { ObjectDataTableAdapter, DataTableAdapter, DataRowEvent, ObjectDataRow } from 'ng2-alfresco-datatable';
import { ActivitiTaskListService } from './../services/activiti-tasklist.service';
import { UserTaskFilterRepresentationModel, TaskQueryRequestRepresentationModel } from '../models/filter.model';

declare let componentHandler: any;
declare let __moduleName: string;

@Component({
    selector: 'activiti-tasklist',
    moduleId: __moduleName,
    templateUrl: './activiti-tasklist.component.html',
    styleUrls: ['./activiti-tasklist.component.css']
})
export class ActivitiTaskList implements OnInit, OnChanges {

    @Input()
    taskFilter: UserTaskFilterRepresentationModel;

    @Input()
    data: DataTableAdapter;

    @Output()
    rowClick: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    onSuccess: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onError: EventEmitter<any> = new EventEmitter<any>();

    currentTaskId: string;

    private defaultSchemaColumn: any[] = [
        {type: 'text', key: 'id', title: 'Id'},
        {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true},
        {type: 'text', key: 'formKey', title: 'Form Key', sortable: true},
        {type: 'text', key: 'created', title: 'Created', sortable: true}
    ];

    constructor(private translate: AlfrescoTranslationService,
                public activiti: ActivitiTaskListService) {
        if (translate) {
            translate.addTranslationFolder('node_modules/ng2-activiti-tasklist/src');
        }
    }

    ngOnInit() {
        if (!this.data) {
            this.data = new ObjectDataTableAdapter(
                [],
                this.defaultSchemaColumn
            );
        }

        if (this.taskFilter) {
            let requestNode = this.convertTaskUserToTaskQuery(this.taskFilter);
            this.load(new TaskQueryRequestRepresentationModel(requestNode));
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        let taskFilter = changes['taskFilter'];
        if (taskFilter && taskFilter.currentValue) {
            let requestNode = this.convertTaskUserToTaskQuery(taskFilter.currentValue);
            this.load(new TaskQueryRequestRepresentationModel(requestNode));
            return;
        }
    }

    public load(requestNode: TaskQueryRequestRepresentationModel) {
        this.activiti.getTotalTasks(requestNode).subscribe(
            (res) => {
                requestNode.size = res.total;
                this.activiti.getTasks(requestNode).subscribe(
                    (response) => {
                        let taskRow = this.createDataRow(response.data);
                        this.renderTasks(taskRow);
                        this.selectFirstTask();
                        this.onSuccess.emit(response);
                    }, (error) => {
                        console.error(error);
                        this.onError.emit(error);
                    });
            }, (err) => {
                console.error(err);
                this.onError.emit(err);
            });
    }

    /**
     * Create an array of ObjectDataRow
     * @param tasks
     * @returns {ObjectDataRow[]}
     */
    private createDataRow(tasks: any[]): ObjectDataRow[] {
        let taskRows: ObjectDataRow[] = [];
        tasks.forEach((row) => {
            taskRows.push(new ObjectDataRow({
                id: row.id,
                name: row.name,
                created: row.created
            }));
        });
        return taskRows;
    }


    /**
     * The method call the adapter data table component for render the task list
     * @param tasks
     */
    private renderTasks(tasks: any[]) {
        tasks = this.optimizeTaskName(tasks);
        this.data.setRows(tasks);
    }

    /**
     * Select the first task of a tasklist if present
     */
    private selectFirstTask() {
        if (!this.isTaskListEmpty()) {
            this.currentTaskId = this.data.getRows()[0].getValue('id');
        } else {
            this.currentTaskId = null;
        }
    }

    /**
     * Return the current task
     * @returns {string}
     */
    getCurrentTaskId(): string {
        return this.currentTaskId;
    }

    /**
     * Check if the tasks list is empty
     * @returns {ObjectDataTableAdapter|boolean}
     */
    isTaskListEmpty(): boolean {
        return this.data === undefined || (this.data && this.data.getRows() && this.data.getRows().length === 0);
    }

    /**
     * Emit the event rowClick passing the current task id when the row is clicked
     * @param event
     */
    onRowClick(event: DataRowEvent) {
        let item = event;
        this.currentTaskId = item.value.getValue('id');
        this.rowClick.emit(this.currentTaskId);
    }

    /**
     * Optimize task name field
     * @param tasks
     * @returns {any[]}
     */
    private optimizeTaskName(tasks: any[]) {
        tasks = tasks.map(t => {
            t.obj.name = t.obj.name || 'Nameless task';
            if (t.obj.name.length > 50) {
                t.obj.name = t.obj.name.substring(0, 50) + '...';
            }
            return t;
        });
        return tasks;
    }

    private convertTaskUserToTaskQuery(userTask: UserTaskFilterRepresentationModel) {
        let requestNode = {appDefinitionId: userTask.appId,
            processDefinitionId: userTask.filter.processDefinitionId,
            text: userTask.filter.name,
            assignment: userTask.filter.assignment,
            state: userTask.filter.state,
            sort: userTask.filter.sort};
        return new TaskQueryRequestRepresentationModel(requestNode);
    }
}
