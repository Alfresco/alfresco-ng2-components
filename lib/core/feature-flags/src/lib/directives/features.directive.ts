/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Directive, Inject, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { IFeaturesService, FeaturesServiceToken, FlagChangeset } from '../interfaces/features.interface';
import { takeUntil } from 'rxjs/operators';

@Directive({
    /* eslint-disable-next-line @angular-eslint/directive-selector */
    selector: '[adfForFeatures]',
    standalone: true
})
export class FeaturesDirective implements OnDestroy {
    private hasView = false;
    private inputUpdate$ = new BehaviorSubject([] as string[]);
    private destroy$ = new Subject();

    @Input()
    set forFeatures(feature: string[] | string) {
        this.inputUpdate$.next(Array.isArray(feature) ? feature : [feature]);
    }

    constructor(
        @Inject(FeaturesServiceToken) private featuresService: IFeaturesService,
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef
    ) {
        combineLatest([this.featuresService.getFlags$(), this.inputUpdate$])
            .pipe(takeUntil(this.destroy$))
            .subscribe(([flags, features]: any) => this.updateView(flags, features));
    }

    private updateView(flags: FlagChangeset, features: string[]) {
        const shouldShow = features.every((feature) => flags[feature]?.current);

        if (shouldShow && !this.hasView) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.hasView = true;
        } else if (!shouldShow && this.hasView) {
            this.viewContainer.clear();
            this.hasView = false;
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
