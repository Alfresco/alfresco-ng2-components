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

import { JsonPipe, NgClass, NgForOf, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { Component, Inject, Injector, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { FormRulesManager, formRulesManagerFactory } from '../models/form-rules.model';
import { FormService } from '../services/form.service';
import { FormFieldComponent } from './form-field/form-field.component';
import { FORM_FIELD_MODEL_RENDER_MIDDLEWARE, FormFieldModelRenderMiddleware } from './middlewares/middleware';
import { ContainerModel, FormFieldModel, FormModel, TabModel } from './widgets';

@Component({
    selector: 'adf-form-renderer',
    standalone: true,
    templateUrl: './form-renderer.component.html',
    styleUrls: ['./form-renderer.component.scss'],
    providers: [
        {
            provide: FormRulesManager,
            useFactory: formRulesManagerFactory,
            deps: [Injector]
        }
    ],
    imports: [
        NgClass,
        MatTabsModule,
        NgIf,
        NgForOf,
        NgTemplateOutlet,
        TranslateModule,
        MatButtonModule,
        MatIconModule,
        NgStyle,
        FormFieldComponent,
        JsonPipe,
        MatSlideToggleModule,
        FormsModule
    ],
    encapsulation: ViewEncapsulation.None
})
export class FormRendererComponent<T> implements OnInit, OnChanges, OnDestroy {
    /** Toggle debug options. */
    @Input()
    showDebugButton: boolean = false;

    @Input()
    formDefinition: FormModel;

    debugMode: boolean;

    fields: FormFieldModel[];

    constructor(
        public formService: FormService,
        private formRulesManager: FormRulesManager<T>,
        @Inject(FORM_FIELD_MODEL_RENDER_MIDDLEWARE)
        private middlewareServices: FormFieldModelRenderMiddleware[]
    ) {}

    ngOnInit(): void {
        this.runMiddlewareServices();
    }

    ngOnChanges(): void {
        this.formRulesManager.initialize(this.formDefinition);
    }

    ngOnDestroy() {
        this.formRulesManager.destroy();
    }

    hasTabs(): boolean {
        return this.formDefinition.tabs && this.formDefinition.tabs.length > 0;
    }

    visibleTabs(): TabModel[] {
        return this.formDefinition.tabs.filter((tab) => tab.isVisible);
    }

    onExpanderClicked(content: ContainerModel) {
        if (content?.isCollapsible()) {
            content.isExpanded = !content.isExpanded;
        }
    }

    getNumberOfColumns(content: ContainerModel): number {
        return (content.json?.numberOfColumns || 1) > (content.columns?.length || 1)
            ? content.json?.numberOfColumns || 1
            : content.columns?.length || 1;
    }

    /**
     * Serializes column fields
     *
     * @param content container model
     * @returns a list of form field models
     */
    getContainerFields(content: ContainerModel): FormFieldModel[] {
        const serialisedFormFields: FormFieldModel[] = [];
        const maxColumnFieldsSize = this.getMaxColumnFieldSize(content);
        for (let rowIndex = 0; rowIndex < maxColumnFieldsSize; rowIndex++) {
            content?.columns.flatMap((currentColumn) => {
                if (currentColumn?.fields[rowIndex]) {
                    serialisedFormFields.push(currentColumn?.fields[rowIndex]);
                } else {
                    const firstRowElementColSpan = currentColumn?.fields[0]?.colspan;
                    if (!!firstRowElementColSpan && rowIndex > 0) {
                        for (let i = 0; i < firstRowElementColSpan; i++) {
                            serialisedFormFields.push(null);
                        }
                    }
                }
            });
        }

        return serialisedFormFields;
    }

    private getMaxColumnFieldSize(content: ContainerModel): number {
        let maxFieldSize = 0;
        if (content?.columns?.length > 0) {
            maxFieldSize = content?.columns?.reduce((prevColumn, currentColumn) =>
                currentColumn.fields.length > prevColumn?.fields?.length ? currentColumn : prevColumn
            )?.fields?.length;
        }
        return maxFieldSize;
    }

    /**
     * Calculate the column width based on the numberOfColumns and current field's colspan property
     *
     * @param container container model
     * @returns the column width for the given model
     */
    getColumnWidth(container: ContainerModel): string {
        const colspan = container ? container.field.colspan : 1;
        return (100 / container.field.numberOfColumns) * colspan + '';
    }

    private runMiddlewareServices(): void {
        const formFields = this.formDefinition.getFormFields();

        formFields.forEach((field) => {
            this.middlewareServices.forEach((middlewareService) => {
                if (middlewareService.type === field.type) {
                    field = middlewareService.getParsedField(field);
                }
            });
        });
    }
}
