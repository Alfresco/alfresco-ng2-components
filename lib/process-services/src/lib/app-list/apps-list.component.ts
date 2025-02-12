/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { CustomEmptyContentTemplateDirective, EmptyContentComponent } from '@alfresco/adf-core';
import { AppsProcessService } from '../services/apps-process.service';
import { AfterContentInit, Component, ContentChild, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { IconModel } from './icon.model';
import { finalize, map } from 'rxjs/operators';
import { AppDefinitionRepresentation } from '@alfresco/js-api';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { MatLineModule } from '@angular/material/core';

const DEFAULT_TASKS_APP_NAME: string = 'ADF_TASK_LIST.APPS.TASK_APP_NAME';
const DEFAULT_TASKS_APP_THEME: string = 'theme-2';
const DEFAULT_TASKS_APP_ICON: string = 'glyphicon-asterisk';

export const APP_LIST_LAYOUT_LIST: string = 'LIST';
export const APP_LIST_LAYOUT_GRID: string = 'GRID';

@Component({
    selector: 'adf-apps',
    standalone: true,
    imports: [
        CommonModule,
        MatListModule,
        MatIconModule,
        MatCardModule,
        MatProgressSpinnerModule,
        TranslateModule,
        EmptyContentComponent,
        MatLineModule
    ],
    templateUrl: './apps-list.component.html',
    styleUrls: ['./apps-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-apps' }
})
export class AppsListComponent implements OnInit, AfterContentInit {
    @ContentChild(CustomEmptyContentTemplateDirective)
    emptyCustomContent: CustomEmptyContentTemplateDirective;

    /**
     * Defines the layout of the apps. There are two possible
     * values, "GRID" and "LIST".
     */
    @Input()
    layoutType: string = APP_LIST_LAYOUT_GRID;

    /** The default app to show when the component is loaded. */
    @Input()
    defaultAppId = 'tasks';

    /** Provides a way to filter the apps to show. */
    @Input()
    filtersAppId: AppDefinitionRepresentation[];

    /** Emitted when an app entry is clicked. */
    @Output()
    appClick = new EventEmitter<AppDefinitionRepresentation>();

    /** Emitted when an error occurs. */
    @Output()
    error = new EventEmitter<any>();

    currentApp: AppDefinitionRepresentation;
    appList: AppDefinitionRepresentation[] = [];
    loading: boolean = false;
    hasEmptyCustomContentTemplate: boolean = false;

    private iconsMDL: IconModel;
    constructor(private appsProcessService: AppsProcessService) {}

    ngOnInit() {
        if (!this.isValidType()) {
            this.setDefaultLayoutType();
        }

        this.iconsMDL = new IconModel();
        this.load();
    }

    ngAfterContentInit() {
        if (this.emptyCustomContent) {
            this.hasEmptyCustomContentTemplate = true;
        }
    }

    private isDefaultApp(app: AppDefinitionRepresentation): boolean {
        return app.defaultAppId === this.defaultAppId;
    }

    getAppName(app: AppDefinitionRepresentation): string {
        return this.isDefaultApp(app) ? DEFAULT_TASKS_APP_NAME : app.name || app.defaultAppId;
    }

    /**
     * Pass the selected app as next
     *
     * @param app application model
     */
    selectApp(app: AppDefinitionRepresentation) {
        this.currentApp = app;
        this.appClick.emit(app);
    }

    /**
     * Return true if the appId is the current app
     *
     * @param appId application id
     * @returns `true` if application is selected, otherwise `false`
     */
    isSelected(appId: number): boolean {
        return this.currentApp !== undefined && appId === this.currentApp.id;
    }

    /**
     * Check if the value of the layoutType property is an allowed value
     *
     * @returns `true` if layout type is valid, otherwise `false`
     */
    isValidType(): boolean {
        return this.layoutType && (this.layoutType === APP_LIST_LAYOUT_LIST || this.layoutType === APP_LIST_LAYOUT_GRID);
    }

    /**
     * Assign the default value to LayoutType
     */
    setDefaultLayoutType(): void {
        this.layoutType = APP_LIST_LAYOUT_GRID;
    }

    /**
     * Check if the layout type is LIST
     *
     * @returns `true` if current layout is in the list mode, otherwise `false`
     */
    isList(): boolean {
        return this.layoutType === APP_LIST_LAYOUT_LIST;
    }

    /**
     * Check if the layout type is GRID
     *
     * @returns `true` if current layout is in the grid mode, otherwise `false`
     */
    isGrid(): boolean {
        return this.layoutType === APP_LIST_LAYOUT_GRID;
    }

    isEmpty(): boolean {
        return this.appList.length === 0;
    }

    isLoading(): boolean {
        return this.loading;
    }

    getTheme(app: AppDefinitionRepresentation): string {
        return app.theme ? app.theme : '';
    }

    getBackgroundIcon(app: AppDefinitionRepresentation): string {
        return this.iconsMDL.mapGlyphiconToMaterialDesignIcons(app.icon);
    }

    private load() {
        this.loading = true;
        this.appsProcessService
            .getDeployedApplications()
            .pipe(
                map((apps) => apps.filter((app) => app.deploymentId !== undefined || app.defaultAppId === this.defaultAppId)),
                finalize(() => (this.loading = false))
            )
            .subscribe(
                (res) => {
                    const apps = this.filterApps(res, this.filtersAppId).map((app) => {
                        if (this.isDefaultApp(app)) {
                            app.theme = DEFAULT_TASKS_APP_THEME;
                            app.icon = DEFAULT_TASKS_APP_ICON;
                        }

                        return app;
                    });

                    this.appList = [...apps];
                },
                (err) => {
                    this.error.emit(err);
                }
            );
    }

    filterApps(apps: AppDefinitionRepresentation[], filter: Partial<AppDefinitionRepresentation>[]): AppDefinitionRepresentation[] {
        return filter && filter.length > 0
            ? apps.filter((app) =>
                  filter.some(
                      (f) =>
                          (f.defaultAppId && app.defaultAppId === f.defaultAppId) ||
                          (f.deploymentId && app.deploymentId === f.deploymentId) ||
                          (f.name && app.name === f.name) ||
                          (f.id !== undefined && app.id === f.id) ||
                          (f.modelId !== undefined && app.modelId === f.modelId) ||
                          (f.tenantId !== undefined && app.tenantId === f.tenantId)
                  )
              )
            : apps;
    }
}
