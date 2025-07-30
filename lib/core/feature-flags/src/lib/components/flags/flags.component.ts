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

import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FeaturesServiceToken,
    IDebugFeaturesService,
    IFeaturesService,
    IWritableFeaturesService,
    WritableFeaturesServiceToken,
    WritableFlagChangeset
} from '../../interfaces/features.interface';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, map, take, tap } from 'rxjs/operators';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { FlagsOverrideComponent } from '../feature-override-indicator.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'adf-feature-flags-overrides',
    imports: [
        FlagsOverrideComponent,
        CommonModule,
        FormsModule,
        MatTableModule,
        MatSlideToggleModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatDialogModule,
        TranslatePipe
    ],
    templateUrl: './flags.component.html',
    styleUrls: ['./flags.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlagsComponent {
    displayedColumns: string[] = ['icon', 'flag', 'value'];
    flags$: Observable<{ fictive: boolean; flag: string; value: any }[]>;
    isEnabled = false;

    inputValue = '';
    inputValue$ = new BehaviorSubject<string>('');
    showPlusButton$!: Observable<boolean>;
    writableFlagChangeset: WritableFlagChangeset = {};
    constructor(
        @Inject(FeaturesServiceToken)
        private featuresService: IDebugFeaturesService & IFeaturesService<WritableFlagChangeset>,
        @Inject(WritableFeaturesServiceToken)
        private writableFeaturesService: IWritableFeaturesService
    ) {
        if (this.featuresService.isEnabled$) {
            this.featuresService
                .isEnabled$()
                .pipe(takeUntilDestroyed())
                .subscribe((isEnabled) => {
                    this.isEnabled = isEnabled;
                });
        }

        const flags$ = this.featuresService.getFlags$().pipe(
            tap((flags) => (this.writableFlagChangeset = flags)),
            map((flags) =>
                Object.keys(flags).map((key) => ({
                    flag: key,
                    value: flags[key].current,
                    fictive: flags[key]?.fictive ?? false
                }))
            )
        );

        const debouncedInputValue$ = this.inputValue$.pipe(debounceTime(100));

        this.flags$ = combineLatest([flags$, debouncedInputValue$]).pipe(
            map(([flags, inputValue]) => {
                if (!inputValue) {
                    return flags;
                }

                return flags.filter((flag) => flag.flag.includes(inputValue));
            })
        );

        this.showPlusButton$ = this.flags$.pipe(
            map((filteredFlags) => this.isEnabled && filteredFlags.length === 0 && this.inputValue.trim().length > 0)
        );
    }

    protected onChange(flag: string, value: boolean) {
        this.writableFeaturesService.setFlag(flag, value);
    }

    protected onEnable(value: boolean) {
        if (value) {
            this.writableFeaturesService.mergeFlags(this.writableFlagChangeset);
        }

        this.featuresService.enable(value);
    }

    onInputChange(text: string) {
        this.inputValue$.next(text);
    }

    onClearInput() {
        this.inputValue = '';
        this.inputValue$.next('');
    }

    protected onAdd(event: KeyboardEvent) {
        this.showPlusButton$.pipe(take(1)).subscribe((showPlusButton) => {
            if (showPlusButton && event.key === 'Enter' && event.shiftKey) {
                this.writableFeaturesService.setFlag(this.inputValue, false);
            }
        });
    }

    protected onAddButtonClick() {
        this.writableFeaturesService.setFlag(this.inputValue, false);
    }

    protected onDelete(flag: string) {
        this.writableFeaturesService.removeFlag(flag);
    }
}
