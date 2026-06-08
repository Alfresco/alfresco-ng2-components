/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Injectable } from '@angular/core';
import { FormFieldModel } from '../components/widgets/core/form-field.model';
import { FormFieldTypes } from '../components/widgets/core/form-field-types';
import { FormFieldOption } from '../components/widgets/core/form-field-option';

export type FormFieldValueAdapter = (value: unknown, field: FormFieldModel) => unknown;

interface AdaptedUser {
    firstName: string;
    lastName?: string;
}

interface AdaptedGroup {
    name: string;
}

@Injectable({ providedIn: 'root' })
export class FormFieldValueAdapterService {
    private readonly adapters = new Map<string, FormFieldValueAdapter>();

    constructor() {
        this.register(FormFieldTypes.PEOPLE, (value) => this.adaptPeople(value));
        this.register(FormFieldTypes.FUNCTIONAL_GROUP, (value) => this.adaptGroup(value));
        this.register(FormFieldTypes.DROPDOWN, (value, field) => this.adaptDropdown(value, field));
        this.register(FormFieldTypes.RADIO_BUTTONS, (value) => this.adaptRadio(value));
    }

    register(fieldType: string, adapter: FormFieldValueAdapter): void {
        this.adapters.set(fieldType, adapter);
    }

    hasAdapter(fieldType: string): boolean {
        return this.adapters.has(fieldType);
    }

    adapt(value: unknown, field: FormFieldModel): unknown {
        const adapter = this.adapters.get(field?.type);
        if (!adapter) {
            return value;
        }
        return adapter(value, field);
    }

    private adaptPeople(value: unknown): unknown {
        if (value === null || value === undefined) {
            return value;
        }
        const entries = Array.isArray(value) ? value : [value];
        const adapted = entries.map((entry) => this.toUser(entry));
        return adapted.length > 0 ? adapted : null;
    }

    private adaptGroup(value: unknown): unknown {
        if (value === null || value === undefined) {
            return value;
        }
        const entries = Array.isArray(value) ? value : [value];
        const adapted = entries.map((entry) => this.toGroup(entry));
        return adapted.length > 0 ? adapted : null;
    }

    private adaptDropdown(value: unknown, field: FormFieldModel): unknown {
        if (value === null || value === undefined) {
            return value;
        }
        if (field.hasMultipleValues) {
            const entries = Array.isArray(value) ? value : [value];
            return entries.map((entry) => this.toOption(entry, field));
        }
        if (Array.isArray(value)) {
            return value.length ? this.toOptionId(value[0]) : null;
        }
        return this.toOptionId(value);
    }

    private adaptRadio(value: unknown): unknown {
        if (value === null || value === undefined) {
            return value;
        }
        if (Array.isArray(value)) {
            return value.length ? this.toOptionId(value[0]) : null;
        }
        return this.toOptionId(value);
    }

    private toUser(entry: unknown): unknown {
        if (typeof entry !== 'string') {
            return entry;
        }
        const trimmed = entry.trim();
        const separatorIndex = trimmed.indexOf(' ');
        if (separatorIndex === -1) {
            return { firstName: trimmed } as AdaptedUser;
        }
        return {
            firstName: trimmed.slice(0, separatorIndex),
            lastName: trimmed.slice(separatorIndex + 1)
        } as AdaptedUser;
    }

    private toGroup(entry: unknown): unknown {
        if (typeof entry !== 'string') {
            return entry;
        }
        return { name: entry } as AdaptedGroup;
    }

    private toOptionId(entry: unknown): unknown {
        if (entry && typeof entry === 'object') {
            return (entry as Record<string, unknown>)['id'] ?? entry;
        }
        return entry;
    }

    private toOption(entry: unknown, field: FormFieldModel): FormFieldOption {
        if (entry && typeof entry === 'object') {
            return entry as FormFieldOption;
        }
        const match = field.options?.find((option) => option.id === entry);
        if (match) {
            return match;
        }
        const optionId = entry as string;
        return { id: optionId, name: optionId };
    }
}
