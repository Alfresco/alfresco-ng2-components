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

import { Component, Output, EventEmitter, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AlfrescoTranslationService, AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { ActivitiProcessService } from './../services/activiti-process.service';
import { FilterRepresentationModel } from '../models/filter.model';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';

declare let componentHandler: any;
declare let __moduleName: string;

@Component({
    selector: 'activiti-process-instance-filters',
    moduleId: __moduleName,
    templateUrl: './activiti-filters.component.html',
    styleUrls: ['activiti-filters.component.css'],
    providers: [ActivitiProcessService]
})
export class ActivitiProcessFilters implements OnInit, OnChanges {

    @Output()
    filterClick: EventEmitter<FilterRepresentationModel> = new EventEmitter<FilterRepresentationModel>();

    @Output()
    onSuccess: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onError: EventEmitter<any> = new EventEmitter<any>();

    @Input()
    appId: string;

    @Input()
    appName: string;

    private filterObserver: Observer<FilterRepresentationModel>;
    filter$: Observable<FilterRepresentationModel>;

    currentFilter: FilterRepresentationModel;

    filters: FilterRepresentationModel [] = [];

    /**
     * Constructor
     * @param auth
     * @param translate
     * @param activiti
     */
    constructor(private auth: AlfrescoAuthenticationService,
                private translate: AlfrescoTranslationService,
                public activiti: ActivitiProcessService) {
        this.filter$ = new Observable<FilterRepresentationModel>(observer => this.filterObserver = observer).share();

        if (translate) {
            translate.addTranslationFolder('node_modules/ng2-activiti-processlist/src');
        }
    }

    ngOnInit() {
        this.filter$.subscribe((filter: FilterRepresentationModel) => {
            this.filters.push(filter);
        });

        this.load();
    }

    ngOnChanges(changes: SimpleChanges) {
        let appId = changes['appId'];
        if (appId && appId.currentValue) {
            this.load();
            return;
        }
    }

    /**
     * The method call the adapter data table component for render the task list
     * @param tasks
     */
    private load() {
        this.resetFilter();
        if (this.appName) {
            this.filterByAppName();
        } else {
            this.filterByAppId(this.appId);
        }
    }

    private filterByAppId(appId) {
        this.activiti.getProcessFilters(appId).subscribe(
            (res: FilterRepresentationModel[]) => {
                res.forEach((filter) => {
                    this.filterObserver.next(filter);
                });
                this.selectFirstFilter();
                this.onSuccess.emit(res);
            },
            (err) => {
                console.log(err);
                this.onError.emit(err);
            }
        );
    }

    private filterByAppName() {
        this.activiti.getDeployedApplications(this.appName).subscribe(
            application => {
                this.filterByAppId(application.id);
                this.selectFirstFilter();
            },
            (err) => {
                console.log(err);
                this.onError.emit(err);
            });
    }

    /**
     * Pass the selected filter as next
     * @param filter
     */
    public selectFilter(filter: FilterRepresentationModel) {
        this.currentFilter = filter;
        this.filterClick.emit(filter);
    }

    /**
     * Select the first filter of a list if present
     */
    private selectFirstFilter() {
        if (!this.isFilterListEmpty()) {
            this.currentFilter = this.filters[0];
        } else {
            this.currentFilter = null;
        }
    }

    /**
     * Return the current task
     * @returns {FilterRepresentationModel}
     */
    getCurrentFilter(): FilterRepresentationModel {
        return this.currentFilter;
    }

    /**
     * Check if the filter list is empty
     * @returns {boolean}
     */
    isFilterListEmpty(): boolean {
        return this.filters === undefined || (this.filters && this.filters.length === 0);
    }

    /**
     * Reset the filters properties
     */
    private resetFilter() {
        this.filters = [];
        this.currentFilter = null;
    }
}
