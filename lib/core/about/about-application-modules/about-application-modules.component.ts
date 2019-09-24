/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ObjectDataTableAdapter } from '../../datatable/data/object-datatable-adapter';
import { AppExtensionService, ExtensionRef } from '@alfresco/adf-extensions';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'adf-about-application-modules',
    templateUrl: './about-application-modules.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AboutApplicationModulesComponent implements OnInit, OnDestroy {

    extensionColumns: string[] = ['$id', '$name', '$version', '$vendor', '$license', '$runtime', '$description'];

    dependencyEntries: ObjectDataTableAdapter;
    extensions: ExtensionRef[];

    /** Toggles showing/hiding of extensions block. */
    @Input()
    showExtensions = true;

    /** Regular expression for filtering dependencies packages. */
    @Input() regexp = '^(@alfresco)';

    /** Current version of the app running */
    @Input() dependencies: any;

    private onDestroy$ = new Subject<boolean>();

    constructor(private appExtensions: AppExtensionService) {
    }

    ngOnInit() {
        const alfrescoPackages = Object.keys(this.dependencies).filter((val) => {
            return new RegExp(this.regexp).test(val);
        });

        const alfrescoPackagesTableRepresentation = [];
        alfrescoPackages.forEach((val) => {
            alfrescoPackagesTableRepresentation.push({
                name: val,
                version: (this.dependencies[val])
            });
        });

        this.dependencyEntries = new ObjectDataTableAdapter(alfrescoPackagesTableRepresentation, [
            { type: 'text', key: 'name', title: 'Name', sortable: true },
            { type: 'text', key: 'version', title: 'Version', sortable: true }
        ]);

        this.appExtensions.references$
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((extensions) => this.extensions = extensions);
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
