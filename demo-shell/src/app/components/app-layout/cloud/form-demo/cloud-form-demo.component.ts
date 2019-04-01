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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormFieldModel, NotificationService } from '@alfresco/adf-core';
import { FormCloudModel, FormCloudService } from '@alfresco/adf-process-services-cloud';
import { Subscription } from 'rxjs';
import { formDefinition } from './demo-form';

@Component({
    templateUrl: 'cloud-form-demo.component.html',
    styleUrls: ['cloud-form-demo.component.scss']
})
export class FormCloudDemoComponent implements OnInit, OnDestroy {

    form: FormCloudModel;
    errorFields: FormFieldModel[] = [];
    formConfig: string;
    editor: any;
    private subscriptions: Subscription[] = [];

    editorOptions = {
        theme: 'vs-dark',
        language: 'json',
        autoIndent: true,
        formatOnPaste: true,
        formatOnType: true,
        automaticLayout: true
    };

    constructor(
        private notificationService: NotificationService,
        private formService: FormCloudService) {

    }

    logErrors(errorFields: FormFieldModel[]) {
        this.errorFields = errorFields;
    }

    ngOnInit() {
        this.formConfig = formDefinition;
        this.parseForm();
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions = [];
    }

    onInitFormEditor(editor) {
        this.editor = editor;
        setTimeout(() => {
            this.editor.getAction('editor.action.formatDocument').run();
        }, 1000);
    }

    parseForm() {
        this.form = this.formService.parseForm(JSON.parse(this.formConfig));
    }

    onSaveFormConfig() {
        try {
            this.parseForm();
        } catch (error) {
            this.notificationService.openSnackMessage(
                'Wrong form configuration',
                4000
            );
        }
    }

    onClearFormConfig() {
        this.formConfig = '';
    }

    onConfigAdded($event: any): void {
        let file = $event.currentTarget.files[0];

        let fileReader = new FileReader();
        fileReader.onload = () => {
            this.formConfig = <string> fileReader.result;
        };
        fileReader.readAsText(file);

        this.onInitFormEditor(this.editor);

        $event.target.value = '';
    }
}
