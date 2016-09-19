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

import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AlfrescoTranslationService, AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { ActivitiTaskListService } from './../services/activiti-tasklist.service';
import { AppDefinitionRepresentationModel } from '../models/filter.model';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';

declare let componentHandler: any;
declare let __moduleName: string;

@Component({
    selector: 'activiti-apps',
    moduleId: __moduleName,
    templateUrl: 'activiti-apps.component.html',
    styleUrls: ['./activiti-apps.component.css', './activiti-apps-grid.component.css'],
    providers: [ActivitiTaskListService]
})
export class ActivitiApps implements OnInit {

    public static LAYOUT_LIST: string = 'LIST';
    public static LAYOUT_GRID: string = 'GRID';

    @Input()
    layoutType: string = ActivitiApps.LAYOUT_GRID;

    @Output()
    appClick: EventEmitter<AppDefinitionRepresentationModel> = new EventEmitter<AppDefinitionRepresentationModel>();

    private appsObserver: Observer<AppDefinitionRepresentationModel>;
    apps$: Observable<AppDefinitionRepresentationModel>;

    currentApp: AppDefinitionRepresentationModel;

    appList: AppDefinitionRepresentationModel [] = [];

    /**
     * Constructor
     * @param auth
     * @param translate
     */
    constructor(private auth: AlfrescoAuthenticationService,
                private translate: AlfrescoTranslationService,
                private activitiTaskList: ActivitiTaskListService) {

        if (translate) {
            translate.addTranslationFolder('node_modules/ng2-activiti-tasklist/src');
        }

        this.apps$ = new Observable<AppDefinitionRepresentationModel>(observer =>  this.appsObserver = observer).share();
    }

    ngOnInit() {
        if (!this.isValidType()) {
            throw( new Error(`LayoutType property allowed values: ${ActivitiApps.LAYOUT_LIST} - ${ActivitiApps.LAYOUT_GRID}`));
        }

        this.apps$.subscribe((app: any) => {
            this.appList.push(app);
        });
        this.load();
    }

    public load(name?: string) {
        this.activitiTaskList.getDeployedApplications(name).subscribe(
            (res) => {
                res.forEach((app) => {
                    if (app.deploymentId) {
                        this.appsObserver.next(app);
                    }
                });
            },
            (err) => {
                console.log(err);
            }
        );
    }

    /**
     * Pass the selected app as next
     * @param app
     */
    public selectApp(app: AppDefinitionRepresentationModel) {
        this.currentApp = app;
        this.appClick.emit(app);
    }

    /**
     * Return true if the appId is the current app
     * @param appId
     * @returns {boolean}
     */
    isSelected(appId: number): boolean {
        return (this.currentApp !== undefined && appId === this.currentApp.id);
    }

    /**
     * Check if the value of the layoutType property is an allowed value
     * @returns {boolean}
     */
    isValidType(): boolean {
        if (this.layoutType && (this.layoutType === ActivitiApps.LAYOUT_LIST || this.layoutType === ActivitiApps.LAYOUT_GRID)) {
            return true;
        }
        return false;
    }

    /**
     * Return true if the layout type is LIST
     * @returns {boolean}
     */
    isList(): boolean {
        return this.layoutType === ActivitiApps.LAYOUT_LIST;
    }

    /**
     * Return true if the layout type is GRID
     * @returns {boolean}
     */
    isGrid(): boolean {
        return this.layoutType === ActivitiApps.LAYOUT_GRID;
    }

    isEmpty(): boolean {
        return this.appList.length === 0;
    }
}
