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

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AlfrescoTranslationService, AlfrescoAuthenticationService, AlfrescoPipeTranslate } from 'ng2-alfresco-core';
import { ActivitiTaskListService } from './../services/activiti-tasklist.service';
import { AppDefinitionRepresentationModel } from '../models/filter.model';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';

declare let componentHandler: any;
declare let __moduleName: string;

@Component({
    selector: 'activiti-apps',
    moduleId: __moduleName,
    templateUrl: './activiti-apps.component.html',
    styleUrls: ['./activiti-apps.component.css'],
    providers: [ActivitiTaskListService],
    pipes: [AlfrescoPipeTranslate]

})
export class ActivitiApps implements OnInit {

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

    isEmpty(): boolean {
        return this.appList.length === 0;
    }
}
