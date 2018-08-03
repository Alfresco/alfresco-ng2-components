/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2017 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
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
