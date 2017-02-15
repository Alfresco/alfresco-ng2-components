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
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { ActivitiTaskListService } from './../services/activiti-tasklist.service';
import { AppDefinitionRepresentationModel } from '../models/filter.model';
import { IconModel } from '../models/icon.model';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';

declare let componentHandler: any;

@Component({
    selector: 'activiti-apps',
    templateUrl: 'activiti-apps.component.html',
    styleUrls: ['./activiti-apps.component.css', './activiti-apps-grid.component.css'],
    providers: [ActivitiTaskListService]
})
export class ActivitiApps implements OnInit {

    public static LAYOUT_LIST: string = 'LIST';
    public static LAYOUT_GRID: string = 'GRID';
    public static DEFAULT_TASKS_APP: string = 'tasks';
    public static DEFAULT_TASKS_APP_NAME: string = 'Task App';
    public static DEFAULT_TASKS_APP_THEME: string = 'theme-2';
    public static DEFAULT_TASKS_APP_ICON: string = 'glyphicon-asterisk';
    public static DEFAULT_TASKS_APP_MATERIAL_ICON: string = 'favorite_border';

    @Input()
    layoutType: string = ActivitiApps.LAYOUT_GRID;

    @Output()
    appClick: EventEmitter<AppDefinitionRepresentationModel> = new EventEmitter<AppDefinitionRepresentationModel>();

    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    private appsObserver: Observer<AppDefinitionRepresentationModel>;
    apps$: Observable<AppDefinitionRepresentationModel>;

    currentApp: AppDefinitionRepresentationModel;

    appList: AppDefinitionRepresentationModel [] = [];

    private iconsMDL: IconModel;

    /**
     * Constructor
     * @param translate Translate service
     * @param activitiTaskList Task service
     */
    constructor(private translateService: AlfrescoTranslationService,
                private activitiTaskList: ActivitiTaskListService) {

        if (translateService) {
            translateService.addTranslationFolder('ng2-activiti-tasklist', 'node_modules/ng2-activiti-tasklist/src');
        }

        this.apps$ = new Observable<AppDefinitionRepresentationModel>(observer =>  this.appsObserver = observer).share();
    }

    ngOnInit() {
        if (!this.isValidType()) {
            this.setDefaultLayoutType();
        }

        this.apps$.subscribe((app: any) => {
            this.appList.push(app);
        });
        this.iconsMDL = new IconModel();
        this.load();
    }

    private load() {
        this.activitiTaskList.getDeployedApplications().subscribe(
            (res) => {
                res.forEach((app: AppDefinitionRepresentationModel) => {
                    if (app.defaultAppId === ActivitiApps.DEFAULT_TASKS_APP) {
                        app.name = ActivitiApps.DEFAULT_TASKS_APP_NAME;
                        app.theme = ActivitiApps.DEFAULT_TASKS_APP_THEME;
                        app.icon = ActivitiApps.DEFAULT_TASKS_APP_ICON;
                        this.appsObserver.next(app);
                    } else if (app.deploymentId) {
                        this.appsObserver.next(app);
                    }
                });
            },
            (err) => {
                this.error.emit(err);
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
     * Assign the default value to LayoutType
     */
    setDefaultLayoutType(): void {
        this.layoutType = ActivitiApps.LAYOUT_GRID;
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

    getTheme(app: AppDefinitionRepresentationModel): string {
        return app.theme ? app.theme : '';
    }

    getBackgroundIcon(app: AppDefinitionRepresentationModel): string {
        return this.iconsMDL.mapGlyphiconToMaterialDesignIcons(app.icon);
    }

}
