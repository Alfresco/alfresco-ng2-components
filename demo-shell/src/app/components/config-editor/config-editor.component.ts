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
    editorSearch: any;

    editorOptions = {
        theme: 'vs-dark',
        language: 'json',
        autoIndent: true,
        formatOnPaste: true,
        formatOnType: true
    };

    metadataConf: string;
    searchConf: string;

    onInitMetadata(editor) {
        this.editor = editor;
        setTimeout(() => {
            this.editor.getAction('editor.action.formatDocument').run();
        }, 1000);
    }

    onInitSearch(editor) {
        this.editorSearch = editor;
        setTimeout(() => {
            this.editorSearch.getAction('editor.action.formatDocument').run();
        }, 1000);
    }

    constructor(private appConfig: AppConfigService, private notificationService: NotificationService) {
        this.metadataConf = JSON.stringify(appConfig.config['content-metadata']);
        this.searchConf = JSON.stringify(appConfig.config['search']);
    }

    onSaveMetadata() {
        try {
            this.appConfig.config['content-metadata'] = JSON.parse(this.editor.getValue());
        } catch (error) {
            this.notificationService.openSnackMessage(
                'Wrong metadata configuration',
                4000
            );
        }
    }

    onSaveSearch() {
        try {
            this.appConfig.config['search'] = JSON.parse(this.editor.getValue());
        } catch (error) {
            this.notificationService.openSnackMessage(
                'Wrong sSearch configuration',
                4000
            );
        }
    }

    onClearMetadata() {
        this.metadataConf = '';
    }

    onClearSearch() {
        this.searchConf = '';
    }
}
