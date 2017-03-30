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

import { Component, Output, EventEmitter, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Observer, Observable } from 'rxjs/Rx';
import { AlfrescoTranslationService, LogService } from 'ng2-alfresco-core';
import { ActivitiTaskListService } from './../services/activiti-tasklist.service';
import { FilterRepresentationModel } from '../models/filter.model';

declare let componentHandler: any;

@Component({
    selector: 'activiti-filters',
    moduleId: module.id,
    templateUrl: './activiti-filters.component.html',
    styleUrls: ['activiti-filters.component.css'],
    providers: [ActivitiTaskListService]
})
export class ActivitiFilters implements OnInit, OnChanges {

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

    constructor(private translateService: AlfrescoTranslationService,
                private activiti: ActivitiTaskListService,
                private logService: LogService) {
        this.filter$ = new Observable<FilterRepresentationModel>(observer => this.filterObserver = observer).share();

        if (translateService) {
            translateService.addTranslationFolder('ng2-activiti-tasklist', 'node_modules/ng2-activiti-tasklist/src');
        }
    }

    ngOnInit() {
        this.filter$.subscribe((filter: FilterRepresentationModel) => {
            this.filters.push(filter);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        let appId = changes['appId'];
        if (appId && (appId.currentValue || appId.currentValue === null)) {
            this.getFiltersByAppId(appId.currentValue);
            return;
        }
        let appName = changes['appName'];
        if (appName && appName !== null && appName.currentValue) {
            this.getFiltersByAppName(appName.currentValue);
            return;
        }

        this.getFiltersByAppId();
    }

    /**
     * Return the task list filtered by appId or by appName
     * @param appId
     * @param appName
     */
    getFilters(appId?: string, appName?: string) {
        if (appName) {
            this.getFiltersByAppName(appName);
        } else {
            this.getFiltersByAppId(appId);
        }
    }

    /**
     * Return the filter list filtered by appId
     * @param appId - optional
     */
    getFiltersByAppId(appId?: string) {
        this.activiti.getTaskListFilters(appId).subscribe(
            (res: FilterRepresentationModel[]) => {
                if (res.length === 0 && this.isFilterListEmpty()) {
                    this.activiti.createDefaultFilters(appId).subscribe(
                        (resDefault: FilterRepresentationModel[]) => {
                            this.resetFilter();
                            resDefault.forEach((filter) => {
                                this.filterObserver.next(filter);
                            });

                            this.selectFirstFilter();
                            this.onSuccess.emit(resDefault);
                        },
                        (errDefault: any) => {
                            this.logService.error(errDefault);
                            this.onError.emit(errDefault);
                        }
                    );
                } else {
                    this.resetFilter();
                    res.forEach((filter) => {
                        this.filterObserver.next(filter);
                    });

                    this.selectFirstFilter();
                    this.onSuccess.emit(res);
                }
            },
            (err: any) => {
                this.logService.error(err);
                this.onError.emit(err);
            }
        );
    }

    /**
     * Return the filter list filtered by appName
     * @param appName
     */
    getFiltersByAppName(appName: string) {
        this.activiti.getDeployedApplications(appName).subscribe(
            application => {
                this.getFiltersByAppId(application.id);
                this.selectFirstFilter();
            },
            (err) => {
                this.logService.error(err);
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

    public selectFilterWithTask(taskId: string) {
        let filteredFilterList: FilterRepresentationModel[] = [];
        this.activiti.getFilterForTaskById(taskId, this.filters).subscribe(
            (filter: FilterRepresentationModel) => {
                filteredFilterList.push(filter);
            },
            (err) => {
                this.logService.error(err);
                this.onError.emit(err);
            },
            () => {
                if (filteredFilterList.length > 0) {
                    let myTaskFilter = filteredFilterList.find(filter => filter.name === 'My Tasks');
                    this.currentFilter = myTaskFilter ? myTaskFilter : filteredFilterList[0];
                    this.currentFilter.landingTaskId = taskId;
                    this.filterClick.emit(this.currentFilter);
                }
            });
    }

    /**
     * Select the first filter of a list if present
     */
    public selectFirstFilter() {
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
