/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { DocumentListComponent, RestoreMessageModel } from '@alfresco/adf-content-services';
import { UserPreferencesService, UserPreferenceValues, NotificationService } from '@alfresco/adf-core';
import { Router } from '@angular/router';
import { PathInfoEntity } from '@alfresco/js-api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    templateUrl: './trashcan.component.html'
})
export class TrashcanComponent implements OnInit, OnDestroy {
    @ViewChild('documentList', { static: true })
    documentList: DocumentListComponent;

    currentLocale;

    private onDestroy$ = new Subject<boolean>();

    constructor(
        private preference: UserPreferencesService,
        private router: Router,
        private notificationService: NotificationService) {
    }

    ngOnInit() {
        this.preference
            .select(UserPreferenceValues.Locale)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(locale => this.currentLocale = locale);
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    onRestore(restoreMessage: RestoreMessageModel) {
        this.notificationService
            .openSnackMessageAction(
                restoreMessage.message,
                restoreMessage.action
            )
            .onAction()
            .subscribe(() => this.navigateLocation(restoreMessage.path));
        this.documentList.reload();
    }

    private navigateLocation(path: PathInfoEntity) {
        const parent = path.elements[path.elements.length - 1];
        this.router.navigate(['files/', parent.id]);
    }

    refresh() {
        this.documentList.reload();
        this.documentList.resetSelection();
    }
}
