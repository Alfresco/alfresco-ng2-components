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

import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormModel, FormFieldModel, FormService, FormOutcomeEvent, NotificationService, CoreAutomationService, FormRenderingService } from '@alfresco/adf-core';
import { ProcessFormRenderingService } from '@alfresco/adf-process-services';
import { InMemoryFormService } from '../../services/in-memory-form.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    providers: [
        { provide: FormService, useClass: InMemoryFormService },
        { provide: FormRenderingService, useClass: ProcessFormRenderingService }
    ],
    encapsulation: ViewEncapsulation.None
})
export class FormComponent implements OnInit, OnDestroy {

    form: FormModel;
    errorFields: FormFieldModel[] = [];
    formConfig: string;
    editor: any;
    keepPrefixedSpace = true;

    editorOptions = {
        theme: 'vs-dark',
        language: 'json',
        autoIndent: true,
        formatOnPaste: true,
        formatOnType: true,
        automaticLayout: true
    };

    private onDestroy$ = new Subject<boolean>();

    constructor(@Inject(FormService) private formService: InMemoryFormService,
                private notificationService: NotificationService,
                private automationService: CoreAutomationService) {
    }

    logErrors(errorFields: FormFieldModel[]) {
        this.errorFields = errorFields;
    }

    ngOnInit() {
        this.formService.executeOutcome
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((formOutcomeEvent: FormOutcomeEvent) => {
                formOutcomeEvent.preventDefault();
            });

        this.formConfig = JSON.stringify(
            this.automationService.forms.getFormDefinition()
        );
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
        this.form = this.formService.parseForm(JSON.parse(this.formConfig), null, false, this.keepPrefixedSpace);
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

    togglePrefixedSpace() {
        this.keepPrefixedSpace = !this.keepPrefixedSpace;
    }
}
