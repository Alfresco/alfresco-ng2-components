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

import { inject, Injectable, InjectionToken, Provider, signal, Signal } from '@angular/core';
import { BUILT_IN_FORM_WIDGETS } from './built-in-form-widgets';
import { fieldWidget, WidgetField } from './field-widget';
import { FormWidgetDefinition, FormWidgetResolver } from './form-widget-definition';

export const FORM_WIDGETS = new InjectionToken<readonly (readonly FormWidgetDefinition[])[]>('FORM_WIDGETS');

export const FormWidgetState = {
    Registered: 'registered',
    Announced: 'announced',
    Unknown: 'unknown'
} as const;

export type FormWidgetState = (typeof FormWidgetState)[keyof typeof FormWidgetState];

/**
 * Registers field type definitions at startup. Definitions provided later replace earlier ones for the same type, so
 * an application can override a built-in widget.
 *
 * @param definitions the field type definitions
 * @returns the provider
 */
export const provideFormWidgets = (...definitions: FormWidgetDefinition[]): Provider => ({
    provide: FORM_WIDGETS,
    useValue: definitions,
    multi: true
});

/**
 * The field types known to the forms: the built-in ones, the ones provided at startup, and the ones registered at
 * runtime, for example project custom widgets or plugins. Everything that reads it reacts to later registrations.
 */
@Injectable({ providedIn: 'root' })
export class FormWidgetRegistry implements FormWidgetResolver {
    private readonly registered = signal<ReadonlyMap<string, FormWidgetDefinition>>(
        new Map(
            [...BUILT_IN_FORM_WIDGETS, ...(inject(FORM_WIDGETS, { optional: true }) ?? []).flat()].map((definition) => [definition.type, definition])
        )
    );
    private readonly announced = signal<ReadonlySet<string>>(new Set());

    readonly definitions: Signal<ReadonlyMap<string, FormWidgetDefinition>> = this.registered.asReadonly();

    definitionFor(type: string): FormWidgetDefinition | undefined {
        return this.registered().get(type);
    }

    register(definition: FormWidgetDefinition): void {
        this.registered.update((current) => new Map(current).set(definition.type, definition));
    }

    /**
     * Marks field types as coming, for example listed by a plugin manifest whose code is still loading.
     *
     * @param types the field types
     */
    announce(...types: string[]): void {
        this.announced.update((current) => new Set([...current, ...types]));
    }

    stateOf(type: string): FormWidgetState {
        return this.stateOfField({ type });
    }

    /**
     * Tells how a field can be rendered: registered (its own definition, or a custom widget handled by its value type),
     * announced (its definition is still loading) or unknown.
     *
     * @param field the field
     * @returns the field's widget state
     */
    stateOfField(field: WidgetField): FormWidgetState {
        if (fieldWidget(this, field)) {
            return FormWidgetState.Registered;
        }
        return this.announced().has(field.type) ? FormWidgetState.Announced : FormWidgetState.Unknown;
    }
}
