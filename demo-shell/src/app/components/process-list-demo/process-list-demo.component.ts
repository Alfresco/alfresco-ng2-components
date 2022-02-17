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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

const DEFAULT_SIZE = 20;

@Component({
    templateUrl: './process-list-demo.component.html',
    styleUrls: [`./process-list-demo.component.scss`]
})

export class ProcessListDemoComponent implements OnInit, OnDestroy {
    minValue = 0;
    processListForm: FormGroup;
    appId: number;
    processDefId: string;
    processInsId: string;
    state: string;
    sort: string;
    size: number = DEFAULT_SIZE;
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

    private onDestroy$ = new Subject<boolean>();

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

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    buildForm() {
        this.processListForm = this.formBuilder.group({
            processAppId: new FormControl(this.appId, [Validators.pattern('^[0-9]*$'), Validators.min(this.minValue)]),
            processDefinitionId: new FormControl(''),
            processInstanceId: new FormControl(''),
            processState: new FormControl(''),
            processSort: new FormControl(''),
            processSize: new FormControl('', [Validators.pattern('^[0-9]*$'), Validators.min(this.minValue)]),
            processPage: new FormControl('', [Validators.pattern('^[0-9]*$'), Validators.min(this.minValue)])
        });

        this.processListForm.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .pipe(debounceTime(500))
            .subscribe(processFilter => {
                if (this.isFormValid()) {
                    this.filterProcesses(processFilter);
                }
            });

    }

    filterProcesses(processFilter: any) {
        if (processFilter.processAppId && processFilter.processAppId !== 0) {
            this.appId = processFilter.processAppId;
        } else {
            this.appId = null;
        }
        this.processDefId = processFilter.processDefinitionId;
        this.processInsId = processFilter.processInstanceId;
        this.state = processFilter.processState;
        if (!processFilter.processState) {
            this.state = this.stateOptions[0].value;
        }
        this.sort = processFilter.processSort;
        if (processFilter.processSize) {
            this.size = parseInt(processFilter.processSize, 10);
        }
        if (processFilter.processPage) {
            const pageValue = parseInt(processFilter.processPage, 10);
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
        this.size = DEFAULT_SIZE;
        this.page = null;
    }

    getStatus(ended: Date) {
        return ended ? 'Completed' : 'Active';
    }

    private getControl<T extends AbstractControl>(key: string): T {
        return this.processListForm.get(key) as T;
    }

    get processAppId(): FormControl {
        return this.getControl<FormControl>('processAppId');
    }

    get processDefinitionId(): FormControl {
        return this.getControl<FormControl>('processDefinitionId');
    }

    get processInstanceId(): FormControl {
        return this.getControl<FormControl>('processInstanceId');
    }

    get processState(): FormControl {
        return this.getControl<FormControl>('processState');
    }

    get processSort(): FormControl {
        return this.getControl<FormControl>('processSort');
    }

    get processSize(): FormControl {
        return this.getControl<FormControl>('processSize');
    }

    get processPage(): FormControl {
        return this.getControl<FormControl>('processPage');
    }
}
