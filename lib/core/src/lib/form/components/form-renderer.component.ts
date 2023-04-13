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

import { Component, ViewEncapsulation, Input, OnDestroy, Injector, OnChanges } from '@angular/core';
import { FormRulesManager, formRulesManagerFactory } from '../models/form-rules.model';
import { FormModel } from './widgets/core/form.model';
import { ContainerModel, FormFieldModel, TabModel } from './widgets';
import { FormService } from '../services/form.service';

@Component({
    selector: 'adf-form-renderer',
    templateUrl: './form-renderer.component.html',
    styleUrls: ['./form-renderer.component.scss'],
    providers: [
        {
            provide: FormRulesManager,
            useFactory: formRulesManagerFactory,
            deps: [Injector]
        }
    ],
    encapsulation: ViewEncapsulation.None
})
export class FormRendererComponent<T> implements OnChanges, OnDestroy {

    /** Toggle debug options. */
    @Input()
    showDebugButton: boolean = false;

    @Input()
    formDefinition: FormModel;

    debugMode: boolean;

    fields: FormFieldModel[];

    constructor(public formService: FormService, private formRulesManager: FormRulesManager<T>) {
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
        if (content && content.isCollapsible()) {
            content.isExpanded = !content.isExpanded;
        }
    }

    getNumberOfColumns(content: ContainerModel): number {
        return (content.json?.numberOfColumns || 1) > (content.columns?.length || 1) ?
            (content.json?.numberOfColumns || 1) :
            (content.columns?.length || 1);
    }

    /**
     * Serializes column fields
     */
    getContainerFields(content: ContainerModel): FormFieldModel[] {
        const serialisedFormFields: FormFieldModel[] = [];
        const maxColumnFieldsSize = this.getMaxColumnFieldSize(content);
        for (let rowIndex = 0; rowIndex < maxColumnFieldsSize; rowIndex++) {
            content?.columns.flatMap((currentColumn) => {
                if (!!currentColumn?.fields[rowIndex]) {
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
                currentColumn.fields.length > prevColumn?.fields?.length ? currentColumn : prevColumn)?.fields?.length;
        }
        return maxFieldSize;
    }

    /**
     * Calculate the column width based on the numberOfColumns and current field's colspan property
     *
     * @param container
     */
    getColumnWith(container: ContainerModel): string {
        const colspan = container ? container.field.colspan : 1;
        return (100 / container.field.numberOfColumns) * colspan + '';
    }

}
