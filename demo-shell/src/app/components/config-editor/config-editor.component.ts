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

import { Component } from '@angular/core';
import {
    AppConfigService,
    NotificationService,
    UserPreferencesService,
    UserPreferenceValues
} from '@alfresco/adf-core';

@Component({
    selector: 'app-config-editor',
    templateUrl: 'config-editor.component.html',
    styleUrls: ['./config-editor.component.scss']
})
export class ConfigEditorComponent {

    editor: any;
    code: any;
    field = 'content-metadata';
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

    constructor(private appConfig: AppConfigService,
                private userPreferencesService: UserPreferencesService,
                private notificationService: NotificationService) {
        this.code = JSON.stringify(appConfig.config['content-metadata']);
    }

    onSave() {
        try {
            if (this.isUserPreference) {
                this.userPreferencesService.set(this.userPreferenceProperty, JSON.parse(this.editor.getValue()));
            } else {
                this.appConfig.config[this.field] = JSON.parse(this.editor.getValue());
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

    fileConfClick() {
        this.isUserPreference = false;
        this.code = JSON.stringify(this.appConfig.config['files']);
        this.field = 'files';
        this.indentCode();
    }

    textOrientationClick() {
        this.isUserPreference = true;
        this.userPreferenceProperty = 'textOrientation';

        this.userPreferencesService.select(this.userPreferenceProperty).subscribe((textOrientation: number) => {
            this.code = JSON.stringify(textOrientation);
            this.field = 'textOrientation';
            this.indentCode();
        });

        this.indentCode();
    }

    searchConfClick() {
        this.isUserPreference = false;
        this.code = JSON.stringify(this.appConfig.config['search']);
        this.field = 'search';
        this.indentCode();
    }

    metadataConfClick() {
        this.isUserPreference = false;
        this.code = JSON.stringify(this.appConfig.config['content-metadata']);
        this.field = 'content-metadata';
        this.indentCode();
    }

    taskHeaderConfClick() {
        this.isUserPreference = false;
        this.code = JSON.stringify(this.appConfig.config['adf-task-header']);
        this.field = 'adf-task-header';
        this.indentCode();
    }

    processInstanceHeaderConfClick() {
        this.isUserPreference = false;
        this.code = JSON.stringify(this.appConfig.config['adf-process-instance-header']);
        this.field = 'adf-process-instance-header';
        this.indentCode();
    }

    startProcessConfClick() {
        this.isUserPreference = false;
        this.code = JSON.stringify(this.appConfig.config['adf-start-process']);
        this.field = 'adf-start-process';
        this.indentCode();
    }

    taskListCloudConfClick() {
        this.isUserPreference = false;
        this.code = JSON.stringify(this.appConfig.config['adf-cloud-task-list']);
        this.field = 'adf-cloud-task-list';
        this.indentCode();
    }

    editProcessFilterConfClick() {
        this.isUserPreference = false;
        this.code = JSON.stringify(this.appConfig.config['adf-edit-process-filter']);
        this.field = 'adf-edit-process-filter';
        this.indentCode();
    }

    editTaskFilterConfClick() {
        this.isUserPreference = false;
        this.code = JSON.stringify(this.appConfig.config['adf-edit-task-filter']);
        this.field = 'adf-edit-task-filter';
        this.indentCode();
    }

    processListCloudConfClick() {
        this.isUserPreference = false;
        this.code = JSON.stringify(this.appConfig.config['adf-cloud-process-list']);
        this.field = 'adf-cloud-process-list';
        this.indentCode();
    }

    infinitePaginationConfClick() {
        this.isUserPreference = true;
        this.userPreferenceProperty = UserPreferenceValues.PaginationSize;
        this.userPreferencesService.select(this.userPreferenceProperty).subscribe((pageSize: number) => {
            this.code = JSON.stringify(pageSize);
            this.field = 'adf-infinite-pagination';
            this.indentCode();
        });
    }

    supportedPageSizesClick() {
        this.isUserPreference = true;
        this.userPreferenceProperty = UserPreferenceValues.SupportedPageSizes;
        this.userPreferencesService.select(this.userPreferenceProperty).subscribe((supportedPageSizes: number) => {
            this.code = JSON.stringify(supportedPageSizes);
            this.field = 'adf-supported-page-size';
            this.indentCode();
        });
    }

    applicationListCloudConfClick() {
        this.isUserPreference = false;
        this.code = JSON.stringify(this.appConfig.config['alfresco-deployed-apps']);
        this.field = 'alfresco-deployed-apps';
        this.indentCode();
    }

    indentCode() {
        setTimeout(() => {
            this.editor.getAction('editor.action.formatDocument').run();
        }, 300);
    }

}
