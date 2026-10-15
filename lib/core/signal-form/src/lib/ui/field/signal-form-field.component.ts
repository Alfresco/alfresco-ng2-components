/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, ErrorHandler, inject, input, signal, Type } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { FieldDefinition } from '../../definition/form-definition.model';
import { RowAddress, SignalForm } from '../../state/signal-form';
import { fieldWidget } from '../../widgets/field-widget';
import { FormWidgetRegistry, FormWidgetState } from '../../widgets/form-widget-registry';

/**
 * Renders one field with the widget the registry resolves for it, loading the widget's component lazily. It follows
 * the registry: a field type registered later replaces the placeholder, and the field keeps its value and state.
 */
@Component({
    selector: 'adf-signal-form-field',
    templateUrl: './signal-form-field.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgComponentOutlet, TranslatePipe]
})
export class SignalFormFieldComponent {
    private readonly registry = inject(FormWidgetRegistry);
    private readonly errorHandler = inject(ErrorHandler);

    readonly form = input.required<SignalForm>();
    readonly field = input.required<FieldDefinition>();
    readonly row = input<RowAddress>();

    protected readonly widgetState = FormWidgetState;
    protected readonly widget = computed(() => fieldWidget(this.registry, this.field()));
    protected readonly state = computed(() => this.registry.stateOfField(this.field()));
    protected readonly component = signal<Type<unknown> | undefined>(undefined);
    protected readonly loadFailed = signal(false);
    protected readonly inputs = computed(() => ({
        form: this.form(),
        field: this.form().fieldNode(this.field().id, this.row()),
        definition: this.field(),
        elementId: this.row() ? `${this.field().id}-Row${this.row().index}` : this.field().id
    }));

    constructor() {
        effect((onCleanup) => {
            const load = this.widget()?.definition.component;
            this.component.set(undefined);
            this.loadFailed.set(false);
            if (!load) {
                return;
            }
            let current = true;
            onCleanup(() => (current = false));
            load().then(
                (type) => current && this.component.set(type),
                (loadFailure) => {
                    if (current) {
                        this.loadFailed.set(true);
                    }
                    this.errorHandler.handleError(loadFailure);
                }
            );
        });
    }
}
