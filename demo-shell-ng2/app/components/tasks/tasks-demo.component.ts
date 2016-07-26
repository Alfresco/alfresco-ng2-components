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

import { Component, OnInit } from '@angular/core';
import { ALFRESCO_TASKLIST_DIRECTIVES } from 'ng2-activiti-tasklist';
import { ActivitiForm } from 'ng2-activiti-form';

import { ObjectDataTableAdapter, ObjectDataColumn } from 'ng2-alfresco-datatable';

@Component({
    selector: 'tasks-demo',
    template: `
    <div class="mdl-grid">
      <div class="mdl-cell mdl-cell--2-col"
      style="background-color: #ececec; padding: 10px 10px 10px 10px; border-left: solid 2px rgb(31,188,210); border-right : solid       2px rgb(31,188,210);">
        <ul class="demo-list-item mdl-list">
          <li class="mdl-list__item">
            <span class="mdl-list__item-primary-content">
              <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="option-1">
                  <input type="radio" value="task-list"
                     (change)="setChoice($event)" name="options" id="option-1" checked class="mdl-radio__button">
                  <span class="mdl-radio__label">Task List</span>
               </label>
            </span>
          </li>
          <li class="mdl-list__item">
            <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="option-2">
              <input type="radio" value="process-list"
                (change)="setChoice($event)" name="options" id="option-2" class="mdl-radio__button">
              <span class="mdl-radio__label">Process List</span>
            </label>
          </li>
        </ul>
      </div>
      <div class="mdl-cell mdl-cell--3-col"
            style="background-color: #ececec; padding: 10px 10px 10px 10px; border-left: solid 2px rgb(31,188,210); border-right : solid       2px rgb(31,188,210);">
            <activiti-tasklist *ngIf="isTaskListSelected()" [data]="data" (rowClick)="onRowClick($event)"></activiti-tasklist>
      </div>
      <div class="mdl-cell mdl-cell--7-col"
            style="background-color: #ececec; padding: 10px 10px 10px 10px; border-left: solid 2px rgb(31,188,210); border-right : solid       2px rgb(31,188,210);">
        <activiti-task-details [taskId]="currentTaskId"></activiti-task-details>
      </div>
    </div>

    `,
    directives: [ALFRESCO_TASKLIST_DIRECTIVES, ActivitiForm],
    styles: [':host > .container { padding: 10px; }']
})
export class TasksDemoComponent implements OnInit {

    currentChoice: string = 'task-list';

    currentTaskId: string;

    data: ObjectDataTableAdapter;
    constructor() {
        this.data = new ObjectDataTableAdapter([], []);
    }

    setChoice($event) {
        this.currentChoice = $event.target.value;
    }

    isProcessListSelected() {
        return this.currentChoice === 'process-list';
    }

    isTaskListSelected() {
        return this.currentChoice === 'task-list';
    }

    ngOnInit() {
        let schema = [
            {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true}
        ];

        let columns = schema.map(col => new ObjectDataColumn(col));
        this.data.setColumns(columns);
    }

    onRowClick(taskId) {
        this.currentTaskId = taskId;
    }

}
