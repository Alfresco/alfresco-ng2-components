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

import type { FormFieldModel } from '../components/widgets/core/form-field.model';
import { FormFieldTypes } from '../components/widgets/core/form-field-types';
import type { FormModel } from '../components/widgets/core/form.model';
import {
    captureAuthoredDefinition,
    commitFormState,
    FormResetItemResult,
    FormResetOptions,
    FormResetResult,
    FormResetStatus,
    FormWriteContext,
    getAuthoredDefault,
    hasFormStateBinding,
    formStateCommits
} from './form-state.model';
import {
    children,
    descendants,
    hasRetainedDescendant,
    hasUploadedContent,
    isPreserved,
    isStructural,
    isUnsupportedCategory,
    rootFieldOf
} from './form-reset-eligibility';
import {
    AuthoredRow,
    authoredFieldValue,
    authoredRowFor,
    authoredRowsOf,
    hasOwnValue,
    initialRows,
    normalizeSectionValue,
    parseDefault,
    prepareTemplateFields,
    requiresContextualDefault,
    rowDefaultNormalizer
} from './form-reset-defaults';

export { captureFormResetEditability } from './form-reset-eligibility';

type ItemStatus = FormResetItemResult['status'];
type ItemReason = FormResetItemResult['reason'];

const categoryRejectionOf = (field: FormFieldModel): ItemReason | undefined => {
    if (isUnsupportedCategory(field)) {
        return 'unsupported-category';
    }
    if (hasUploadedContent(field)) {
        return 'content-policy-unavailable';
    }
    return undefined;
};

const captureRepeatableDefinition = (field: FormFieldModel): Record<string, unknown> | undefined => {
    if (field.type !== FormFieldTypes.REPEATABLE_SECTION) {
        return undefined;
    }
    return captureAuthoredDefinition(field.json);
};

const isResetEditable = (form: FormModel, field: FormFieldModel, editableFields?: ReadonlySet<FormFieldModel>): boolean => {
    if (editableFields) {
        return editableFields.has(field);
    }
    return !form.readOnly && !isPreserved(field);
};

const needsRowContextualDefault = (
    section: FormFieldModel,
    target: FormFieldModel,
    value: unknown,
    resolved: ReadonlyMap<string, unknown>
): boolean => {
    const authored = getAuthoredDefault(target);
    const rows = authoredRowsOf(section, target, initialRows(section, value));
    const missingRowLiteral = rows.some((row) => !hasOwnValue(row, target.json.id));
    return !authored.hasValue && authored.selectLoggedUser && missingRowLiteral && !resolved.has(target.json.id);
};

class FormResetOperation {
    private readonly items: FormResetItemResult[] = [];
    private readonly contextualDefaults = new Map<string, unknown>();

    constructor(
        private readonly form: FormModel,
        private readonly context: FormWriteContext,
        private readonly options: FormResetOptions
    ) {}

    async run(): Promise<FormResetResult> {
        if (this.isCurrent()) {
            for (const root of this.form.fields) {
                await this.reset(rootFieldOf(root));
            }
        }
        return { context: this.context, items: this.items, status: this.status() };
    }

    private status(): FormResetStatus {
        const failed = this.items.some((item) => item.status === 'failed');
        const applied = this.items.some((item) => item.status === 'applied');
        if (!this.isCurrent()) {
            return 'unavailable';
        }
        if (!failed) {
            return 'complete';
        }
        return applied ? 'partial' : 'failed';
    }

    private isCurrent(): boolean {
        return (
            this.context?.form === this.form &&
            hasFormStateBinding(this.form, this.context.renderer, this.context.generation) &&
            this.context.isCurrent()
        );
    }

    private record(field: FormFieldModel, status: ItemStatus, reason?: ItemReason): void {
        this.items.push({ field, fieldId: field.id, status, ...(reason ? { reason } : {}) });
    }

    private reset(field: FormFieldModel, authoredRow?: AuthoredRow): Promise<void> {
        if (!this.shouldVisit(field)) {
            return Promise.resolve();
        }
        if (isStructural(field)) {
            return this.resetChildren(field, authoredRow);
        }
        if (field.type === FormFieldTypes.REPEATABLE_SECTION && hasRetainedDescendant(field, this.options.handledFields)) {
            return this.resetRetainedSection(field, authoredRow);
        }
        return this.resetValue(field, authoredRow);
    }

    private shouldVisit(field: FormFieldModel): boolean {
        if (!this.isCurrent() || this.options.handledFields?.has(field)) {
            return false;
        }
        if (isResetEditable(this.form, field, this.options.editableFields)) {
            return true;
        }
        this.record(field, 'skipped');
        return false;
    }

    private async resetChildren(field: FormFieldModel, authoredRow?: AuthoredRow): Promise<void> {
        for (const child of children(field)) {
            await this.reset(child, authoredRow);
        }
    }

    private async resetRetainedSection(section: FormFieldModel, authoredRow?: AuthoredRow): Promise<void> {
        const { value } = authoredFieldValue(section, authoredRow);
        this.record(section, 'failed', 'reset-shape-retained');
        for (const child of children(section)) {
            await this.reset(child, authoredRowFor(value, child));
        }
    }

    private async resetValue(field: FormFieldModel, authoredRow?: AuthoredRow): Promise<void> {
        const authored = authoredFieldValue(field, authoredRow);
        if (this.rejectsCategory(field)) {
            return;
        }
        let value = authored.value;
        if (requiresContextualDefault(field, authored)) {
            value = await this.resolveContextualDefault(field);
            if (!this.acceptContextualDefault(field, value)) {
                return;
            }
        }
        try {
            const repeatableDefinition = captureRepeatableDefinition(field);
            if (repeatableDefinition) {
                const prepared = await this.prepareRepeatableReset(field, repeatableDefinition, value);
                if (!prepared) {
                    return;
                }
                value = prepared.value;
            }
            this.commitDefault(field, value, repeatableDefinition);
        } catch {
            this.record(field, 'failed', 'application-failed');
        }
    }

    private rejectsCategory(field: FormFieldModel): boolean {
        const reason = categoryRejectionOf(field);
        if (!reason) {
            return false;
        }
        this.record(field, 'failed', reason);
        return true;
    }

    private commitDefault(field: FormFieldModel, value: unknown, repeatableDefinition?: Record<string, unknown>): void {
        const parsed = parseDefault(field, value);
        if (!this.isCurrent() || !commitFormState(field, parsed, this.context, repeatableDefinition)) {
            return;
        }
        this.record(field, 'applied');
        if (repeatableDefinition) {
            children(field).forEach((child) => this.publishRowCommits(child));
        }
    }

    private publishRowCommits(field: FormFieldModel): void {
        if (this.isCurrent()) {
            formStateCommits.next({ field, context: this.context });
            children(field).forEach((child) => this.publishRowCommits(child));
        }
    }

    private async resolveContextualDefault(field: FormFieldModel): Promise<unknown> {
        try {
            return await this.options.resolveContextualDefault?.(field, this.context);
        } catch {
            return undefined;
        }
    }

    private acceptContextualDefault(field: FormFieldModel, resolved: unknown, section?: FormFieldModel): boolean {
        if (!this.isCurrent()) {
            return false;
        }
        if (resolved === undefined || resolved === null) {
            this.record(field, 'failed', 'contextual-default-unavailable');
            if (section) {
                this.record(section, 'failed', 'reset-shape-retained');
            }
            return false;
        }
        this.contextualDefaults.set(field.json.id, resolved);
        return true;
    }

    private async prepareRepeatableReset(
        section: FormFieldModel,
        repeatableDefinition: Record<string, unknown>,
        value: unknown
    ): Promise<{ value: unknown } | undefined> {
        const start = this.items.length;
        for (const child of children(section)) {
            await this.reset(child, authoredRowFor(value, child));
        }
        if (this.items.slice(start).some((item) => item.status === 'failed')) {
            this.record(section, 'failed', 'reset-shape-retained');
            return undefined;
        }
        const existing = descendants(section);
        if (!(await this.resolveRowContextualDefaults(section, existing, value))) {
            return undefined;
        }
        const normalize = rowDefaultNormalizer(existing, this.contextualDefaults);
        repeatableDefinition.fields = prepareTemplateFields(repeatableDefinition.fields as Record<string, unknown>, normalize);
        return { value: normalizeSectionValue(repeatableDefinition, value, normalize) };
    }

    private async resolveRowContextualDefaults(section: FormFieldModel, existing: FormFieldModel[], value: unknown): Promise<boolean> {
        for (const target of existing.filter((child) => child.type === FormFieldTypes.PEOPLE)) {
            if (needsRowContextualDefault(section, target, value, this.contextualDefaults)) {
                const resolved = await this.resolveContextualDefault(target);
                if (!this.acceptContextualDefault(target, resolved, section)) {
                    return false;
                }
            }
        }
        return true;
    }
}

/**
 * Resets the exact live model without publishing ordinary edit events.
 *
 * @param form Exact live model
 * @param context Invocation ownership
 * @param options Optional contextual principal resolver
 * @returns Independent item results and aggregate status
 */
export function resetFormToDefaults(form: FormModel, context: FormWriteContext, options: FormResetOptions = {}): Promise<FormResetResult> {
    return new FormResetOperation(form, context, options).run();
}
