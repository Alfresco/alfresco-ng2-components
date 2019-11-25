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

import { AppsProcessService, TranslationService, CustomEmptyContentTemplateDirective } from '@alfresco/adf-core';
import { AfterContentInit, Component, EventEmitter, Input, OnInit, Output, ContentChild, OnDestroy } from '@angular/core';
import { Observable, Observer, of, Subject } from 'rxjs';
import { AppDefinitionRepresentationModel } from '../task-list';
import { IconModel } from './icon.model';
import { share, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'adf-apps',
    templateUrl: 'apps-list.component.html',
    styleUrls: ['./apps-list.component.scss']
})
export class AppsListComponent implements OnInit, AfterContentInit, OnDestroy {

    public static LAYOUT_LIST: string = 'LIST';
    public static LAYOUT_GRID: string = 'GRID';
    public static DEFAULT_TASKS_APP: string = 'tasks';
    public static DEFAULT_TASKS_APP_NAME: string = 'ADF_TASK_LIST.APPS.TASK_APP_NAME';
    public static DEFAULT_TASKS_APP_THEME: string = 'theme-2';
    public static DEFAULT_TASKS_APP_ICON: string = 'glyphicon-asterisk';
    public static DEFAULT_TASKS_APP_MATERIAL_ICON: string = 'favorite_border';

    @ContentChild(CustomEmptyContentTemplateDirective, { static: false })
    emptyCustomContent: CustomEmptyContentTemplateDirective;

    /** (**required**) Defines the layout of the apps. There are two possible
     * values, "GRID" and "LIST".
     */
    @Input()
    layoutType: string = AppsListComponent.LAYOUT_GRID;

    /** Provides a way to filter the apps to show. */
    @Input()
    filtersAppId: any[];

    /** Emitted when an app entry is clicked. */
    @Output()
    appClick: EventEmitter<AppDefinitionRepresentationModel> = new EventEmitter<AppDefinitionRepresentationModel>();

    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    private appsObserver: Observer<AppDefinitionRepresentationModel>;
    apps$: Observable<AppDefinitionRepresentationModel>;
    currentApp: AppDefinitionRepresentationModel;
    appList: AppDefinitionRepresentationModel [] = [];

    private iconsMDL: IconModel;

    loading: boolean = false;
    hasEmptyCustomContentTemplate: boolean = false;

    private onDestroy$ = new Subject<boolean>();

    constructor(
        private appsProcessService: AppsProcessService,
        private translationService: TranslationService) {
            this.apps$ = new Observable<AppDefinitionRepresentationModel>((observer) => this.appsObserver = observer)
                .pipe(share());
    }

    ngOnInit() {
        if (!this.isValidType()) {
            this.setDefaultLayoutType();
        }

        this.apps$
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((app: any) => this.appList.push(app));

        this.iconsMDL = new IconModel();
        this.load();
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    ngAfterContentInit() {
        if (this.emptyCustomContent) {
            this.hasEmptyCustomContentTemplate = true;
        }
    }

    private load() {
        this.loading = true;
        this.appsProcessService.getDeployedApplications()
        .subscribe(
            (res: AppDefinitionRepresentationModel[]) => {
                this.filterApps(res).forEach((app: AppDefinitionRepresentationModel) => {
                    if (this.isDefaultApp(app)) {
                        app.theme = AppsListComponent.DEFAULT_TASKS_APP_THEME;
                        app.icon = AppsListComponent.DEFAULT_TASKS_APP_ICON;
                        this.appsObserver.next(app);
                    } else if (app.deploymentId) {
                        this.appsObserver.next(app);
                    }
                    this.loading = false;
                });
            },
            (err) => {
                this.error.emit(err);
                this.loading = false;
            }
        );
    }

    isDefaultApp(app) {
        return app.defaultAppId === AppsListComponent.DEFAULT_TASKS_APP;
    }

    getAppName(app) {
        return this.isDefaultApp(app)
            ? this.translationService.get(AppsListComponent.DEFAULT_TASKS_APP_NAME)
            : of(app.name);
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
     */
    isSelected(appId: number): boolean {
        return (this.currentApp !== undefined && appId === this.currentApp.id);
    }

    private filterApps(apps: AppDefinitionRepresentationModel []): AppDefinitionRepresentationModel[] {
        const filteredApps: AppDefinitionRepresentationModel[] = [];
        if (this.filtersAppId) {
            apps.filter((app: AppDefinitionRepresentationModel) => {
                this.filtersAppId.forEach((filter) => {
                    if (app.defaultAppId === filter.defaultAppId ||
                        app.deploymentId === filter.deploymentId ||
                        app.name === filter.name ||
                        app.id === filter.id ||
                        app.modelId === filter.modelId ||
                        app.tenantId === filter.tenantId) {
                        filteredApps.push(app);
                    }
                });
            });
        } else {
            return apps;
        }
        return filteredApps;
    }

    /**
     * Check if the value of the layoutType property is an allowed value
     */
    isValidType(): boolean {
        if (this.layoutType && (this.layoutType === AppsListComponent.LAYOUT_LIST || this.layoutType === AppsListComponent.LAYOUT_GRID)) {
            return true;
        }
        return false;
    }

    /**
     * Assign the default value to LayoutType
     */
    setDefaultLayoutType(): void {
        this.layoutType = AppsListComponent.LAYOUT_GRID;
    }

    /**
     * Return true if the layout type is LIST
     */
    isList(): boolean {
        return this.layoutType === AppsListComponent.LAYOUT_LIST;
    }

    /**
     * Return true if the layout type is GRID
     */
    isGrid(): boolean {
        return this.layoutType === AppsListComponent.LAYOUT_GRID;
    }

    isEmpty(): boolean {
        return this.appList.length === 0;
    }

    isLoading(): boolean {
        return this.loading;
    }

    getTheme(app: AppDefinitionRepresentationModel): string {
        return app.theme ? app.theme : '';
    }

    getBackgroundIcon(app: AppDefinitionRepresentationModel): string {
        return this.iconsMDL.mapGlyphiconToMaterialDesignIcons(app.icon);
    }

}
