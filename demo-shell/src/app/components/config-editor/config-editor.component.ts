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

import { Component, OnDestroy } from '@angular/core';
import { AppConfigService, NotificationService, UserPreferencesService } from '@alfresco/adf-core';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-config-editor',
    templateUrl: './config-editor.component.html',
    styleUrls: ['./config-editor.component.scss']
})
export class ConfigEditorComponent implements OnDestroy {
    private onDestroy$ = new Subject<boolean>();

    editor: any;
    code: any;
    field: string;
    invalidJson = false;
    isUserPreference = false;
    userPreferenceProperty: string;

    editorOptions = {
        theme: 'vs-dark',
        language: 'json',
        autoIndent: true,
        formatOnPaste: true,
        formatOnType: true
    };

    onInit(editor) {
        this.editor = editor;
        this.indentCode();
    }

    constructor(
        private appConfig: AppConfigService,
        private userPreferencesService: UserPreferencesService,
        private notificationService: NotificationService
    ) {
        this.code = JSON.stringify(appConfig.config);
    }

    onSave() {
        try {
            if (this.isUserPreference) {
                this.userPreferencesService.set(this.userPreferenceProperty, JSON.parse(this.editor.getValue()));
            } else {
                this.appConfig.config = JSON.parse(this.editor.getValue());
            }
        } catch (error) {
            this.invalidJson = true;
            this.notificationService.openSnackMessage('Wrong Code configuration ' + error);
        } finally {
            if (!this.invalidJson) {
                this.notificationService.openSnackMessage('Saved');
            }
        }
    }

    onClear() {
        this.code = '';
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    indentCode() {
        setTimeout(() => {
            this.editor.getAction('editor.action.formatDocument').run();
        }, 300);
    }
}
