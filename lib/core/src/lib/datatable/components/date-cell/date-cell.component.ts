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

import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation, inject, effect, signal, computed } from '@angular/core';
import { DataTableCellComponent } from '../datatable-cell/datatable-cell.component';
import { AppConfigService } from '../../../app-config/app-config.service';
import { DateConfig } from '../../data/data-column.model';
import { LocalizedDatePipe, TimeAgoPipe } from '../../../pipes';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'adf-date-cell',
    template: `
        @if (formattedDate()) {
            <span [title]="title()" class="adf-datatable-cell-value">{{ formattedDate() }}</span>
        }
    `,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-datatable-content-cell' },
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [LocalizedDatePipe, TimeAgoPipe]
})
export class DateCellComponent extends DataTableCellComponent implements OnInit {
    @Input()
    dateConfig: DateConfig;

    config = signal<DateConfig>({});

    private readonly appConfig: AppConfigService = inject(AppConfigService);
    private readonly localizedDatePipe: LocalizedDatePipe = inject(LocalizedDatePipe);
    private readonly timeAgoPipe: TimeAgoPipe = inject(TimeAgoPipe);

    private userLocale: string = 'en';

    readonly defaultDateConfig: DateConfig = {
        format: 'medium',
        tooltipFormat: 'medium',
        locale: undefined
    };

    // Convert value$ observable to signal for reactive computation
    private readonly dateValue = toSignal(this.value$);

    // Computed signal that automatically formats the date based on value and config
    protected readonly formattedDate = computed(() => {
        const date = this.dateValue();
        const currentConfig = this.config();

        if (!date) {
            return '';
        }

        if (currentConfig.format === 'timeAgo') {
            return this.timeAgoPipe.transform(date, currentConfig.locale) || '';
        }

        return this.localizedDatePipe.transform(date, currentConfig.format, currentConfig.locale) || '';
    });

    constructor() {
        super();
        // Use effect to react to locale signal changes (must be in injection context)
        effect(() => {
            this.userLocale = this.userPreferencesService.localeSignal() || 'en';
            this.setConfig();
        });
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    protected override computeTitle(value: any): string {
        if (value) {
            const currentConfig = this.config();
            return this.localizedDatePipe.transform(value, currentConfig.tooltipFormat, currentConfig.locale) || '';
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
        this.config.set({
            format: this.dateConfig?.format || this.getDefaultFormat(),
            tooltipFormat: this.dateConfig?.tooltipFormat || this.getDefaultTooltipFormat(),
            locale: this.normalizeLocale(this.dateConfig?.locale || this.getDefaultLocale())
        });
    }

    private setDefaultConfig(): void {
        this.config.set({
            format: this.getDefaultFormat(),
            tooltipFormat: this.getDefaultTooltipFormat(),
            locale: this.normalizeLocale(this.getDefaultLocale())
        });
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
