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
import { BUILT_IN_FIELD_TYPES } from './built-in-field-types';
import type { FieldTypeDefinition, FieldTypeResolver } from './field-type-definition.interface';
import { FieldTypeReference, resolveFieldType } from './field-type-resolution';

export const FIELD_TYPE_DEFINITIONS = new InjectionToken<readonly (readonly FieldTypeDefinition[])[]>('FIELD_TYPE_DEFINITIONS');

export const FieldTypeState = {
    Registered: 'registered',
    Announced: 'announced',
    Unknown: 'unknown'
} as const;

export type FieldTypeState = (typeof FieldTypeState)[keyof typeof FieldTypeState];

/**
 * Registers field type definitions at startup. Definitions provided later replace earlier ones for the same type, so
 * an application can override a built-in field type.
 *
 * @param definitions the field type definitions
 * @returns the provider
 */
export const provideFieldTypes = (...definitions: FieldTypeDefinition[]): Provider => ({
    provide: FIELD_TYPE_DEFINITIONS,
    useValue: definitions,
    multi: true
});

@Injectable({ providedIn: 'root' })
export class FieldTypeRegistry implements FieldTypeResolver {
    private readonly registered = signal<ReadonlyMap<string, FieldTypeDefinition>>(
        new Map(
            [...BUILT_IN_FIELD_TYPES, ...(inject(FIELD_TYPE_DEFINITIONS, { optional: true }) ?? []).flat()].map((definition) => [
                definition.type,
                definition
            ])
        )
    );
    private readonly announced = signal<ReadonlySet<string>>(new Set());

    readonly definitions: Signal<ReadonlyMap<string, FieldTypeDefinition>> = this.registered.asReadonly();

    definitionFor(type: string): FieldTypeDefinition | undefined {
        return this.registered().get(type);
    }

    register(definition: FieldTypeDefinition): void {
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

    stateOf(type: string): FieldTypeState {
        return this.stateOfField({ type });
    }

    /**
     * Tells how a field can be rendered: registered (its own definition, or a custom widget handled by its value type),
     * announced (its definition is still loading) or unknown.
     *
     * @param field the field
     * @returns the field's type state
     */
    stateOfField(field: FieldTypeReference): FieldTypeState {
        if (resolveFieldType(this, field)) {
            return FieldTypeState.Registered;
        }
        return this.announced().has(field.type) ? FieldTypeState.Announced : FieldTypeState.Unknown;
    }
}
