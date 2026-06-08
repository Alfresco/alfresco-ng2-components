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
import { GroupModel } from '../components/widgets/core/group.model';
import { FullNamePipe } from '../../pipes/full-name.pipe';
import { UserLike } from '../../pipes/user-like.interface';

export type FormFieldValueFormatter = (value: any, field: FormFieldModel) => string;

@Injectable({ providedIn: 'root' })
export class FormFieldValueFormatterService {
    private readonly formatters = new Map<string, FormFieldValueFormatter>();
    private readonly fullNamePipe = new FullNamePipe();

    constructor() {
        this.register(FormFieldTypes.PEOPLE, (value) => this.formatPeople(value));
        this.register(FormFieldTypes.FUNCTIONAL_GROUP, (value) => this.formatGroup(value));
        this.register(FormFieldTypes.DROPDOWN, (value, field) => this.formatDropdown(value, field));
        this.register(FormFieldTypes.RADIO_BUTTONS, (value, field) => this.formatRadio(value, field));
    }

    register(fieldType: string, formatter: FormFieldValueFormatter): void {
        this.formatters.set(fieldType, formatter);
    }

    hasFormatter(fieldType: string): boolean {
        return this.formatters.has(fieldType);
    }

    format(field: FormFieldModel): string {
        return this.formatValue(field.value, field);
    }

    formatValue(value: any, field: FormFieldModel): string {
        if (value === null || value === undefined) {
            return '';
        }
        const formatter = this.formatters.get(field.type);
        if (formatter) {
            return formatter(value, field);
        }
        return this.stringifyValue(value);
    }

    stringifyValue(value: any): string {
        if (value === null || value === undefined) {
            return '';
        }
        if (typeof value === 'string') {
            return value;
        }
        if (value instanceof Date) {
            return String(value);
        }
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }
        return String(value);
    }

    private formatPeople(value: UserLike | UserLike[]): string {
        if (!value) {
            return '';
        }
        const users = Array.isArray(value) ? value : [value];
        if (users.length === 0) {
            return '';
        }
        return users
            .map((u) => this.fullNamePipe.transform(u))
            .filter((s) => !!s)
            .join(', ');
    }

    private formatGroup(value: GroupModel | GroupModel[]): string {
        if (!value) {
            return '';
        }
        const groups = Array.isArray(value) ? value : [value];
        if (groups.length === 0) {
            return '';
        }
        return groups
            .map((g) => g?.name ?? '')
            .filter((s) => !!s)
            .join(', ');
    }

    private formatDropdown(value: string | FormFieldOption | Array<string | FormFieldOption>, field: FormFieldModel): string {
        if (value === null || value === undefined) {
            return '';
        }
        if (typeof value === 'string') {
            if (value === '') {
                return '';
            }
            const option = field.options?.find((o) => o.id === value);
            return option?.name ?? value;
        }
        if (Array.isArray(value)) {
            if (value.length === 0) {
                return '';
            }
            return value
                .map((v) => {
                    if (typeof v === 'string') {
                        return field.options?.find((o) => o.id === v)?.name ?? v;
                    }
                    return v?.name ?? '';
                })
                .filter((s) => !!s)
                .join(', ');
        }
        return value?.name ?? JSON.stringify(value);
    }

    private formatRadio(value: string | FormFieldOption, field: FormFieldModel): string {
        if (value === null || value === undefined) {
            return '';
        }
        if (typeof value === 'string') {
            if (value === '') {
                return '';
            }
            const option = field.options?.find((o) => o.id === value);
            return option?.name ?? value;
        }
        return value?.name ?? JSON.stringify(value);
    }
}
