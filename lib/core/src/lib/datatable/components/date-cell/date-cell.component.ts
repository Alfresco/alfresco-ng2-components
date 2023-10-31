/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DataTableCellComponent } from '../datatable-cell/datatable-cell.component';
import { AppConfigService } from '../../../app-config/app-config.service';
import { DateConfig } from '../../data/data-column.model';
import { CommonModule } from '@angular/common';
import { LocalizedDatePipe, TimeAgoPipe } from '../../../pipes';

@Component({
    standalone: true,
    imports: [CommonModule, LocalizedDatePipe, TimeAgoPipe],
    selector: 'adf-date-cell',
    templateUrl: './date-cell.component.html',
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-date-cell adf-datatable-content-cell' },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateCellComponent extends DataTableCellComponent implements OnInit {

    @Input()
    dateConfig: DateConfig = {};

    readonly defaultDateConfig: DateConfig = {
        format: 'medium',
        tooltipFormat: 'medium',
        locale: undefined
    };

    constructor(private readonly appConfig: AppConfigService) {
        super();
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.setDefaultConfig();
    }

    private setDefaultConfig(): void {
        if (this.dateConfig) {
            this.dateConfig.format = this.dateConfig?.format ?? (this.column?.format || this.getAppConfigPropertyValue('dateValues.defaultDateFormat', this.defaultDateConfig.format));
            this.dateConfig.tooltipFormat = this.dateConfig?.tooltipFormat || this.getAppConfigPropertyValue('dateValues.defaultTooltipDateFormat', this.defaultDateConfig.tooltipFormat);
            this.dateConfig.locale = this.dateConfig?.locale || this.getAppConfigPropertyValue('dateValues.defaultLocale', this.defaultDateConfig.locale);
        } else {
            this.dateConfig = this.defaultDateConfig;
        }
    }

    private getAppConfigPropertyValue(key: string, defaultValue: string): string {
        return this.appConfig.get(key, defaultValue);
    }
}
