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

import { Component } from '@angular/core';
import { AppConfigService, NotificationService } from '@alfresco/adf-core';

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

    constructor(private appConfig: AppConfigService, private notificationService: NotificationService) {
        this.code = JSON.stringify(appConfig.config['content-metadata']);
    }

    onSave() {
        try {
            this.appConfig.config[this.field] = JSON.parse(this.editor.getValue());
        } catch (error) {
            this.invalidJson = true;
            this.notificationService.openSnackMessage(
                'Wrong Code configuration ' + error,
                4000
            );
        } finally {
            if (!this.invalidJson) {
                this.notificationService.openSnackMessage(
                    'Saved'
                );
            }
        }
    }

    onClear() {
        this.code = '';
    }

    fileConfClick() {
        this.code = JSON.stringify(this.appConfig.config['files']);
        this.field = 'files';
        this.indentCode();
    }

    searchConfClick() {
        this.code = JSON.stringify(this.appConfig.config['search']);
        this.field = 'search';
        this.indentCode();
    }

    metadataConfClick() {
        this.code = JSON.stringify(this.appConfig.config['content-metadata']);
        this.field = 'content-metadata';
        this.indentCode();
    }

    taskHeaderConfClick() {
        this.code = JSON.stringify(this.appConfig.config['adf-task-header']);
        this.field = 'adf-task-header';
        this.indentCode();
    }

    processInstanceHeaderConfClick() {
        this.code = JSON.stringify(this.appConfig.config['adf-process-instance-header']);
        this.field = 'adf-process-instance-header';
        this.indentCode();
    }

    startProcessConfClick() {
        this.code = JSON.stringify(this.appConfig.config['adf-start-process']);
        this.field = 'adf-start-process';
        this.indentCode();
    }

    indentCode() {
        setTimeout(() => {
            this.editor.getAction('editor.action.formatDocument').run();
        }, 300);
    }

}
