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

import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation, inject, ChangeDetectorRef } from '@angular/core';
import { DataTableCellComponent } from '../datatable-cell/datatable-cell.component';
import { AppConfigService } from '../../../app-config/app-config.service';
import { DateConfig } from '../../data/data-column.model';
import { LocalizedDatePipe, TimeAgoPipe } from '../../../pipes';
import { AsyncPipe } from '@angular/common';
import { UserPreferencesService, UserPreferenceValues } from '../../../common/services/user-preferences.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    imports: [LocalizedDatePipe, TimeAgoPipe, AsyncPipe],
    selector: 'adf-date-cell',
    templateUrl: './date-cell.component.html',
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-datatable-content-cell' },
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [LocalizedDatePipe]
})
export class DateCellComponent extends DataTableCellComponent implements OnInit {
    @Input()
    dateConfig: DateConfig;

    config: DateConfig = {};

    private readonly appConfig: AppConfigService = inject(AppConfigService);
    private readonly localizedDatePipe: LocalizedDatePipe = inject(LocalizedDatePipe);
    private readonly userPreferencesService: UserPreferencesService = inject(UserPreferencesService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    private userLocale: string = 'en';

    readonly defaultDateConfig: DateConfig = {
        format: 'medium',
        tooltipFormat: 'medium',
        locale: undefined
    };

    ngOnInit(): void {
        // Subscribe to locale changes
        this.userPreferencesService
            .select(UserPreferenceValues.Locale)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((locale) => {
                this.userLocale = locale || 'en';
                this.setConfig();
                this.updateValue(); // Recalculate computedTitle with new locale
                this.cdr.markForCheck();
            });

        this.setConfig();
        super.ngOnInit();
    }

    protected override computeTitle(value: any): string {
        if (this.tooltip) {
            return this.tooltip;
        }
        if (value) {
            return this.localizedDatePipe.transform(value, this.config.tooltipFormat, this.config.locale) || '';
        }
        return '';
    }

    private setConfig(): void {
        if (this.dateConfig) {
            this.setCustomConfig();
        } else {
            this.setDefaultConfig();
        }
    }

    private setCustomConfig(): void {
        this.config.format = this.dateConfig?.format || this.getDefaultFormat();
        this.config.tooltipFormat = this.dateConfig?.tooltipFormat || this.getDefaultTooltipFormat();
        this.config.locale = this.normalizeLocale(this.dateConfig?.locale || this.getDefaultLocale());
    }

    private setDefaultConfig(): void {
        this.config.format = this.getDefaultFormat();
        this.config.tooltipFormat = this.getDefaultTooltipFormat();
        this.config.locale = this.normalizeLocale(this.getDefaultLocale());
    }

    private normalizeLocale(locale: string): string {
        if (!locale) {
            return locale;
        }
        // Extract language code from locale like 'fr-FR' -> 'fr', 'en-US' -> 'en'
        // but keep special cases like 'pt-BR' and 'zh-CN' intact
        if (locale === 'pt-BR' || locale === 'zh-CN') {
            return locale;
        }
        return locale.split('-')[0];
    }

    private getDefaultFormat(): string {
        return this.column?.format || this.getAppConfigPropertyValue('dateValues.defaultDateFormat', this.defaultDateConfig.format);
    }

    private getDefaultLocale(): string {
        // Always use the user locale from UserPreferencesService
        // This is kept in sync via subscription and reflects the user's current locale choice
        return this.userLocale;
    }

    private getDefaultTooltipFormat(): string {
        return this.getAppConfigPropertyValue('dateValues.defaultTooltipDateFormat', this.defaultDateConfig.tooltipFormat);
    }

    private getAppConfigPropertyValue(key: string, defaultValue: string): string {
        return this.appConfig.get(key, defaultValue);
    }
}
