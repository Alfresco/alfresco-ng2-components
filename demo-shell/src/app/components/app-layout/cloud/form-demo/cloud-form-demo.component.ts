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
import { FormFieldModel, NotificationService, FormRenderingService, CoreAutomationService } from '@alfresco/adf-core';
import { FormCloud, FormCloudService, UploadCloudWidgetComponent } from '@alfresco/adf-process-services-cloud';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'cloud-form-demo.component.html',
    styleUrls: ['cloud-form-demo.component.scss']
})
export class FormCloudDemoComponent implements OnInit, OnDestroy {

    form: FormCloud;
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
        private formRenderingService: FormRenderingService,
        private formService: FormCloudService,
        private automationService: CoreAutomationService) {
        this.formRenderingService.setComponentTypeResolver('upload', () => UploadCloudWidgetComponent, true);
    }

    logErrors(errorFields: FormFieldModel[]) {
        this.errorFields = errorFields;
    }

    ngOnInit() {
        const formDefinitionJSON = this.automationService.forms.getFormCloudDefinition();
        this.formConfig = JSON.stringify(formDefinitionJSON);
        this.parseForm();
    }

    onFormSaved() {
        this.notificationService.openSnackMessage('Task has been saved successfully');
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
            this.notificationService.openSnackMessage('Wrong form configuration');
        }
    }

    onClearFormConfig() {
        this.formConfig = '';
    }

    onConfigAdded($event: any): void {
        const file = $event.currentTarget.files[0];

        const fileReader = new FileReader();
        fileReader.onload = () => {
            this.formConfig = <string> fileReader.result;
        };
        fileReader.readAsText(file);

        this.onInitFormEditor(this.editor);

        $event.target.value = '';
    }
}
