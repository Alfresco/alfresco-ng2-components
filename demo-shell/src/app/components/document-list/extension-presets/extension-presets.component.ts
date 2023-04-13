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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppExtensionService, DocumentListPresetRef } from '@alfresco/adf-extensions';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-extension-presets',
    templateUrl: './extension-presets.component.html'
})
export class ExtensionPresetsComponent implements OnInit, OnDestroy {
    onDestroy$ = new Subject<boolean>();

    columns: DocumentListPresetRef[] = [];
    isSmallScreen = false;

    constructor(
        private extensions: AppExtensionService,
        private breakpointObserver: BreakpointObserver
    ) {}

    ngOnInit() {
        this.columns = this.extensions.getDocumentListPreset('files');

        this.breakpointObserver
            .observe([
                Breakpoints.HandsetPortrait,
                Breakpoints.HandsetLandscape
            ])
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result) => {
                this.isSmallScreen = result.matches;
            });
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    trackById(_: number, obj: DocumentListPresetRef): string {
        return obj.id;
    }
}
