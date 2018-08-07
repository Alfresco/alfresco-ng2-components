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
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { debounceTime } from 'rxjs/operators';

@Component({
    templateUrl: './process-list-demo.component.html',
    styleUrls: [`./process-list-demo.component.scss`],
})

export class ProcessListDemoComponent implements OnInit {

    processListForm: FormGroup;

    defaultAppId: number;

    appId: number;

    name: string;

    processDefId: string;

    instanceId: number|string;

    state: string;

    sort: string;

    presetColumn = 'default';

    stateOptions = [
        { value: 'all', title: 'All' },
        { value: 'active', title: 'Active' },
        { value: 'completed', title: 'Completed' }
    ];

    sortOptions = [
        {value: 'created-asc', title: 'Created (asc)'},
        {value: 'created-desc', title: 'Created (desc)'}
    ];

    constructor(private route: ActivatedRoute,
                private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        if (this.route) {
            this.route.params.forEach((params: Params) => {
                this.defaultAppId = params['id'] ? +params['id'] : 0;
            });
        }
        this.appId = this.defaultAppId;
        this.buildForm();
    }

    buildForm() {
        this.processListForm = this.formBuilder.group({
            processAppId: new FormControl(this.defaultAppId, [Validators.required, Validators.pattern('^[0-9]*$')]),
            processDefinitionId: new FormControl(''),
            processInstanceId: new FormControl(''),
            processState: new FormControl(''),
            processSort: new FormControl('')
        });

        this.processListForm.valueChanges
            .pipe(
                debounceTime(500)
            )
            .subscribe(processFilter => {
                if (this.isFormValid()) {
                    this.filterProcesses(processFilter);
                }
            });

    }

    filterProcesses(processFilter: any) {
        this.appId = processFilter.processAppId;
        this.name = processFilter.processName;
        this.processDefId = processFilter.processDefinitionId;
        this.instanceId = processFilter.processInstanceId;
        this.state = processFilter.processState;
        this.sort = processFilter.processSort;
    }

    isFormValid() {
        return this.processListForm && this.processListForm.dirty && this.processListForm.valid;
    }

    resetProcessForm() {
        this.processListForm.reset();
    }

    getStatus(ended: Date) {
        return ended ? 'Completed' : 'Active';
    }

    get processAppId(): AbstractControl {
        return this.processListForm.get('processAppId');
    }

    get processDefinitionId(): AbstractControl {
        return this.processListForm.get('processDefinitionId');
    }

    get processInstanceId(): AbstractControl {
        return this.processListForm.get('processInstanceId');
    }

    get processState(): AbstractControl {
        return this.processListForm.get('processState');
    }

    get processSort(): AbstractControl {
        return this.processListForm.get('processSort');
    }
}
