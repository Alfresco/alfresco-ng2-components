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

import { Directive, Inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { FeaturesServiceToken, FlagChangeset, IFeaturesService } from '../interfaces/features.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
    /* eslint-disable-next-line @angular-eslint/directive-selector */
    selector: '[adfForFeatures]'
})
export class FeaturesDirective {
    private hasView = false;
    private inputUpdate$ = new BehaviorSubject([] as string[]);

    @Input()
    set adfForFeatures(feature: string[] | string) {
        this.inputUpdate$.next(Array.isArray(feature) ? feature : [feature]);
    }

    constructor(
        @Inject(FeaturesServiceToken) private featuresService: IFeaturesService,
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef
    ) {
        combineLatest([this.featuresService.getFlags$(), this.inputUpdate$])
            .pipe(takeUntilDestroyed())
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
}
