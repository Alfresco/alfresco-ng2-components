/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { FormFieldModel, FormModel, FormRenderingService, NotificationService } from '@alfresco/adf-core';
import { CloudFormRenderingService, FormCloudModule, FormCloudService } from '@alfresco/adf-process-services-cloud';
import { Subscription } from 'rxjs';
import { CustomEditorComponent, CustomWidgetComponent } from '../../../cloud/custom-form-components/custom-editor.component';
import { CoreAutomationService } from '../../../../../testing/automation.service';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    templateUrl: './cloud-form-demo.component.html',
    standalone: true,
    imports: [CommonModule, MatTabsModule, FormCloudModule, MonacoEditorModule, TranslateModule, FormsModule, MatButtonModule, MatIconModule],
    styleUrls: ['./cloud-form-demo.component.scss'],
    providers: [{ provide: FormRenderingService, useClass: CloudFormRenderingService }]
})
export class FormCloudDemoComponent implements OnInit, OnDestroy {
    form: FormModel;
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
        private formService: FormCloudService,
        private automationService: CoreAutomationService,
        private formRenderingService: FormRenderingService
    ) {
        this.formRenderingService.register({
            'demo-widget': () => CustomEditorComponent,
            'custom-editor': () => CustomEditorComponent,
            'custom-string': () => CustomWidgetComponent,
            'custom-datetime': () => CustomWidgetComponent,
            'custom-file': () => CustomWidgetComponent,
            'custom-number': () => CustomWidgetComponent,
            'custom-something': () => CustomWidgetComponent,
            'custom-boolean': () => CustomWidgetComponent,
            'custom-date': () => CustomWidgetComponent,
            custom: () => CustomWidgetComponent
        });
    }

    logErrors(errorFields: FormFieldModel[]) {
        this.errorFields = errorFields;
    }

    ngOnInit() {
        this.formConfig = JSON.stringify(this.automationService.forms.getFormCloudDefinition());
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
            this.formConfig = fileReader.result as string;
        };
        fileReader.readAsText(file);

        this.onInitFormEditor(this.editor);

        $event.target.value = '';
    }
}
