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
import { AfterContentInit, Component, ContentChild, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { AppsProcessCloudService } from '../../services/apps-process-cloud.service';
import { ApplicationInstanceModel } from '../../models/application-instance.model';
import { catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { AppDetailsCloudComponent } from '../app-details-cloud/app-details-cloud.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLineModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export const LAYOUT_LIST: string = 'LIST';
export const LAYOUT_GRID: string = 'GRID';
export const DEPLOYED_STATUS: string = 'DEPLOYED';

@Component({
    selector: 'adf-cloud-app-list',
    standalone: true,
    imports: [
        CommonModule,
        TranslatePipe,
        AppDetailsCloudComponent,
        MatIconModule,
        MatLineModule,
        MatListModule,
        EmptyContentComponent,
        MatProgressSpinnerModule
    ],
    templateUrl: './app-list-cloud.component.html',
    styleUrls: ['./app-list-cloud.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppListCloudComponent implements OnInit, AfterContentInit {
    @ContentChild(CustomEmptyContentTemplateDirective)
    emptyCustomContent: CustomEmptyContentTemplateDirective;

    /**
     * Defines the layout of the apps. There are two possible
     * values, "GRID" and "LIST".
     */
    @Input()
    layoutType: string = LAYOUT_GRID;

    /** Emitted when an app entry is clicked. */
    @Output()
    appClick = new EventEmitter<ApplicationInstanceModel>();

    apps$: Observable<any>;
    loadingError$ = new Subject<boolean>();
    hasEmptyCustomContentTemplate: boolean = false;

    constructor(private appsProcessCloudService: AppsProcessCloudService) {}

    ngOnInit() {
        if (!this.isValidType()) {
            this.setDefaultLayoutType();
        }

        this.apps$ = this.appsProcessCloudService.getDeployedApplicationsByStatus(DEPLOYED_STATUS).pipe(
            catchError(() => {
                this.loadingError$.next(true);
                return of();
            })
        );
    }

    ngAfterContentInit() {
        if (this.emptyCustomContent) {
            this.hasEmptyCustomContentTemplate = true;
        }
    }

    onSelectApp(app: ApplicationInstanceModel): void {
        this.appClick.emit(app);
    }

    /**
     * Check if the value of the layoutType property is an allowed value
     *
     * @returns `true` if layout type is valid, otherwise `false`
     */
    isValidType(): boolean {
        if (this.layoutType && (this.layoutType === LAYOUT_LIST || this.layoutType === LAYOUT_GRID)) {
            return true;
        }
        return false;
    }

    /**
     * Assign the default value to LayoutType
     */
    setDefaultLayoutType(): void {
        this.layoutType = LAYOUT_GRID;
    }

    /**
     * Check if the layout type is LIST
     *
     * @returns `true` if the layout is list, otherwise `false`
     */
    isList(): boolean {
        return this.layoutType === LAYOUT_LIST;
    }

    /**
     * Check if the layout type is GRID
     *
     * @returns `true` if layout is grid, otherwise `false`
     */
    isGrid(): boolean {
        return this.layoutType === LAYOUT_GRID;
    }
}
