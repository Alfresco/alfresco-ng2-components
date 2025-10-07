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

import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { DataTableCellComponent } from '../datatable-cell/datatable-cell.component';
import { AppConfigService } from '../../../app-config/app-config.service';
import { DateConfig } from '../../data/data-column.model';
import { CommonModule } from '@angular/common';
import { LocalizedDatePipe, TimeAgoPipe } from '../../../pipes';

@Component({
    imports: [CommonModule, LocalizedDatePipe, TimeAgoPipe],
    selector: 'adf-date-cell',
    templateUrl: './date-cell.component.html',
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-datatable-content-cell' },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateCellComponent extends DataTableCellComponent implements OnInit {
    @Input()
    dateConfig: DateConfig;

    config: DateConfig = {};

    private readonly appConfig: AppConfigService = inject(AppConfigService);

    readonly defaultDateConfig: DateConfig = {
        format: 'medium',
        tooltipFormat: 'medium',
        locale: undefined
    };

    ngOnInit(): void {
        super.ngOnInit();
        this.setConfig();
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
        this.config.locale = this.dateConfig?.locale || this.getDefaultLocale();
    }

    private setDefaultConfig(): void {
        this.config.format = this.getDefaultFormat();
        this.config.tooltipFormat = this.getDefaultTooltipFormat();
        this.config.locale = this.getDefaultLocale();
    }

    private getDefaultFormat(): string {
        return this.column?.format || this.getAppConfigPropertyValue('dateValues.defaultDateFormat', this.defaultDateConfig.format);
    }

    private getDefaultLocale(): string {
        return this.getAppConfigPropertyValue('dateValues.defaultLocale', this.defaultDateConfig.locale);
    }

    private getDefaultTooltipFormat(): string {
        return this.getAppConfigPropertyValue('dateValues.defaultTooltipDateFormat', this.defaultDateConfig.tooltipFormat);
    }

    private getAppConfigPropertyValue(key: string, defaultValue: string): string {
        return this.appConfig.get(key, defaultValue);
    }
}
