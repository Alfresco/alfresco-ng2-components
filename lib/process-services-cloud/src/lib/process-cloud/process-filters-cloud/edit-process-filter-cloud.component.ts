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

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProcessQueryModel, FilterActionType } from '../models/process-filter-cloud.model';

@Component({
  selector: 'adf-cloud-edit-process-filter',
  templateUrl: './edit-process-filter-cloud.component.html',
  styleUrls: ['./edit-process-filter-cloud.component.scss']
})
export class EditProcessFilterCloudComponent implements OnInit {

    public static ACTION_SAVE = 'SAVE';
    public static ACTION_SAVE_AS = 'SAVE_AS';
    public static ACTION_DELETE = 'DELETE';

    @Input()
    name: string;

    @Input()
    appName: string;

    @Input()
    processDefinitionId: string;

    @Input()
    state: string;

    @Input()
    sort: string;

    @Input()
    assignment: string;

    @Input()
    order: string;

    /** Emitted when an task filter property changes. */
    @Output()
    filterChange: EventEmitter<ProcessQueryModel> = new EventEmitter();

    /** Emitted when an filter action occurs i.e Save, SaveAs, Delete. */
    @Output()
    action: EventEmitter<any> = new EventEmitter();

    columns = [
        {key: 'id', label: 'ID'},
        {key: 'name', label: 'NAME'},
        {key: 'status', label: 'STATUS'},
        {key: 'startDate', label: 'START DATE'}
      ];

    states = ['ALL', 'RUNNING', 'COMPLETED'];

    directions = ['ASC', 'DESC'];
    formHasBeenChanged = false;
    editProcessFilterForm: FormGroup;

    constructor(private formBuilder: FormBuilder) { this.buildForm(); }

    ngOnInit() {
        this.buildForm();
    }

    buildForm() {
        this.formHasBeenChanged = false;
        this.editProcessFilterForm = this.formBuilder.group({
            appName: this.appName,
            processDefinitionId: this.processDefinitionId,
            state: this.state,
            assignment: this.assignment,
            sort: this.sort,
            order: this.order
        });
        this.onFilterChange();
    }

    /**
     * Check for edit process filter form changes
     */
    onFilterChange() {
        this.editProcessFilterForm.valueChanges.subscribe((formValues: ProcessQueryModel) => {
            this.filterChange.emit(formValues);
        });
    }

    /**
     * Check if both filters are same
     */
    compareFilters(editedQuery, currentQuery): boolean  {
        return JSON.stringify(editedQuery).toLowerCase() === JSON.stringify(currentQuery).toLowerCase();
    }

    onSave() {
        this.action.emit(new FilterActionType(EditProcessFilterCloudComponent.ACTION_SAVE));
    }

    onSaveAs() {
        this.action.emit(new FilterActionType(EditProcessFilterCloudComponent.ACTION_SAVE_AS));
    }

    onDelete() {
        this.action.emit(new FilterActionType(EditProcessFilterCloudComponent.ACTION_DELETE));
    }
}
