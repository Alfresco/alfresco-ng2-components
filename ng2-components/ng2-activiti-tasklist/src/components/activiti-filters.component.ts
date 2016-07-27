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

import { Component, Output, EventEmitter, OnInit} from '@angular/core';
import { AlfrescoTranslationService, AlfrescoAuthenticationService, AlfrescoPipeTranslate } from 'ng2-alfresco-core';
import { ActivitiTaskListService } from './../services/activiti-tasklist.service';
import { FilterModel } from '../models/filter.model';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';

declare let componentHandler: any;
declare let __moduleName: string;

@Component({
    selector: 'activiti-filters',
    moduleId: __moduleName,
    templateUrl: './activiti-filters.component.html',
    providers: [ActivitiTaskListService],
    pipes: [ AlfrescoPipeTranslate ]

})
export class ActivitiFilters implements OnInit {

    @Output()
    filterClick: EventEmitter<FilterModel> = new EventEmitter<FilterModel>();

    private filterObserver: Observer<FilterModel>;
    filter$: Observable<FilterModel>;

    currentFilter: FilterModel;

    filters: FilterModel [] = [];
    /**
     * Constructor
     * @param auth
     * @param translate
     */
    constructor(private auth: AlfrescoAuthenticationService,
                private translate: AlfrescoTranslationService,
                public activiti: ActivitiTaskListService) {
        this.filter$ = new Observable<FilterModel>(observer =>  this.filterObserver = observer).share();

        if (translate) {
            translate.addTranslationFolder('node_modules/ng2-activiti-tasklist');
        }
    }

    ngOnInit() {
        this.filter$.subscribe((filter: FilterModel) => {
            this.filters.push(filter);
        });

        this.load();
    }

    /**
     * The method call the adapter data table component for render the task list
     * @param tasks
     */
    private load() {
        this.activiti.getTaskListFilters().subscribe(
            (res: FilterModel[]) => {
                res.forEach((filter) => {
                    this.filterObserver.next(filter);
                });
            },
            (err) => {
                console.log(err);
            }
        );
    }

    /**
     * Pass the selected filter as next
     * @param filter
     */
    public selectFilter(filter: FilterModel) {
        this.filterClick.emit(filter);
    }
}
