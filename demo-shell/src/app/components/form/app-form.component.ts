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

import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormModel, FormFieldModel, FormService, FormOutcomeEvent, NotificationService, FormRenderingService } from '@alfresco/adf-core';
import { FormComponent, ProcessFormRenderingService } from '@alfresco/adf-process-services';
import { InMemoryFormService } from '../../services/in-memory-form.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CoreAutomationService } from '../../../testing/automation.service';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-form',
    standalone: true,
    imports: [CommonModule, MatTabsModule, FormComponent, MonacoEditorModule, MatButtonModule, FormsModule, TranslateModule, MatIconModule],
    templateUrl: './app-form.component.html',
    styleUrls: ['./app-form.component.scss'],
    providers: [
        { provide: FormService, useClass: InMemoryFormService },
        { provide: FormRenderingService, useClass: ProcessFormRenderingService }
    ],
    encapsulation: ViewEncapsulation.None
})
export class AppFormComponent implements OnInit, OnDestroy {
    private formService = inject(FormService);
    private notificationService = inject(NotificationService);
    private automationService = inject(CoreAutomationService);

    form: FormModel;
    errorFields: FormFieldModel[] = [];
    formConfig: string;
    editor: any;

    editorOptions = {
        theme: 'vs-dark',
        language: 'json',
        autoIndent: true,
        formatOnPaste: true,
        formatOnType: true,
        automaticLayout: true
    };

    private onDestroy$ = new Subject<boolean>();

    logErrors(errorFields: FormFieldModel[]) {
        this.errorFields = errorFields;
    }

    ngOnInit() {
        this.formService.executeOutcome.pipe(takeUntil(this.onDestroy$)).subscribe((formOutcomeEvent: FormOutcomeEvent) => {
            formOutcomeEvent.preventDefault();
        });

        this.formConfig = JSON.stringify(this.automationService.forms.getFormDefinition());
        this.parseForm();
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    onInitFormEditor(editor) {
        this.editor = editor;
        setTimeout(() => {
            this.editor.getAction('editor.action.formatDocument').run();
        }, 1000);
    }

    parseForm() {
        this.form = this.formService.parseForm(JSON.parse(this.formConfig), null, false, true);
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