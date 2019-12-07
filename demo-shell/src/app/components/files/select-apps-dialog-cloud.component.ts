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

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AppListCloudComponent, AppsProcessCloudService } from '@alfresco/adf-process-services-cloud';
import { Observable, of, Subject } from 'rxjs/index';
import { catchError } from 'rxjs/operators';

@Component({
    selector: 'app-select-apps-dialog-cloud',
    templateUrl: 'select-apps-dialog-cloud.component.html'
})
export class SelectAppsDialogCloudComponent {

    processApps: any;
    formValues: any;
    selectedProcess: any;
    variables: any;
    processName: any;

    apps$: Observable<any>;
    loadingError$ = new Subject<boolean>();

    constructor(private appsProcessCloudService: AppsProcessCloudService,
                public dialogRef: MatDialogRef<SelectAppsDialogCloudComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.apps$ = this.appsProcessCloudService.getDeployedApplicationsByStatus(AppListCloudComponent.RUNNING_STATUS)
            .pipe(
                catchError(() => {
                    this.loadingError$.next(true);
                    return of();
                })
            );
    }

    onStartProcessSuccess() {

    }

    onCancelStartProcess() {

    }

    openSnackMessage() {
    }

    onStart(): void {
        this.dialogRef.close(this.selectedProcess);
    }
}
