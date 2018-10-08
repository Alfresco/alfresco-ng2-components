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
    styleUrls: [`./process-list-demo.component.scss`]
})

export class ProcessListDemoComponent implements OnInit {

    DEFAULT_SIZE = 20;

    minValue = 1;

    processListForm: FormGroup;

    appId: number;
    processDefId: string;
    state: string;
    sort: string;
    size: number = this.DEFAULT_SIZE;
    page: number = 0;

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
        this.resetQueryParameters();

        if (this.route) {
            this.route.params.forEach((params: Params) => {
                if (params['id']) {
                    this.appId = params['id'];
                }
            });
        }

        this.buildForm();
    }

    buildForm() {
        this.processListForm = this.formBuilder.group({
            processAppId: new FormControl(this.appId, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(this.minValue)]),
            processDefinitionId: new FormControl(''),
            processState: new FormControl(''),
            processSort: new FormControl(''),
            processSize: new FormControl('', [Validators.pattern('^[0-9]*$'), Validators.min(this.minValue)]),
            processPage: new FormControl('', [Validators.pattern('^[0-9]*$'), Validators.min(this.minValue)])
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
        this.processDefId = processFilter.processDefinitionId;
        this.state = processFilter.processState;
        if (!processFilter.processState) {
            this.state = this.stateOptions[0].value;
        }
        this.sort = processFilter.processSort;
        if (processFilter.processSize) {
            this.size = parseInt(processFilter.processSize, 10);
        }
        if (processFilter.processPage) {
            let pageValue = parseInt(processFilter.processPage, 10);
            this.page = pageValue > 0 ? pageValue - 1 : pageValue;
        } else {
            this.page = 0;
        }
    }

    isFormValid() {
        return this.processListForm && this.processListForm.dirty && this.processListForm.valid;
    }

    resetProcessForm() {
        this.processListForm.reset();
        this.resetQueryParameters();
    }

    resetQueryParameters() {
        this.appId = null;
        this.processDefId = null;
        this.state = this.stateOptions[0].value;
        this.sort = null;
        this.size = this.DEFAULT_SIZE;
        this.page = null;
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

    get processState(): AbstractControl {
        return this.processListForm.get('processState');
    }

    get processSort(): AbstractControl {
        return this.processListForm.get('processSort');
    }

    get processSize(): AbstractControl {
        return this.processListForm.get('processSize');
    }

    get processPage(): AbstractControl {
        return this.processListForm.get('processPage');
    }
}
