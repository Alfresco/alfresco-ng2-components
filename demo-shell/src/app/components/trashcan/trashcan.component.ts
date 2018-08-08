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

import { Component, ViewChild } from '@angular/core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { UserPreferencesService, UserPreferenceValues, RestoreMessageModel, NotificationService } from '@alfresco/adf-core';
import { Router } from '@angular/router';
import { PathInfoEntity } from 'alfresco-js-api';

@Component({
    templateUrl: './trashcan.component.html',
    styleUrls: ['trashcan.component.scss']
})
export class TrashcanComponent {
    @ViewChild('documentList')
    documentList: DocumentListComponent;

    currentLocale;

    constructor(
        private preference: UserPreferencesService,
        private router: Router,
        private notificationService: NotificationService
    ) {
        this.preference
            .select(UserPreferenceValues.Locale)
            .subscribe(locale => {
                this.currentLocale = locale;
            });
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
