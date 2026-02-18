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

import { ChangeDetectorRef, Component, inject, AfterViewInit, DestroyRef, InjectionToken } from '@angular/core';
import { debounceTime, filter, isObservable, Observable } from 'rxjs';
import { FormRulesEvent } from '../../../events';
import { FormExpressionService } from '../../../services/form-expression.service';
import { WidgetComponent } from '../widget.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface DisplayTextWidgetSettings {
    enableExpressionEvaluation: boolean;
    // a setting for a /juel API can be added here for full expression support
}

export const ADF_DISPLAY_TEXT_SETTINGS = new InjectionToken<DisplayTextWidgetSettings>('adf-display-text-settings');

@Component({
    template: '',
    standalone: true
})
export abstract class BaseDisplayTextWidgetComponent extends WidgetComponent implements AfterViewInit {
    private readonly formExpressionService = inject(FormExpressionService);
    private readonly cdr = inject(ChangeDetectorRef);
    private enableExpressionEvaluation: boolean = false;
    protected originalFieldValue?: string;

    private readonly settings = inject<Observable<DisplayTextWidgetSettings> | DisplayTextWidgetSettings>(ADF_DISPLAY_TEXT_SETTINGS, {
        optional: true
    });

    constructor() {
        super();
        if (isObservable(this.settings)) {
            this.settings.pipe(takeUntilDestroyed()).subscribe((data: DisplayTextWidgetSettings) => {
                this.updateSettingsBasedProperties(data);
            });
        } else {
            this.updateSettingsBasedProperties(this.settings);
        }
    }

    override ngAfterViewInit() {
        if (this.enableExpressionEvaluation) {
            this.storeOriginalValue();
            this.setupFieldDependencies();
            this.applyExpressions();
        }
        super.ngAfterViewInit();
    }

    protected abstract storeOriginalValue(): void;
    protected abstract evaluateExpressions(): void;
    protected abstract reevaluateExpressions(): void;
    private readonly destroyRef = inject(DestroyRef);

    protected resolveExpressions(text: string): string {
        return this.formExpressionService.resolveExpressions(this.field.form, text);
    }

    private applyExpressions() {
        if (!this.field) {
            return;
        }

        this.evaluateExpressions();
        this.cdr.detectChanges();
    }

    private setupFieldDependencies() {
        if (!this.field?.form || !this.originalFieldValue) {
            return;
        }

        const dependencies = this.formExpressionService.getFieldDependencies(this.originalFieldValue);
        if (dependencies.length === 0) {
            return;
        }

        this.formService.formRulesEvent
            .pipe(
                filter((event: FormRulesEvent) => event.type === 'fieldValueChanged' && event.field && dependencies.includes(event.field.id)),
                debounceTime(300),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
                this.reapplyExpressions();
            });
    }

    private reapplyExpressions() {
        if (!this.field || !this.originalFieldValue) {
            return;
        }

        this.reevaluateExpressions();
        this.fieldChanged.emit(this.field);
        this.cdr.detectChanges();
    }

    private updateSettingsBasedProperties(data: DisplayTextWidgetSettings): void {
        this.enableExpressionEvaluation = data?.enableExpressionEvaluation ?? false;
    }
}
