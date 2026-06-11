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

import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ADF_TYPED_VALUE_FORMATTING_ENABLED, FormRulesEvent, FormService } from '@alfresco/adf-core';
import { isObservable } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface ReactivePreselectionHost<T> {
    getFieldId(): string;
    getFormId(): string;
    getFieldValue(): unknown;
    getPreselection(): T[];
    setPreselection(value: T[]): void;
    identityOf(item: T): string;
}

@Injectable()
export class ReactivePreselectionService<T = unknown> {
    private readonly formService = inject(FormService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly formattingToken = inject(ADF_TYPED_VALUE_FORMATTING_ENABLED, { optional: true });

    private host: ReactivePreselectionHost<T>;
    private formattingEnabled = false;
    private subscribed = false;

    connect(host: ReactivePreselectionHost<T>): void {
        this.host = host;
        if (isObservable(this.formattingToken)) {
            this.formattingToken.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((enabled) => this.setEnabled(enabled ?? false));
        } else {
            this.setEnabled(this.formattingToken ?? false);
        }
    }

    private setEnabled(enabled: boolean): void {
        this.formattingEnabled = enabled;
        if (enabled) {
            this.subscribeToFormRules();
        }
    }

    private subscribeToFormRules(): void {
        if (this.subscribed) {
            return;
        }
        this.subscribed = true;
        this.formService.formRulesEvent
            .pipe(
                filter((event) => event?.type === 'fieldValueChanged' && this.isExternalChange(event)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => this.sync());
    }

    private isExternalChange(event: FormRulesEvent): boolean {
        const eventFieldId = event?.field?.id;
        if (eventFieldId && eventFieldId === this.host.getFieldId()) {
            return false;
        }
        const eventFormId = event?.form?.id;
        return !eventFormId || eventFormId === this.host.getFormId();
    }

    private sync(): void {
        if (!this.formattingEnabled || !this.host) {
            return;
        }
        const next = this.toPreselection(this.host.getFieldValue());
        if (this.isSamePreselection(this.host.getPreselection(), next)) {
            return;
        }
        this.host.setPreselection(next);
    }

    private toPreselection(value: unknown): T[] {
        if (!value) {
            return [];
        }
        const entries = Array.isArray(value) ? value : [value];
        return entries.filter((entry): entry is T => !!entry && typeof entry === 'object');
    }

    private isSamePreselection(current: T[], next: T[]): boolean {
        if (current === next) {
            return true;
        }
        if (current?.length !== next.length) {
            return false;
        }
        return current.every((item, index) => this.host.identityOf(item) === this.host.identityOf(next[index]));
    }
}
