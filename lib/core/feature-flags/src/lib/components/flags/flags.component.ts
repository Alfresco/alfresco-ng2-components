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

import { ChangeDetectionStrategy, Component, computed, signal, Signal, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FeaturesServiceToken,
    IDebugFeaturesService,
    IWritableFeaturesService,
    WritableFeaturesServiceToken,
    WritableFlagChangeset
} from '../../interfaces/features.interface';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { FlagsOverrideComponent } from '../feature-override-indicator.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IconModule } from '@alfresco/adf-core';

@Component({
    selector: 'adf-feature-flags-overrides',
    imports: [
        FlagsOverrideComponent,
        CommonModule,
        FormsModule,
        MatTableModule,
        MatSlideToggleModule,
        MatToolbarModule,
        IconModule,
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
    private readonly featuresService = inject<IDebugFeaturesService>(FeaturesServiceToken);
    private readonly writableFeaturesService = inject<IWritableFeaturesService>(WritableFeaturesServiceToken);

    displayedColumns: string[] = ['icon', 'flag', 'value'];
    flags: Signal<{ fictive: boolean; flag: string; value: any }[]>;
    isEnabled: Signal<boolean>;

    inputValue = '';
    inputValue$ = new BehaviorSubject<string>('');
    showPlusButton: Signal<boolean>;
    writableFlagChangeset: WritableFlagChangeset = {};
    constructor(
        @Inject(FeaturesServiceToken)
        private featuresService: IDebugFeaturesService & IFeaturesService<WritableFlagChangeset>,
        @Inject(WritableFeaturesServiceToken)
        private writableFeaturesService: IWritableFeaturesService
    ) {
        this.isEnabled = this.featuresService.isEnabled$() ? toSignal(this.featuresService.isEnabled$()) : signal(false);

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

        this.flags = toSignal(
            combineLatest([flags$, debouncedInputValue$]).pipe(
                map(([flags, inputValue]) => {
                    if (!inputValue) {
                        return flags;
                    }

                    return flags.filter((flag) => flag.flag.includes(inputValue));
                })
            ),
            { initialValue: [] }
        );

        this.showPlusButton = computed(() => this.isEnabled() && this.flags()?.length === 0 && this.inputValue.trim().length > 0);
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
        if (this.showPlusButton() && event.key === 'Enter' && event.shiftKey) {
            this.writableFeaturesService.setFlag(this.inputValue, false);
        }
    }

    protected onAddButtonClick() {
        this.writableFeaturesService.setFlag(this.inputValue, false);
    }

    protected onDelete(flag: string) {
        this.writableFeaturesService.removeFlag(flag);
    }
}
