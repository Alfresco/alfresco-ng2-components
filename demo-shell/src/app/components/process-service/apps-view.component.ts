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

import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AppDefinitionRepresentationModel } from '@alfresco/adf-process-services';

@Component({
    selector: 'app-process-list-view',
    templateUrl: './apps-view.component.html'
})
export class AppsViewComponent implements OnDestroy {

    layoutType = 'GRID';
    presetColumn = 'apps-list';
    actions: any;
    private routeSub: Subscription;

    constructor(private router: Router) {
        this.routeSub = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.fetchInfoFromUrl(event.url);
            }
        });

        const routerState = this.router.routerState.snapshot;
        this.fetchInfoFromUrl(routerState.url);
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }

    fetchInfoFromUrl(url: string) {
        const parts = url.split('/');
        if (parts.length > 2) {
            this.layoutType = parts[3].toUpperCase();
        }
    }

    onAppClicked(app: AppDefinitionRepresentationModel) {
        this.router.navigate(['/activiti/apps', app.id || 0, 'tasks']);
    }

    performAction(row: any): void {
        this.router.navigate(['/activiti/apps', row.id || 0, 'tasks']);
    }

    setActions(row: any): void {
        this.actions = [{ key: 'tasks', icon: 'assignment', label: 'View Task' }];
    }

    onRowDoubleClick(event: any) {
        const app = event.detail.value.obj;
        const id = app.id;
        this.router.navigate(['/activiti/apps', id || 0, 'tasks']);
    }
}
